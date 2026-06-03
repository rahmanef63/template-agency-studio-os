"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { DEFAULT_SITE_CONFIG } from "../../../shared/site-config";

export function SettingsView() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Studio Settings</h1>
        <p className="text-sm text-muted-foreground">
          Identitas situs disimpan di Convex (diisi lewat wizard onboarding). Default
          template ada di components/templates/agency-studio/shared/site-config.ts.
        </p>
      </div>
      <Card className="border-border/60">
        <CardContent className="space-y-3 p-6 text-sm">
          <Row k="Studio name" v={settings?.siteName || c.studioName} />
          <Row k="Brand" v={settings?.siteName || c.brandName} />
          <Row k="Tagline" v={settings?.tagline || c.tagline} />
          <Row k="Owner" v={settings?.ownerName || c.studioName} />
          <Row k="Email" v={settings?.contactEmail || c.email} mono />
          <Row k="Domain" v={c.baseUrl} mono />
          <Row k="Twitter" v={c.twitter} mono />
          <Row k="Locale" v={c.defaultLocale} />
          <Row k="Brand color" v={settings?.brandColor || c.themeColor} mono />
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="flex items-center justify-between gap-4 p-6 text-sm">
          <div>
            <p className="font-medium text-foreground">Appearance</p>
            <p className="text-muted-foreground">
              Pilih display mode (light/dark/system) + color preset. Tersimpan
              di browser, berlaku ke seluruh dashboard & situs publik.
            </p>
          </div>
          <ThemePresetSwitcher />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <UpdateCard />
        <BackupCard />
      </div>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      {mono ? <span className="font-mono">{v}</span> : <Badge variant="outline">{v}</Badge>}
    </div>
  );
}
