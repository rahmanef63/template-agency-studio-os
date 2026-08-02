"use client";

import * as React from "react";
import { CrudFormView } from "@/features/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/features/_shared/crud/types";
import { useStore } from "@/features/_app/store";
import { ADMIN_BASE } from "@/features/_app/nav-config";
import type { ProcessStep } from "@/features/_app/types";

const META: EntityMeta = { label: "Process step", labelPlural: "Process" };

export const FIELDS: FieldDef<ProcessStep>[] = [
  { kind: "text", key: "phase", label: "Phase" },
  { kind: "number", key: "index", label: "Step number", min: 1, step: 1 },
  { kind: "text", key: "duration", label: "Duration", placeholder: "2–3 minggu" },
  { kind: "textarea", key: "blurb", label: "Blurb", rows: 4 },
  { kind: "tags", key: "deliverables", label: "Deliverables", hint: "Comma-separated" },
  { kind: "number", key: "order", label: "Order", min: 0, step: 10 },
];

export function useProcessController(): CrudController<ProcessStep> {
  const { state, dispatch } = useStore();
  return React.useMemo(() => {
    const sorted = [...state.processSteps].sort((a, b) => a.order - b.order);
    const swap = (id: string, delta: -1 | 1) => {
      const idx = sorted.findIndex((s) => s.id === id);
      if (idx < 0) return;
      const next = idx + delta;
      if (next < 0 || next >= sorted.length) return;
      const a = sorted[idx];
      const b = sorted[next];
      dispatch({ type: "process.upsert", step: { ...a, order: b.order } });
      dispatch({ type: "process.upsert", step: { ...b, order: a.order } });
    };
    return {
      items: sorted,
      getId: (s) => s.id,
      blank: () => ({
        id: `process-${Math.random().toString(36).slice(2, 10)}`,
        index: sorted.length + 1,
        phase: "New phase",
        blurb: "",
        duration: "",
        deliverables: [],
        order: (sorted.at(-1)?.order ?? 0) + 10,
      }),
      create: (step) => dispatch({ type: "process.upsert", step }),
      update: (id, patch) => {
        const cur = state.processSteps.find((s) => s.id === id);
        if (!cur) return;
        dispatch({ type: "process.upsert", step: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "process.delete", id }),
      moveUp: (id) => swap(id, -1),
      moveDown: (id) => swap(id, 1),
    };
  }, [state.processSteps, dispatch]);
}

export function ProcessEditorView({ id }: { id: string }) {
  const controller = useProcessController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/process`}
    />
  );
}
