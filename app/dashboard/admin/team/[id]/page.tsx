import { TeamEditorView } from "@/components/templates/agency-studio/slices/admin/team/TeamEditorView";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeamEditorView id={id} />;
}
