import type { Metadata } from "next";
import { ServicesPage } from "@/features/services/ServicesPage";

export const metadata: Metadata = { title: "Services", description: "Productized engagements — strategy, identity, design system, retainer." };

export default function Page() {
  return <ServicesPage />;
}
