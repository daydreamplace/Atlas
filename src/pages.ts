import {
  Attributions,
  Contribution,
  Description,
  Engineering,
  Experiments,
  Home,
  HumanPractices,
  Notebook,
  Parts,
  Results,
  SafetyAndSecurity,
  Members,
  Education,
  Hardware,
  Measurement,
  Software,
  Sustainability,
} from "./contents";

/*
  Paths

  Pages that iGEM judges open by a fixed "standard URL" keep that URL at the
  top level: /description, /engineering, /contribution, /attributions,
  /human-practices, /measurement, /safety-and-security, /software, /hardware,
  /education, /sustainability. Do not move or rename these.

  Every other page sits under its GNB group: /team/…, /project/…, /wet-lab/….

  `aliases` are other addresses for the same page (older paths, and short
  forms such as /safety). They redirect to `path`.
*/

interface Base {
  name: string | undefined;
}

class Folder implements Base {
  name: string | undefined;
  folder: Page[] | undefined;
}

class Page implements Base {
  name: string | undefined;
  title: string | undefined;
  path: string | undefined;
  component: React.FC | undefined;
  lead: string | undefined;
  aliases?: string[];
}

export const TEAM_MEMBERS_PATH = "/team/members";

const Pages: (Page | Folder)[] = [
  {
    name: "Home",
    title: "Home",
    path: "/",
    component: Home,
    lead: "Your iGEM Journey Begins Here! We wish you a successful and rewarding season!",
  },
  {
    name: "Team",
    folder: [
      {
        name: "Member",
        title: "Meet Our Team",
        path: TEAM_MEMBERS_PATH,
        aliases: ["/team", "/members"],
        component: Members,
        lead: "This page is dedicated to introducing the individuals who made our iGEM project possible. Here, you'll find information about our team members, instructors, and advisors.",
      },
      {
        name: "Attribution",
        title: "Attributions",
        path: "/attributions",
        aliases: ["/attribution", "/team/attributions"],
        component: Attributions,
        lead: "Accurate attribution is essential in the iGEM Competition. It ensures that the judges can properly assess your team's contributions and recognize the support provided by external collaborators. This page is dedicated to fulfilling the Attributions requirement for judging.",
      },
    ],
  },
  {
    name: "Project",
    folder: [
      {
        name: "Description",
        title: "Project Description",
        path: "/description",
        aliases: ["/project/description"],
        component: Description,
        lead: "Describe how and why you chose your iGEM project.",
      },
      {
        name: "Engineering",
        title: "Engineering Success",
        path: "/engineering",
        aliases: ["/project/engineering"],
        component: Engineering,
        lead: "Demonstrate engineering success in a technical aspect of your project by going through at least one iteration of the engineering design cycle.",
      },
      {
        name: "Results",
        title: "Results",
        path: "/project/results",
        aliases: ["/results"],
        component: Results,
        lead: "Present the results of your project, along with a detailed analysis and discussion of their significance. Also outline future plans and reflections on the impact of your project.",
      },
      {
        name: "Contribution",
        title: "Contribution",
        path: "/contribution",
        aliases: ["/project/contribution"],
        component: Contribution,
        lead: "Make a useful contribution for future iGEM teams and document it on this page.",
      },
      {
        name: "Part",
        title: "Parts",
        path: "/project/parts",
        aliases: ["/parts", "/part", "/project/part"],
        component: Parts,
        lead: "Document the parts your team designed, built, and characterized, with links to their Registry pages.",
      },
    ],
  },
  {
    name: "Wet Lab",
    folder: [
      {
        name: "Experiments",
        title: "Experiments",
        path: "/wet-lab/experiments",
        aliases: ["/experiments"],
        component: Experiments,
        lead: "Describe the research, experiments, and protocols you used in your project. It is designed to provide sufficient information for other teams to replicate our work.",
      },
      {
        name: "Lab Note",
        title: "Lab Notebook",
        path: "/wet-lab/notebook",
        aliases: ["/notebook", "/wet-lab/lab-note"],
        component: Notebook,
        lead: "This serves as a chronological record of your team's progress throughout the season. It documents your daily activities, experiments, discussions, and decisions.",
      },
      {
        name: "Measurement",
        title: "Measurement",
        path: "/measurement",
        aliases: ["/wet-lab/measurement"],
        component: Measurement,
        lead: "Synthetic Biology needs great measurement approaches for characterizing parts, and efficient new methods for characterizing many parts at once. Describe your measurement approaches on this page.",
      },
      {
        name: "Safety & Security",
        title: "Safety and Security",
        path: "/safety-and-security",
        aliases: ["/safety", "/wet-lab/safety-and-security"],
        component: SafetyAndSecurity,
        lead: "Detail the safety and security considerations of your project, adressing potential risks and outlining the measures taken to mitigate them.",
      },
    ],
  },
  {
    name: "Dry Lab",
    folder: [
      {
        name: "Software",
        title: "Software",
        path: "/software",
        aliases: ["/dry-lab/software"],
        component: Software,
        lead: "Software in iGEM should make synthetic biology based on standard parts easier, faster, better or more accessible to our community.",
      },
      {
        name: "Hardware",
        title: "Hardware",
        path: "/hardware",
        aliases: ["/dry-lab/hardware"],
        component: Hardware,
        lead: "Hardware in iGEM should make synthetic biology based on standard parts easier, faster, better, or more accessible to our community.",
      },
    ],
  },
  {
    name: "Engagement",
    folder: [
      {
        name: "IHP",
        title: "Integrated Human Practices",
        path: "/human-practices",
        aliases: ["/ihp", "/engagement/human-practices"],
        component: HumanPractices,
        lead: "We ask every team to think deeply and creatively about whether their project is responsible and good for the world. Consider how the world affects your work and how your work affects the world.",
      },
      {
        name: "Education",
        title: "Education",
        path: "/education",
        aliases: ["/engagement/education"],
        component: Education,
        lead: "Innovative educational tools and outreach activities have the ability to establish a two-way dialogue with new communities by discussing public values and the science behind synthetic biology.",
      },
      {
        name: "SDGs",
        title: "Sustainable Development Goals",
        path: "/sustainability",
        aliases: ["/sdgs", "/engagement/sdgs"],
        component: Sustainability,
        lead: "Describe how you have evaluated your project ideas against one or more of the SDGs.",
      },
    ],
  },
];

export default Pages;
