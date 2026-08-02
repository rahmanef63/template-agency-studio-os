"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { journalAdapter } from "@/features/_app/concepts";

/**
 * Journal list — now rendered via the shared ConceptListPage default grid
 * (fleet-wide visual unification). Data via journalAdapter (wraps useArticles).
 */
export function JournalListPage() {
  return <ConceptListPage adapter={journalAdapter} />;
}
