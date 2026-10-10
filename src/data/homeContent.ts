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
    title: "A Global Counterfeit Problem",
    body: `Counterfeit goods have become a worldwide challenge that extends far beyond simple trademark violations. In sectors
such as cosmetics and pharmaceuticals, fake products can enter global supply chains, reach consumers through online
and offline markets, and create serious risks to health, safety, and trust. Many counterfeit items are designed to look nearly
identical to authentic products, making them difficult for ordinary consumers to distinguish. As the trade in counterfeit
goods expands across borders, it threatens brand credibility, undermines fair competition, and highlights the urgent need
for more reliable authentication technologies.`,
    layout: "image-right",
    imagePath: "images/main-page/sections/01-counterfeit-problem.webp",
  },
  {
    number: 2,
    id: "k-beauty-challenge",
    title: "The K-Beauty Challenge",
    body: `K-beauty has grown from a regional trend into a global industry admired for innovation, design, and fast-moving product
development. As Korean skincare and cosmetic brands reach consumers around the world through expanding exports and online
markets, their visibility and influence continue to rise. Yet this global success has also created new opportunities for counterfeiters,
who imitatte packaging and branding while ignoring the quality and safety standards behind authentic products. Fake K-beauty
items can harm skin health, mislead consumers, and damage the reputation that Korean brands have built through trust and
performance. The more K-beauty spreads across the world, the more important it becomes to protect authenticity and preserve
consumer confidence.`,
    layout: "image-left",
    imagePath: "images/main-page/sections/02-why-k-beauty.webp",
  },
  {
    number: 3,
    id: "products-authenticated-today",
    title: "How Are Products Authenticated Today?",
    body: `Products are commonly authenticated today through QR codes, holograms, serial numbers, and digital tracking
technologies such as NFC. These tools are widely used because they are practical, cost-effective, and easy to apply
across a wide range of industries and products.
However, most of these authentication methods are attached to the packaging or label surface, rather than
embedded into the material itself. While they help verify authenticity, they can also be removed, copied, or tampered with.
As products become more complex and counterfeiting more sophisticated, there is a growing need for stronger,
built-in authentication approaches that go beyond the surface.`,
    layout: "image-right",
    imagePath: "images/main-page/sections/03-existing-authentication.webp",
  },
  {
    number: 4,
    id: "authentication-limitations",
    title: "What Are the Limitations?",
    body: `Common authentication tools such as QR codes, holograms, serial numbers, and digital tracking are useful
and widely adopted. However, these features are usually attached to the packaging or label surface, rather
than embedded in the product itself.
Because they are surface-level features, labels can be copied, replaced, transferred, or reused. Many systems
also rely heavily on databases or user participation, which can be vulnerable to manipulation or human error.
These methods often verify the package, not the material itself, leaving a gap between packaging identity
and product identity.
As counterfeiting becomes more sophisticated, there is a clear need for stronger, material-level
authentication approaches that go beyond the surface.`,
    pages: [
      `Common authentication tools such as QR codes, holograms, serial numbers, and digital tracking are useful
and widely adopted. However, these features are usually attached to the packaging or label surface, rather
than embedded in the product itself.`,
      `Because they are surface-level features, labels can be copied, replaced, transferred, or reused.`,
      `Many systems
also rely heavily on databases or user participation, which can be vulnerable to manipulation or human error.
These methods often verify the package, not the material itself, leaving a gap between packaging identity
and product identity.`,
      `As counterfeiting becomes more sophisticated, there is a clear need for stronger, material-level
authentication approaches that go beyond the surface.`,
    ],
    layout: "text-only",
  },
  {
    number: 5,
    id: "synthetic-biology-answer",
    title: "Can Synthetic Biology Offer a New Answer?",
    body: `Conventional authentication methods such as QR codes, holograms, and serial numbers are valuable, but they mostly protect
the surface. These labels and markings can be copied, removed, or transferred, and they are often separate from the product itself.
As a result, counterfeiters can still find ways to imitate the external features, leaving a gap between what is verified and what is
truly inside the product.
Synthetic biology offers a new answer by building identity into the material itself. By engineering living systems to produce
distinctive biomaterials, we can create unique biological patterns and measurable signatures that are far more difficult to replicate.
Because the identity emerges from the product's own material, authentication becomes more closely tied to its true origin.
This approach is not only more secure, but also sustainable, using renewable biological processes to create innovative materials
for a more trustworthy and resilient future.`,
    layout: "image-left",
    imagePath: "images/main-page/sections/04-biological-answer.webp",
  },
  {
    number: 6,
    id: "bio-color-id-idea",
    title: "Our Idea: Bio Color ID",
    body: `Bio Color ID is built by combining PHB bioplastic with halogenated indigo pigments produced through
synthetic biology, turning a sustainable biomaterial into a distinctive color-based identity.
This identity is not just a visible color but an information-rich material fingerprint. Because the signature
emerges from the biological production process and is embedded in the material itself, it is more
meaningful, measurable, and harder to imitate than ordinary surface labels.`,
    layout: "image-right",
    imagePath: "images/main-page/sections/05-meet-bio-color-id.webp",
  },
  {
    number: 7,
    id: "key-features-and-advantages",
    title: "Key Features and Advantages",
    body: `Bio Color ID provides a material-based identity rather than a printed label. Because the optical signature
reflects a biological production process, it can be more difficult to replicate than ordinary packaging marks.
The PHB platform is biodegradable and sustainable, while its optical properties can be tuned and read
by light-based systems, making the material both functional and meaningful as a next-generation
authentication tag.`,
    layout: "image-left",
    imagePath: "images/main-page/sections/06-unique-color-signature.webp",
  },
  {
    number: 8,
    id: "bio-color-id-reader",
    title: "Bio Color ID Reader",
    body: `The Bio Color ID Reader uses several wavelengths of light to reveal the unique optical fingerprint of the Bio Color ID tag.
An iPhone 14 Pro mounted above the reader captures a high-resolution image of the tag from the top, recording how the tag
responds to each wavelength.
A dedicated mobile app analyzes the captured image, comparing its spectral signature with authentic reference data.
Through computational analysis, the app can distinguish genuine tags from counterfeit products, providing reliable
authentication beyond what is possible with simple visual inspection.`,
    layout: "image-right",
    imagePath: "images/main-page/sections/08-bio-color-id-reader.webp",
  },
  {
    number: 9,
    id: "new-authentication-standard",
    title: "Toward a New Authentication Standard",
    body: `Bio Color ID is envisioned as a next-generation authentication technology that can move beyond conventional surface
labels by embedding identity into the material itself. By linking biological production with measurable optical signatures,
it can support safer products, stronger consumer trust, and smarter anti-counterfeit systems.
Starting in K-beauty and pharmaceuticals, this platform could grow into a broader authentication standard with applications
across many industries, helping brands, regulators, and consumers rely on a more secure and meaningful way to verify authenticity.`,
    layout: "image-left",
    imagePath: "images/main-page/sections/07-color-to-identity.webp",
  },
  {
    number: 10,
    id: "trustworthy-tomorrow",
    title: "Bio Color ID reimagines product authentication",
    body: `by embedding identity into a biofabricated material signature.
BIOLOGY FOR A MORE TRUSTWORTHY TOMORROW`,
    layout: "closing",
  },
] as const satisfies readonly HomeSectionContent[];
