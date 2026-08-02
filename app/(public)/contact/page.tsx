import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/ContactPage";

export const metadata: Metadata = { title: "Contact", description: "Send a brief — usually replies within 24h." };

export default function Page() {
  return <ContactPage />;
}
