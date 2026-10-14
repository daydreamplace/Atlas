export type HomeSectionLayout =
  "image-left" | "image-right" | "text-only" | "closing";

export interface HomeSectionContent {
  readonly number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly pages?: readonly string[];
  readonly layout: HomeSectionLayout;
  readonly imagePath?: string;
}

export const HOME_SECTIONS = [
  {
    number: 1,
    id: "global-counterfeit-problem",
    title: "An Invisible World",
    body: "Atlas begins with a shift in attention. Across a familiar world, small forms become the starting point for a different kind of journey. This imagined field brings microbe-inspired shapes into view through movement, light, and a sense of scale. Follow the moving elements, compare their silhouettes, and watch the scene draw you closer. Each transition is an invitation to notice the details that a quick glance might miss.",
    layout: "image-right",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/01-counterfeit-problem.webp",
  },
  {
    number: 2,
    id: "k-beauty-challenge",
    title: "A Change of Scale",
    body: "The same scene can feel entirely different when its scale changes. Atlas moves from a broad view into a more intimate field of forms, linking one composition to the next. Rounded clusters and elongated silhouettes share the space, giving the eye different paths to follow. The journey is visual: an exploration of how distance, overlap, and rhythm can make a small imagined world feel expansive.",
    layout: "image-left",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/02-why-k-beauty.webp",
  },
  {
    number: 3,
    id: "products-authenticated-today",
    title: "Ways of Seeing",
    body: "Looking closer is a sequence of small discoveries. A frame picks out a form. Light reveals another layer. A mark becomes a point of reference, and a signal draws the eye elsewhere. This illustrative interface follows those moments one at a time, using familiar gestures to turn observation into a continuous story. Nothing is being measured or verified here: the subject is the experience of looking.",
    layout: "image-right",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/03-existing-authentication.webp",
  },
  {
    number: 4,
    id: "authentication-limitations",
    title: "Beyond the Surface",
    body: "A silhouette tells only part of a visual story. The same outline can feel flat or dimensional, still or alive, depending on its context. Here, repeated shapes and shifting layers explore that gap between first impressions and closer attention. Move through the sequence to see how a frame, a surface, and a pattern can change the way a form is perceived. Each scene is a designed illustration, rather than a record of an experiment.",
    layout: "text-only",
  },
  {
    number: 5,
    id: "synthetic-biology-answer",
    title: "A Living Visual Language",
    body: "Atlas takes its visual cues from small organic forms: rounded edges, branching groups, winding lines, and the spaces between them. These shapes become a language for building a responsive digital world. A form can suggest direction. A cluster can create rhythm. A soft edge can imply distance. Together, they turn an abstract composition into something that rewards a slower look. Explore the details as the image moves into focus.",
    layout: "image-left",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/04-biological-answer.webp",
  },
  {
    number: 6,
    id: "bio-color-id-idea",
    title: "Inside Atlas",
    body: "The field is built from a few simple elements: individual forms, layered space, a moving light, and your point of view. Each has a different role. Forms give the scene its character, depth changes their relationship, and light makes your attention visible. Their combination creates a responsive environment with a quiet sense of presence. Atlas is a study of those relationships through design and code.",
    layout: "image-right",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/05-meet-bio-color-id.webp",
  },
  {
    number: 7,
    id: "key-features-and-advantages",
    title: "Depth in the Details",
    body: "Depth is something you feel through differences. Nearer forms are larger, sharper, and more responsive to a change of viewpoint. Distant forms remain smaller, softer, and more restrained. Light and contrast help separate the layers, while stationary typography gives the scene a stable point of reference. The result is a field that opens up as you move, without pulling the reading experience out of place.",
    layout: "image-left",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/06-unique-color-signature.webp",
  },
  {
    number: 8,
    id: "bio-color-id-reader",
    title: "A Closer Look",
    body: "A closer look changes the relationship between a form and its surroundings. The lens in Atlas enlarges a small part of the field while preserving the wider composition around it. Light follows the cursor, and nearby forms respond with a subtle drift. This interaction is a visual invitation to explore: find a detail, follow its movement, and see how the scene changes around your attention.",
    layout: "image-right",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/08-bio-color-id-reader.webp",
  },
  {
    number: 9,
    id: "new-authentication-standard",
    title: "An Evolving Field",
    body: "Atlas is an ongoing personal exploration by bin(ary)room. It brings together visual direction, frontend development, and small experiments in interaction. The work shown here concerns the website experience: how forms move, how scenes connect, and how a page responds to attention. The field can keep growing through new compositions and visual studies, while retaining the same curiosity about small worlds.",
    layout: "image-left",
    imagePath:
      "https://static.igem.wiki/teams/6479/wiki/main-page/sections/09-authentication-standard.webp",
  },
  {
    number: 10,
    id: "trustworthy-tomorrow",
    title: "A small world. A different perspective.",
    body: "An interactive visual study by bin(ary)room.\nKEEP LOOKING CLOSER",
    layout: "closing",
  },
] as const satisfies readonly HomeSectionContent[];
