export function HomeHeroSection() {
  return (
    <section
      id="home-hero"
      className="home-section home-hero-section"
      data-home-section="hero"
      aria-labelledby="home-hero-title"
    >
      <h1 id="home-hero-title" className="home-visually-hidden">
        Bio Color ID
      </h1>
      <div className="home-scene-inner" aria-hidden="true">
        <div className="home-light-field" />
      </div>
    </section>
  );
}
