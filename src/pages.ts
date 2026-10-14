interface NavPage {
  name: string;
  path: string;
}
interface NavFolder {
  name: string;
  folder: NavPage[];
}
const Pages: (NavPage | NavFolder)[] = [
  { name: "Home", path: "#home-hero" },
  {
    name: "The field",
    folder: [
      { name: "An invisible world", path: "#global-counterfeit-problem" },
      { name: "A change of scale", path: "#k-beauty-challenge" },
    ],
  },
  {
    name: "Observation",
    folder: [
      { name: "Ways of seeing", path: "#products-authenticated-today" },
      { name: "Beyond the surface", path: "#authentication-limitations" },
    ],
  },
  {
    name: "Forms",
    folder: [
      { name: "A living visual language", path: "#synthetic-biology-answer" },
      { name: "Inside Atlas", path: "#bio-color-id-idea" },
    ],
  },
  {
    name: "Perspective",
    folder: [
      { name: "Depth in the details", path: "#key-features-and-advantages" },
      { name: "A closer look", path: "#bio-color-id-reader" },
    ],
  },
  {
    name: "About",
    folder: [
      { name: "An evolving field", path: "#new-authentication-standard" },
      { name: "bin(ary)room", path: "#trustworthy-tomorrow" },
    ],
  },
];
export default Pages;
