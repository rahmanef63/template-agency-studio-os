"use client";

import { CrudListView } from "@/features/_shared/crud/CrudListView";
import type { ColumnDef, EntityMeta } from "@/features/_shared/crud/types";
import { FIELDS, useProcessController } from "./ProcessEditorView";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { ProcessStep } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Process step",
  labelPlural: "Process",
  publicHref: () => `${PUBLIC_BASE}/process`,
};

const COLUMNS: ColumnDef<ProcessStep>[] = [
  { key: "index", header: "#", width: "w-[6%]" },
  { key: "phase", header: "Phase", width: "w-[26%]" },
  { key: "duration", header: "Duration", width: "w-[20%]", hideOnMobile: true },
  { key: "blurb", header: "Blurb", width: "w-[38%]", hideOnMobile: true },
  { key: "order", header: "Order", width: "w-[10%]" },
];

export function ProcessView() {
  const controller = useProcessController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/process/${id}`}
      description={`${controller.items.length} steps`}
    />
  );
}
