"use client";

import { CrudListView } from "@/components/templates/_shared/crud/CrudListView";
import type { ColumnDef, EntityMeta } from "@/components/templates/_shared/crud/types";
import { FIELDS, useTeamController } from "./TeamEditorView";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { TeamMember } from "../../../shared/types";

const META: EntityMeta = { label: "Team member", labelPlural: "Team" };

const COLUMNS: ColumnDef<TeamMember>[] = [
  { key: "avatar", header: "", width: "w-[6%]" },
  { key: "name", header: "Name", width: "w-[24%]" },
  { key: "role", header: "Role", width: "w-[34%]" },
  { key: "location", header: "Location", width: "w-[20%]", hideOnMobile: true },
  { key: "order", header: "Order", width: "w-[10%]" },
];

export function TeamView() {
  const controller = useTeamController();
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/team/${id}`}
      description={`${controller.items.length} members`}
    />
  );
}
