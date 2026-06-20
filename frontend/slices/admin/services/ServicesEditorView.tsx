"use client";

import * as React from "react";
import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/features/_shared/crud/types";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { Service } from "@/features/_app/types";

const META: EntityMeta = { label: "Service", labelPlural: "Services" };

export const FIELDS: FieldDef<Service>[] = [
  { kind: "text", key: "name", label: "Name" },
  { kind: "text", key: "slug", label: "Slug", mono: true },
  { kind: "text", key: "priceLabel", label: "Price label", placeholder: "Rp 65jt" },
  { kind: "text", key: "duration", label: "Duration", placeholder: "2 minggu" },
  { kind: "textarea", key: "blurb", label: "Blurb", rows: 3 },
  { kind: "tags", key: "bullets", label: "Bullets", hint: "Comma-separated" },
  { kind: "switch", key: "featured", label: "Featured" },
];

export function useServicesController(): CrudController<Service> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.services,
      getId: (s) => s.id,
      blank: () => ({
        id: `service-${Math.random().toString(36).slice(2, 10)}`,
        slug: `service-${Math.random().toString(36).slice(2, 6)}`,
        name: "New service",
        blurb: "",
        priceLabel: "",
        duration: "",
        bullets: [],
        featured: false,
      }),
      create: (service) => dispatch({ type: "service.upsert", service }),
      update: (id, patch) => {
        const cur = state.services.find((s) => s.id === id);
        if (!cur) return;
        dispatch({ type: "service.upsert", service: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "service.delete", id }),
    }),
    [state.services, dispatch],
  );
}

export function ServicesEditorView({ id }: { id: string }) {
  const controller = useServicesController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/services`}
    />
  );
}
