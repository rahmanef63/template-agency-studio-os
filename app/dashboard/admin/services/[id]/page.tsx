import { ServicesEditorView } from "@/features/admin/services/ServicesEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServicesEditorView id={id} />;
}
