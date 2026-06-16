"use client";

import * as React from "react";
import { CrudFormView } from "@/components/templates/_shared/crud/CrudFormView";
import type { CrudController, EntityMeta, FieldDef } from "@/components/templates/_shared/crud/types";
import { useStore } from "../../../shared/store";
import { ADMIN_BASE } from "../../../shared/nav-config";
import type { TeamMember } from "../../../shared/types";

const META: EntityMeta = { label: "Team member", labelPlural: "Team" };

export const FIELDS: FieldDef<TeamMember>[] = [
  { kind: "text", key: "name", label: "Name" },
  { kind: "text", key: "role", label: "Role" },
  { kind: "textarea", key: "bio", label: "Bio", rows: 4 },
  { kind: "text", key: "avatar", label: "Avatar emoji", placeholder: "🪐" },
  { kind: "text", key: "initials", label: "Initials", placeholder: "AR" },
  { kind: "text", key: "location", label: "Location" },
  {
    kind: "textarea",
    key: "links",
    label: "Links (JSON)",
    rows: 3,
    mono: true,
    hint: 'JSON array, e.g. [{"label":"LinkedIn","href":"#"}]',
  },
  { kind: "number", key: "order", label: "Order", min: 0, step: 10 },
];

export function useTeamController(): CrudController<TeamMember> {
  const { state, dispatch } = useStore();
  return React.useMemo(
    () => ({
      items: state.team,
      getId: (m) => m.id,
      blank: () => ({
        id: `team-${Math.random().toString(36).slice(2, 10)}`,
        name: "New member",
        role: "",
        bio: "",
        avatar: "🙂",
        initials: "NM",
        location: "",
        links: "[]",
        order: (state.team.at(-1)?.order ?? 0) + 10,
      }),
      create: (member) => dispatch({ type: "team.upsert", member }),
      update: (id, patch) => {
        const cur = state.team.find((m) => m.id === id);
        if (!cur) return;
        dispatch({ type: "team.upsert", member: { ...cur, ...patch, id } });
      },
      remove: (id) => dispatch({ type: "team.delete", id }),
    }),
    [state.team, dispatch],
  );
}

export function TeamEditorView({ id }: { id: string }) {
  const controller = useTeamController();
  return (
    <CrudFormView
      id={id}
      meta={META}
      controller={controller}
      fields={FIELDS}
      backHref={`${ADMIN_BASE}/team`}
    />
  );
}
