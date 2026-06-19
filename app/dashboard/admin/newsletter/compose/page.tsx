import { NewsletterComposeView } from "@/features/admin/newsletter/NewsletterComposeView";
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  return <NewsletterComposeView id={id} />;
}
