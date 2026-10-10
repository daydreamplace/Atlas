export function HomeHeroSection() {
  return (
    <section
      id="home-hero"
      className="home-section home-hero-section"
      data-home-section="hero"
      aria-labelledby="home-hero-title"
    >
      <div className="home-scene-inner" aria-hidden="true">
        <div className="home-light-field" />
      </div>
      <div className="home-hero-section__copy">
        <h1 id="home-hero-title" className="home-hero-section__title">
          Bio Color ID
        </h1>
        <p className="home-hero-section__lead">
          From the counterfeit problem to a new synthetic-biology-based
          authentication platform
        </p>
      </div>
      <a
        className="home-hero-section__scroll"
        href="#global-counterfeit-problem"
      >
        <span>Scroll to begin</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
