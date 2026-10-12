// Extra presentation copy for the home page, from the team's storyline deck
// ("Wiki Main Page.pptx"). Section body text stays in homeContent.ts.

/** Short handwritten note shown beside each section's artwork. */
export const HOME_TAGLINES: Partial<Record<number, string>> = {
  1: "Same look, different risks",
  2: "Growing beauty, greater responsibility",
  5: "From biology to trust",
  6: "Biology creates a more meaningful colour",
  7: "More than a colour, a higher standard",
  8: "See the difference in the details",
  9: "Same principle, a safer world",
  10: "Tiny biology, a safer tomorrow",
};

/** Short label for each section in the home progress rail. */
export const HOME_CHAPTER_LABELS: Record<number, string> = {
  1: "The problem",
  2: "K-beauty",
  3: "Today's methods",
  4: "Limitations",
  5: "Synthetic biology",
  6: "Our idea",
  7: "Key features",
  8: "Reader",
  9: "New standard",
};

/** Section 5: from the question to trusted authentication. */
export const SYNBIO_FLOW = [
  {
    title: "How can we verify authenticity?",
    text: "Conventional labels can be copied.",
  },
  {
    title: "Engineered biology",
    text: "Design living systems to make unique materials.",
  },
  {
    title: "Living materials",
    text: "Engineered cells produce distinctive biomaterials.",
  },
  {
    title: "Unique bio fingerprint",
    text: "An intrinsic material signature that is measurable.",
  },
  {
    title: "Trusted authentication",
    text: "Identity tied to the material's true origin.",
  },
] as const;

/** Section 6: how a Bio Color ID tag is made. */
export const BIO_COLOR_ID_STEPS = [
  "Engineered bacteria",
  "PHB granules",
  "Halogenated indigo pigments",
  "Bio Color ID tag",
] as const;

/**
 * Section 7. Only features stated in the section text — the deck's
 * "Tamper-evident" is left out until it is shown experimentally.
 */
export const BIO_COLOR_ID_FEATURES = [
  {
    title: "Material-level identity",
    text: "Built into the material, not printed on a label.",
  },
  {
    title: "Harder to replicate",
    text: "The signature reflects a biological production process.",
  },
  { title: "Sustainable & biodegradable", text: "A PHB bioplastic platform." },
  { title: "Tunable optics", text: "Optical properties can be adjusted." },
  { title: "Light-readable", text: "Read by light-based systems." },
] as const;

/** Section 8: how the reader works. */
export const READER_STEPS = [
  {
    title: "Illuminate",
    text: "Several wavelengths of light shine on the tag.",
  },
  {
    title: "Capture",
    text: "An iPhone above the reader images the tag from the top.",
  },
  {
    title: "Compare",
    text: "The app compares the spectral signature with reference data.",
  },
] as const;

/** Section 9: where the standard leads. */
export const STANDARD_OUTCOMES = [
  "Consumer trust",
  "Industry adoption",
  "Expanded applications",
] as const;
