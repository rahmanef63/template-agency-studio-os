import { ProcessEditorView } from "@/features/admin/process/ProcessEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProcessEditorView id={id} />;
}
