// Team roster, from https://teams.igem.org/6479/roster (last updated
// 2026-09-16). Keep this in sync with the official roster.

export type TeamGroup = "Members" | "PI" | "Instructor" | "Advisor";

export const teamGroups: TeamGroup[] = [
  "Members",
  "PI",
  "Instructor",
  "Advisor",
];

export type Member = {
  id: string;
  name: string;
  group: TeamGroup;
  /** Role on the team, as listed on the roster. */
  role: string;
  /** Position shown on the member's iGEM profile. */
  title?: string;
  affiliation?: string;
  igemSince?: number;
  /** Short bio written by the member. Shown in the profile when present. */
  introduction?: string;
};

export const members: Member[] = [
  // Student members
  {
    id: "ellie-saeyoon-kim",
    name: "Ellie Saeyoon Kim",
    group: "Members",
    role: "Student Leader",
    title: "Student",
    affiliation: "Saint Paul Preparatory Seoul",
    igemSince: 2026,
  },
  {
    id: "anna-lee",
    name: "Anna Lee",
    group: "Members",
    role: "Student Member",
    title: "Student",
    affiliation: "Chadwick International School",
    igemSince: 2026,
  },
  {
    id: "annie",
    name: "Annie",
    group: "Members",
    role: "Student Member",
    title: "Student",
    affiliation: "SIE central",
    igemSince: 2026,
  },
  {
    id: "ayden-kim",
    name: "Ayden Kim",
    group: "Members",
    role: "Student Member",
    title: "Student",
    affiliation: "Westminster School",
    igemSince: 2026,
  },
  {
    id: "daniel-jeongmin-kwon",
    name: "Daniel Jeongmin Kwon",
    group: "Members",
    role: "Student Member",
    title: "Student",
    affiliation: "Korean International School",
    igemSince: 2026,
  },
  {
    id: "seongbin-cho",
    name: "Seongbin (Ben) Cho",
    group: "Members",
    role: "Student Member",
    title: "Student",
    affiliation: "Avon Old Farms School",
    igemSince: 2026,
  },
  {
    id: "wonwoo",
    name: "Wonwoo",
    group: "Members",
    role: "Student Member",
    title: "Student",
    affiliation: "Saint Paul Preparatory Seoul",
    igemSince: 2026,
  },

  // PIs
  {
    id: "jongwoo-kim",
    name: "Jongwoo Kim",
    group: "PI",
    role: "Primary PI",
    affiliation: "Seoul-Korea",
    igemSince: 2019,
  },
  {
    id: "chris-song",
    name: "Chris Song",
    group: "PI",
    role: "Secondary PI",
    title: "Instructor",
    affiliation: "PSI academy",
    igemSince: 2022,
  },

  // Instructors
  {
    id: "katherine-h",
    name: "Katherine H.",
    group: "Instructor",
    role: "Instructor",
    title: "Instructor",
    affiliation: "PSI",
    igemSince: 2026,
  },
  {
    id: "wonhyunsuk",
    name: "wonhyunsuk",
    group: "Instructor",
    role: "Instructor",
    title: "Student",
    affiliation: "Hanyang University",
    igemSince: 2026,
  },
  {
    id: "youbin-park",
    name: "Youbin Park",
    group: "Instructor",
    role: "Instructor",
    title: "Undergraduate",
    affiliation: "Hongik University",
    igemSince: 2026,
  },

  // Advisors
  {
    id: "lee-hyeok",
    name: "Lee Hyeok",
    group: "Advisor",
    role: "Advisor",
    title: "Undergraduate",
    affiliation: "Hongik University",
    igemSince: 2026,
  },
];
