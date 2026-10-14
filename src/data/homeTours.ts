// "Focus tours" for the home page: on large screens these sections are
// pinned and the reader scrolls through their artwork one detail at a time
// (components/home/FocusTourSection.tsx). The copy is the flow from the
// team's storyline deck, already used by SectionExtras; nothing new is
// claimed here. `focus` is the point of the artwork to look at (fractions of
// the image) and how far to zoom in on it.

import {
  BIO_COLOR_ID_FEATURES,
  BIO_COLOR_ID_STEPS,
  READER_STEPS,
  SYNBIO_FLOW,
} from "./homeExtras";

export interface FocusTourStep {
  readonly title: string;
  readonly text?: string;
  readonly focus: {
    readonly x: number;
    readonly y: number;
    readonly zoom: number;
  };
  /** Extra illustration shown with the step. */
  readonly figure?: "spectrum";
}

export interface FocusTour {
  /** Width / height of the section's artwork. */
  readonly aspect: number;
  /** What the steps are, for assistive technology. */
  readonly label: string;
  readonly steps: readonly FocusTourStep[];
}

const WHOLE = { x: 0.5, y: 0.5, zoom: 1 } as const;

function withFocus<T extends { readonly title: string }>(
  steps: readonly T[],
  focus: readonly FocusTourStep["focus"][],
): (T & Pick<FocusTourStep, "focus">)[] {
  return steps.map((step, index) => ({
    ...step,
    focus: focus[index] ?? WHOLE,
  }));
}

export const FOCUS_TOURS: Partial<Record<number, FocusTour>> = {
  // 04-biological-answer.webp: notebook, bacterium, petri dish, fragments.
  5: {
    aspect: 1,
    label: "From a form to a field",
    steps: withFocus(SYNBIO_FLOW, [
      { x: 0.84, y: 0.63, zoom: 2.3 }, // paper scraps with a label
      { x: 0.5, y: 0.14, zoom: 2.3 }, // bacterium
      { x: 0.5, y: 0.5, zoom: 1.65 }, // petri dish
      { x: 0.7, y: 0.8, zoom: 2.3 }, // patterned fragments
      WHOLE,
    ]),
  },
  // 05-meet-bio-color-id.webp: the four things around the tag.
  6: {
    aspect: 1,
    label: "The elements of Atlas",
    steps: withFocus(
      BIO_COLOR_ID_STEPS.map((title) => ({ title })),
      [
        { x: 0.275, y: 0.18, zoom: 2.2 }, // bacterium sketch
        { x: 0.72, y: 0.19, zoom: 2.1 }, // PHB granules
        { x: 0.13, y: 0.45, zoom: 2.3 }, // pigment
        { x: 0.51, y: 0.48, zoom: 1.5 }, // tag
      ],
    ),
  },
  // 06-unique-color-signature.webp: a row of seven samples.
  7: {
    aspect: 2,
    label: "Key features",
    steps: withFocus(BIO_COLOR_ID_FEATURES, [
      { x: 0.092, y: 0.5, zoom: 2.2 },
      { x: 0.355, y: 0.45, zoom: 2.2 },
      { x: 0.483, y: 0.55, zoom: 2.2 },
      { x: 0.62, y: 0.42, zoom: 2.2 },
      { x: 0.908, y: 0.53, zoom: 2.2 },
    ]),
  },
  // 08-bio-color-id-reader.webp: lights inside, phone on top.
  8: {
    aspect: 1.5,
    label: "A closer look",
    steps: [
      { ...READER_STEPS[0], focus: { x: 0.5, y: 0.56, zoom: 1.9 } },
      { ...READER_STEPS[1], focus: { x: 0.52, y: 0.22, zoom: 1.9 } },
      { ...READER_STEPS[2], focus: WHOLE, figure: "spectrum" },
    ],
  },
};
