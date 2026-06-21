"use client";

import { ConceptListPage } from "@/features/_shared/concepts/ConceptListPage";
import { portfolioAdapter } from "@/features/_app/concepts";

/**
 * Portfolio list — now rendered via the shared ConceptListPage default grid
 * (fleet-wide visual unification). Data via portfolioAdapter (wraps useProjects).
 */
export function PortfolioListPage() {
  return <ConceptListPage adapter={portfolioAdapter} />;
}
