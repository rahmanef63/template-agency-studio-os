import type { Metadata } from "next";
import { DemoRibbon } from "@/components/demo-ribbon";
import { AiChatFab } from "@/components/ai-chat-fab";
import { Suspense, type ReactNode } from "react";
import { SiteShell } from "@/components/templates/_shared/ui/site-shell";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { StoreProvider } from "@/components/templates/agency-studio/shared/store";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/agency-studio/shared/site-config";
import {
  FOOTER_COLUMNS,
  FOOTER_TAGLINE,
  PUBLIC_BASE,
  PUBLIC_CTA,
  PUBLIC_NAV,
} from "@/components/templates/agency-studio/shared/nav-config";

const c = DEFAULT_SITE_CONFIG;

/** Demo/clone-aware canonical origin — env wins over the seeded
 *  site-config domain so og/canonical URLs always match the real host. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : c.baseUrl);

export const metadata: Metadata = {
  title: { default: `${c.brandName} — ${c.tagline}`, template: `%s — ${c.brandName}` },
  description: c.description,
  applicationName: c.brandName,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: c.brandName,
    title: `${c.brandName} — ${c.tagline}`,
    description: c.description,
    url: SITE_URL,
    images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: "Agency Studio OS" }],
    locale: c.defaultLocale,
  },
  twitter: { card: "summary_large_image", site: c.twitter, creator: c.twitter },
  themeColor: c.themeColor,
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <StoreProvider>
        <SiteShell
          brand={DEFAULT_SITE_CONFIG}
          homeHref={PUBLIC_BASE}
          navItems={PUBLIC_NAV}
          cta={PUBLIC_CTA}
          navExtras={<ThemePresetSwitcher />}
          footerColumns={FOOTER_COLUMNS}
          footerTagline={FOOTER_TAGLINE}
          copyrightHolder={DEFAULT_SITE_CONFIG.studioName}
        >
          {children}
        </SiteShell>
      <DemoRibbon />
        <AiChatFab brand={DEFAULT_SITE_CONFIG.brandName} />
        </StoreProvider>
    </Suspense>
  );
}
