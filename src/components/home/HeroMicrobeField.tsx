import { useEffect, useRef } from "react";

interface Microbe {
  readonly spriteIndex: number;
  readonly orbit: number;
  readonly orbitStretch: number;
  readonly size: number;
  readonly speed: number;
  readonly phase: number;
  readonly drift: number;
  readonly opacity: number;
}

const TAU = Math.PI * 2;
const ATLAS_COLUMNS = 4;
const ATLAS_ROWS = 3;

function createMicrobes(count: number): Microbe[] {
  return Array.from({ length: count }, (_, index) => {
    const depth = (index % 9) / 8;

    return {
      spriteIndex: index % (ATLAS_COLUMNS * ATLAS_ROWS),
      orbit: 0.18 + Math.random() * 0.58,
      orbitStretch: 0.84 + Math.random() * 0.36,
      size: 7 + depth * 8 + Math.random() * 5,
      speed: (0.045 + Math.random() * 0.07) * (index % 8 === 0 ? -1 : 1),
      phase: Math.random() * TAU,
      drift: Math.random() * TAU,
      opacity: 0.14 + depth * 0.16,
    };
  });
}

function removeAtlasBackground(image: HTMLImageElement) {
  const processed = document.createElement("canvas");
  processed.width = image.naturalWidth;
  processed.height = image.naturalHeight;
  const context = processed.getContext("2d", { willReadFrequently: true });
  if (!context) return image;

  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(
    0,
    0,
    processed.width,
    processed.height,
  );
  const pixels = imageData.data;

  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const brightness = red * 0.22 + green * 0.55 + blue * 0.23;
    const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
    const detail = Math.max(0, brightness - 68) + spread * 0.42;
    const extractedAlpha = Math.max(0, Math.min(255, (detail - 8) * 3.2));
    pixels[index + 3] = Math.min(pixels[index + 3], extractedAlpha);
  }

  context.clearRect(0, 0, processed.width, processed.height);
  context.putImageData(imageData, 0, 0);
  return processed;
}

function drawMicrobe(
  context: CanvasRenderingContext2D,
  atlas: CanvasImageSource,
  atlasWidth: number,
  atlasHeight: number,
  microbe: Microbe,
  x: number,
  y: number,
  rotation: number,
  pulse: number,
  edgeFade: number,
) {
  const cellWidth = atlasWidth / ATLAS_COLUMNS;
  const cellHeight = atlasHeight / ATLAS_ROWS;
  const column = microbe.spriteIndex % ATLAS_COLUMNS;
  const row = Math.floor(microbe.spriteIndex / ATLAS_COLUMNS);
  const insetX = cellWidth * 0.025;
  const insetY = cellHeight * 0.035;
  const sourceWidth = cellWidth - insetX * 2;
  const sourceHeight = cellHeight - insetY * 2;
  const displayHeight = microbe.size * (0.82 + pulse * 0.16);
  const displayWidth = displayHeight * (sourceWidth / sourceHeight);

  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.globalAlpha = microbe.opacity * edgeFade * (0.82 + pulse * 0.18);
  context.filter = microbe.opacity < 0.2 ? "blur(0.45px)" : "none";
  context.drawImage(
    atlas,
    column * cellWidth + insetX,
    row * cellHeight + insetY,
    sourceWidth,
    sourceHeight,
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
    const atlasImage = new Image();
    let atlas: CanvasImageSource | null = null;
    let atlasWidth = 0;
    let atlasHeight = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let lastTime = performance.now();
    let elapsed = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };
    let microbes = createMicrobes(window.innerWidth < 680 ? 46 : 88);

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(1.6, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      microbes = createMicrobes(width < 680 ? 46 : 88);
    };

    const draw = (time: number) => {
      animationFrame = 0;
      const delta = Math.min(0.04, (time - lastTime) / 1000);
      lastTime = time;
      if (!reduceMotion.matches) elapsed += delta;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "screen";

      if (atlas) {
        const centerX = width * (0.61 + (pointer.x - 0.5) * 0.032);
        const centerY = height * (0.49 + (pointer.y - 0.5) * 0.024);
        const orbitBase = Math.min(width, height);
        const pointerX = pointer.x * width;
        const pointerY = pointer.y * height;

        for (const microbe of microbes) {
          const angle = microbe.phase + elapsed * microbe.speed;
          const breathing = Math.sin(elapsed * 0.34 + microbe.drift) * 0.02;
          const radius = orbitBase * (microbe.orbit + breathing);
          let x =
            centerX + Math.cos(angle) * radius * 1.36 * microbe.orbitStretch;
          let y =
            centerY +
            Math.sin(angle) * radius * 0.59 +
            Math.sin(angle * 2.2 + microbe.drift) * height * 0.016;

          if (pointer.active) {
            const dx = x - pointerX;
            const dy = y - pointerY;
            const distance = Math.hypot(dx, dy);
            const influence = Math.max(0, 1 - distance / 170);
            if (influence > 0 && distance > 0) {
              x += (dx / distance) * influence * 24;
              y += (dy / distance) * influence * 24;
            }
          }

          const edgeFade = Math.min(
            1,
            x / 80,
            (width - x) / 80,
            y / 60,
            (height - y) / 60,
          );
          if (edgeFade <= 0) continue;

          drawMicrobe(
            context,
            atlas,
            atlasWidth,
            atlasHeight,
            microbe,
            x,
            y,
            angle + Math.PI / 2,
            (Math.sin(elapsed * 0.68 + microbe.drift) + 1) / 2,
            edgeFade,
          );
        }
      }

      context.globalCompositeOperation = "source-over";
      if (!reduceMotion.matches && isVisible && isPageVisible) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const start = () => {
      if (animationFrame || !isVisible || !isPageVisible) return;
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(draw);
    };

    atlasImage.onload = () => {
      atlas = removeAtlasBackground(atlasImage);
      atlasWidth = atlasImage.naturalWidth;
      atlasHeight = atlasImage.naturalHeight;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (reduceMotion.matches) draw(performance.now());
      else start();
    };
    atlasImage.src = `${import.meta.env.BASE_URL}images/main-page/hero/microbe-atlas-ecoli-v1.png`;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) start();
    };

    const handleMotionPreference = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) start();
      },
      { threshold: 0.02 },
    );

    resizeObserver.observe(hero);
    visibilityObserver.observe(hero);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", handleMotionPreference);
    resize();
    draw(performance.now());

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      atlasImage.onload = null;
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} className="home-microbe-field" aria-hidden />;
}
