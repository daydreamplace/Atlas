import { useEffect, useRef } from "react";

interface Microbe {
  readonly spriteIndex: number;
  readonly originX: number;
  readonly originY: number;
  readonly depth: number;
  readonly size: number;
  readonly speed: number;
  readonly phase: number;
  readonly drift: number;
  readonly tilt: number;
}

const TAU = Math.PI * 2;
const LENS_RADIUS = 80;
const SPRITES = [
  "cocci-cluster-v3.png",
  "bacillus-short-v2.png",
  "amoeboid-cell-v3.png",
  "bacillus-flagella-v2.png",
  "cocci-chain-v3.png",
  "bacillus-curved-v2.png",
  "oval-cell-v3.png",
  "bacillus-dividing-v2.png",
] as const;

function createMicrobes(count: number): Microbe[] {
  return Array.from({ length: count }, (_, index) => {
    const depth = Math.random();
    return {
      spriteIndex: index % SPRITES.length,
      originX: -0.08 + Math.random() * 1.16,
      originY: -0.08 + Math.random() * 1.16,
      depth,
      // Small, soft specimens recede; the nearest ones have a distinct scale.
      size: 9 + depth ** 1.5 * 44 + Math.random() * 4,
      speed: 0.022 + depth * 0.04 + Math.random() * 0.012,
      phase: Math.random(),
      drift: Math.random() * TAU,
      tilt: (Math.random() - 0.5) * 1.3,
    };
  }).sort((a, b) => a.depth - b.depth);
}

function flowPosition(
  microbe: Microbe,
  elapsed: number,
  width: number,
  height: number,
  focusX: number,
  focusY: number,
  viewX: number,
  viewY: number,
) {
  const progress = (((microbe.phase + elapsed * microbe.speed) % 1) + 1) % 1;
  const easedProgress = progress * progress * (3 - 2 * progress);
  const projection = 0.52 + easedProgress * 0.72;
  const sourceX = microbe.originX * width;
  const sourceY = microbe.originY * height;
  const drift = 1.5 + microbe.depth * 8;
  const depthWeight = microbe.depth ** 1.8;
  // Keep the distant field anchored while the foreground follows the change
  // of viewpoint. The shared flow focus must respect depth as well.
  const restingX = (width <= 700 ? 0.52 : 0.61) * width;
  const restingY = (width <= 700 ? 0.52 : 0.49) * height;
  const focusWeight = 0.15 + depthWeight * 0.85;
  const focalX = restingX + (focusX - restingX) * focusWeight;
  const focalY = restingY + (focusY - restingY) * focusWeight;
  // A camera shift moves nearby specimens further than distant ones. Apply
  // the same projection to the organism and its trail, before local repulsion.
  const parallax = 3 + depthWeight * (90 + easedProgress * 5);
  const x =
    focalX +
    (sourceX - focalX) * projection +
    Math.sin(elapsed * 0.42 + microbe.drift) * drift -
    viewX * parallax * 1.7;
  const y =
    focalY +
    (sourceY - focalY) * projection +
    Math.cos(elapsed * 0.36 + microbe.drift) * drift -
    viewY * parallax * 0.42;
  return { x, y, progress };
}

function drawMicrobe(
  context: CanvasRenderingContext2D,
  sprite: HTMLImageElement,
  microbe: Microbe,
  x: number,
  y: number,
  rotation: number,
  opacity: number,
  scale = 1,
  sharp = false,
) {
  const displayWidth = microbe.size * scale;
  const displayHeight =
    displayWidth * (sprite.naturalHeight / sprite.naturalWidth);
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.globalAlpha = opacity;
  const blur = 1.35 * (1 - Math.min(1, microbe.depth / 0.72)) ** 1.4;
  context.filter = sharp || blur < 0.08 ? "none" : `blur(${blur.toFixed(2)}px)`;
  context.drawImage(
    sprite,
    -displayWidth / 2,
    -displayHeight / 2,
    displayWidth,
    displayHeight,
  );
  context.restore();
}

export function HeroMicrobeField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest<HTMLElement>(".home-hero-section");
    const context = canvas?.getContext("2d");
    if (!canvas || !hero || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    hero.style.setProperty("--lens-diameter", `${LENS_RADIUS * 2}px`);
    const sprites = SPRITES.map(() => new Image());
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let lastTime = performance.now();
    let elapsed = 0;
    let disposed = false;
    const pointer = {
      x: 0.61,
      y: 0.49,
      velocityX: 0,
      velocityY: 0,
      inside: false,
      active: false,
    };
    const flowFocus = { x: 0.61, y: 0.49 };
    const view = { x: 0, y: 0 };
    let microbes: Microbe[] = [];

    const draw = (time: number) => {
      animationFrame = 0;
      const delta = Math.max(0, Math.min(0.04, (time - lastTime) / 1000));
      lastTime = time;
      if (!reduceMotion.matches) elapsed += delta;

      const cameraEnabled =
        pointer.inside && finePointer.matches && !reduceMotion.matches;
      const viewTargetX = cameraEnabled
        ? Math.max(-1, Math.min(1, (pointer.x - 0.5) * 2))
        : 0;
      const viewTargetY = cameraEnabled
        ? Math.max(-1, Math.min(1, (pointer.y - 0.5) * 2))
        : 0;
      // The viewpoint has more weight than the light: a soft orbit rather
      // than a panel attached directly to the cursor.
      const viewEase = reduceMotion.matches ? 1 : 1 - Math.exp(-delta * 4.8);
      const previousViewX = view.x;
      const previousViewY = view.y;
      view.x += (viewTargetX - view.x) * viewEase;
      view.y += (viewTargetY - view.y) * viewEase;
      if (Math.abs(viewTargetX - view.x) < 0.0001) view.x = viewTargetX;
      if (Math.abs(viewTargetY - view.y) < 0.0001) view.y = viewTargetY;
      if (view.x !== previousViewX || view.y !== previousViewY) {
        hero.style.setProperty("--hero-view-x", view.x.toFixed(4));
        hero.style.setProperty("--hero-view-y", view.y.toFixed(4));
      }

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";
      const restingX = width <= 700 ? 0.52 : 0.61;
      const restingY = width <= 700 ? 0.52 : 0.49;
      const lightX =
        (pointer.inside
          ? Math.max(0.18, Math.min(0.82, pointer.x))
          : restingX) * width;
      const lightY =
        (pointer.inside
          ? Math.max(0.18, Math.min(0.78, pointer.y))
          : restingY) * height;
      const lensX = pointer.x * width;
      const lensY = pointer.y * height;
      const focusTargetX = pointer.inside
        ? restingX + (pointer.x - restingX) * 0.3
        : restingX;
      const focusTargetY = pointer.inside
        ? restingY + (pointer.y - restingY) * 0.24
        : restingY;
      const focusEase = 1 - Math.exp(-delta * 5.4);
      flowFocus.x += (focusTargetX - flowFocus.x) * focusEase;
      flowFocus.y += (focusTargetY - flowFocus.y) * focusEase;
      pointer.velocityX *= Math.exp(-delta * 6.2);
      pointer.velocityY *= Math.exp(-delta * 6.2);

      for (const microbe of microbes) {
        const sprite = sprites[microbe.spriteIndex];
        if (!sprite.complete || !sprite.naturalWidth) continue;
        let position = flowPosition(
          microbe,
          elapsed,
          width,
          height,
          flowFocus.x * width,
          flowFocus.y * height,
          view.x,
          view.y,
        );
        const previous = flowPosition(
          microbe,
          elapsed - 0.14,
          width,
          height,
          flowFocus.x * width,
          flowFocus.y * height,
          view.x,
          view.y,
        );
        if (pointer.inside) {
          const dx = position.x - lensX;
          const dy = position.y - lensY;
          const distance = Math.hypot(dx, dy);
          const reactionRadius = 190 + microbe.depth * 115;
          const influence = Math.max(0, 1 - distance / reactionRadius);

          if (influence > 0 && distance > 0) {
            const repel = influence * influence * (26 + microbe.depth * 52);
            const eddy =
              Math.sin(elapsed * 1.2 + microbe.drift) * influence * 18;
            const wake = influence * (0.24 + position.progress * 0.22);
            position = {
              x: position.x + (dx / distance) * repel - (dy / distance) * eddy,
              y: position.y + (dy / distance) * repel + (dx / distance) * eddy,
              progress: position.progress,
            };
            position.x += pointer.velocityX * wake;
            position.y += pointer.velocityY * wake;
          }
        }

        const edgeFade = Math.max(
          0,
          Math.min(
            1,
            position.x / 40,
            (width - position.x) / 40,
            position.y / 30,
            (height - position.y) / 30,
          ),
        );
        if (edgeFade <= 0) continue;
        const lightDistance = Math.hypot(
          (position.x - lightX) / Math.max(1, width * 0.2),
          (position.y - lightY) / Math.max(1, height * 0.2),
        );
        const illumination = Math.max(0, 1 - lightDistance);
        const opacity =
          (0.16 +
            microbe.depth * 0.32 +
            position.progress * 0.16 +
            illumination * 0.08) *
          edgeFade;
        const rotation =
          Math.atan2(position.y - previous.y, position.x - previous.x) +
          microbe.tilt +
          Math.sin(elapsed * 0.28 + microbe.drift) * 0.12;

        context.save();
        if (pointer.active) {
          context.beginPath();
          context.rect(0, 0, width, height);
          context.moveTo(lensX + LENS_RADIUS, lensY);
          context.arc(lensX, lensY, LENS_RADIUS, 0, TAU);
          context.clip("evenodd");
        }

        // Short translucent trails, never long neon tails or accumulated pixels.
        if (!reduceMotion.matches && microbe.depth > 0.3) {
          const tail = flowPosition(
            microbe,
            elapsed - 0.38,
            width,
            height,
            flowFocus.x * width,
            flowFocus.y * height,
            view.x,
            view.y,
          );
          const gradient = context.createLinearGradient(
            tail.x,
            tail.y,
            position.x,
            position.y,
          );
          gradient.addColorStop(0, "rgba(150, 128, 191, 0)");
          gradient.addColorStop(1, `rgba(185, 166, 218, ${opacity * 0.5})`);
          context.save();
          context.strokeStyle = gradient;
          context.lineWidth = 0.9 + microbe.depth * 1.25;
          context.beginPath();
          context.moveTo(tail.x, tail.y);
          context.quadraticCurveTo(
            previous.x,
            previous.y,
            position.x,
            position.y,
          );
          context.stroke();
          context.restore();
        }
        drawMicrobe(
          context,
          sprite,
          microbe,
          position.x,
          position.y,
          rotation,
          opacity,
          0.76 + position.progress * 0.3,
        );
        context.restore();

        if (
          pointer.active &&
          Math.hypot(position.x - lensX, position.y - lensY) <
            LENS_RADIUS + microbe.size
        ) {
          context.save();
          context.beginPath();
          context.arc(lensX, lensY, LENS_RADIUS, 0, TAU);
          context.clip();
          drawMicrobe(
            context,
            sprite,
            microbe,
            lensX + (position.x - lensX) * 1.65,
            lensY + (position.y - lensY) * 1.65,
            rotation,
            Math.min(0.82, opacity * 1.6),
            (0.76 + position.progress * 0.3) * 1.65,
            true,
          );
          context.restore();
        }
      }
      context.globalCompositeOperation = "source-over";
      if (!disposed && !reduceMotion.matches && isVisible && isPageVisible) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const start = () => {
      if (disposed || animationFrame || !isVisible || !isPageVisible) return;
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(draw);
    };

    const redraw = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (isVisible && isPageVisible) draw(performance.now());
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const pixelRatio = Math.min(1.6, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const count =
        width < 680 ? 52 : Math.min(190, Math.round((width * height) / 9600));
      microbes = createMicrobes(count).map((microbe) => ({
        ...microbe,
        size: microbe.size * (width < 680 ? 0.78 : 1),
      }));
      redraw();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !finePointer.matches) return;
      const rect = hero.getBoundingClientRect();
      const nextX = (event.clientX - rect.left) / rect.width;
      const nextY = (event.clientY - rect.top) / rect.height;
      pointer.velocityX = (nextX - pointer.x) * rect.width;
      pointer.velocityY = (nextY - pointer.y) * rect.height;
      pointer.x = nextX;
      pointer.y = nextY;
      pointer.inside = true;
      pointer.active = true;
      hero.style.setProperty("--lens-x", `${(pointer.x * 100).toFixed(2)}%`);
      hero.style.setProperty("--lens-y", `${(pointer.y * 100).toFixed(2)}%`);
      hero.dataset.microbeLens = String(pointer.active);
      if (reduceMotion.matches) redraw();
    };

    const handlePointerLeave = () => {
      pointer.inside = false;
      pointer.active = false;
      pointer.velocityX = 0;
      pointer.velocityY = 0;
      hero.dataset.microbeLens = "false";
      if (reduceMotion.matches) redraw();
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) start();
      else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    sprites.forEach((sprite, index) => {
      sprite.onload = () => {
        if (!disposed) redraw();
      };
      sprite.src = `${import.meta.env.BASE_URL}images/main-page/hero/microbes/${SPRITES[index]}`;
    });

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) start();
        else if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { threshold: 0.02 },
    );
    resizeObserver.observe(hero);
    visibilityObserver.observe(hero);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", redraw);
    finePointer.addEventListener("change", handlePointerLeave);
    resize();

    return () => {
      disposed = true;
      sprites.forEach((sprite) => {
        sprite.onload = null;
      });
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", redraw);
      finePointer.removeEventListener("change", handlePointerLeave);
      hero.style.removeProperty("--lens-diameter");
      hero.style.removeProperty("--hero-view-x");
      hero.style.removeProperty("--hero-view-y");
      delete hero.dataset.microbeLens;
    };
  }, []);

  return <canvas ref={canvasRef} className="home-microbe-field" aria-hidden />;
}
