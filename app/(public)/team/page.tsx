import type { Metadata } from "next";
import { TeamPage } from "@/features/team/TeamPage";

export const metadata: Metadata = {
  title: "Team",
  description: "Tim studio atelier.studio — principal, lead, dan partner.",
};

export default function Page() {
  return <TeamPage />;
}
