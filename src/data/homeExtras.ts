/** Atlas copy for the original homepage's existing visual sequences. */
export const HOME_TAGLINES: Partial<Record<number, string>> = {
  1: "A familiar world, a different view",
  2: "Small forms, open possibilities",
  5: "A language of living shapes",
  6: "Form, space, light, attention",
  7: "Distance is in the details",
  8: "Let curiosity lead the way",
  9: "An evolving field of ideas",
  10: "A field by bin(ary)room",
};
export const HOME_CHAPTER_LABELS: Record<number, string> = {
  1: "The field",
  2: "A change of scale",
  3: "Observation",
  4: "Beyond the surface",
  5: "Visual language",
  6: "Inside Atlas",
  7: "Depth",
  8: "A closer look",
  9: "About Atlas",
};
export const SYNBIO_FLOW = [
  {
    title: "A different scale",
    text: "Make room for details that usually pass unnoticed.",
  },
  {
    title: "An individual form",
    text: "A silhouette gives the field its character.",
  },
  {
    title: "Relationships",
    text: "Clusters and spaces create a rhythm of their own.",
  },
  {
    title: "A shift of view",
    text: "A small change in perspective reveals another layer.",
  },
  {
    title: "The whole field",
    text: "Forms become a world through their relationships.",
  },
] as const;
export const BIO_COLOR_ID_STEPS = [
  "Individual forms",
  "Layered space",
  "Moving light",
  "Your point of view",
] as const;
export const BIO_COLOR_ID_FEATURES = [
  {
    title: "Near and far",
    text: "Depth gives each layer a different presence.",
  },
  {
    title: "Relative motion",
    text: "Nearby forms move further as the viewpoint shifts.",
  },
  { title: "Softness", text: "Distant forms recede through subtle blur." },
  { title: "Scale", text: "A difference in size adds a sense of distance." },
  { title: "Light", text: "A moving glow makes attention visible." },
] as const;
export const READER_STEPS = [
  { title: "Illuminate", text: "A moving light follows your attention." },
  { title: "Focus", text: "The lens reveals a closer view of a small detail." },
  {
    title: "Respond",
    text: "Forms drift around the cursor while the words remain still.",
  },
] as const;
export const STANDARD_OUTCOMES = [
  "Visual direction",
  "Interaction studies",
  "Creative development",
] as const;
