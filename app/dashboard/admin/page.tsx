import { DashboardView } from "@/components/templates/agency-studio/slices/admin/dashboard/DashboardView";
import { SetupBanner } from "@/components/setup-banner";

export default function Page() {
  return (
    <>
      <SetupBanner />
      <DashboardView />
    </>
  );
}
