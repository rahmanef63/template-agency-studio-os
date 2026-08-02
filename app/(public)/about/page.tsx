import type { Metadata } from "next";
import { AboutPage } from "@/features/about/AboutPage";

export const metadata: Metadata = { title: "About", description: "Studio principals, values, team." };

export default function Page() {
  return <AboutPage />;
}
