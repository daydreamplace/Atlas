import {
  ApplicationsSection,
  AuthenticationGapSection,
  BioColorIdConceptSection,
  BiosynthesisSection,
  ClosingSection,
  CounterfeitProblemSection,
  HomeHeroSection,
  ProductionPipelineSection,
  VerificationSection,
} from "../components/home";

export function Home() {
  return (
    <div className="home-story">
      <HomeHeroSection />
      <CounterfeitProblemSection />
      <AuthenticationGapSection />
      <BioColorIdConceptSection />
      <BiosynthesisSection />
      <ProductionPipelineSection />
      <VerificationSection />
      <ApplicationsSection />
      <ClosingSection />
    </div>
  );
}
