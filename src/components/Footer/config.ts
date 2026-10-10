// Content shown in the site footer. Edit here; Footer.tsx only handles layout.

export const CONTACT = {
  call: "+82-2-6959-2757",
  email: "pcakoreainfo@pcakorea.org",
  address: "26, Teheran-ro 34-gil, Gangnam-gu, Seoul, Republic of Korea 06223",
};

export type Sponsor = {
  name: string;
  /** Logo URL on static.igem.wiki. */
  logo: string;
  href?: string;
};

// TODO: add sponsors, e.g.
// { name: "Example", logo: "https://static.igem.wiki/teams/6479/...", href: "https://..." }
export const SPONSORS: Sponsor[] = [];
