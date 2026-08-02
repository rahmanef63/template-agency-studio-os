"use client";

import { CrudListView } from "@/features/_shared/crud/CrudListView";
import type { ColumnDef, EntityMeta } from "@/features/_shared/crud/types";
import { FIELDS, useServicesController } from "./ServicesEditorView";
import { ADMIN_BASE, PUBLIC_BASE } from "@/features/_app/nav-config";
import type { Service } from "@/features/_app/types";

const META: EntityMeta = {
  label: "Service",
  labelPlural: "Services",
  publicHref: () => `${PUBLIC_BASE}/services`,
};

const COLUMNS: ColumnDef<Service>[] = [
  { key: "name", header: "Name", width: "w-[26%]" },
  { key: "priceLabel", header: "Price", width: "w-[16%]" },
  { key: "duration", header: "Duration", width: "w-[16%]", hideOnMobile: true },
  { key: "blurb", header: "Blurb", width: "w-[30%]", hideOnMobile: true },
  { key: "featured", header: "Featured", width: "w-[12%]", badge: "secondary" },
];

export function ServicesAdminView() {
  const controller = useServicesController();
  const featuredCount = controller.items.filter((s) => s.featured).length;
  return (
    <CrudListView
      meta={META}
      controller={controller}
      columns={COLUMNS}
      fields={FIELDS}
      editPath={(id) => `${ADMIN_BASE}/services/${id}`}
      description={`${featuredCount} featured`}
    />
  );
}
