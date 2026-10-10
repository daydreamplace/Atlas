import { MemberArchive } from "../components/team/MemberArchive";
import { members } from "../data/members";

export function Members() {
  return <MemberArchive members={members} />;
}
