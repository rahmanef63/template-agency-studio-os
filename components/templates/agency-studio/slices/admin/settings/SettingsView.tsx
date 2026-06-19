"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { parseSocials } from "@/components/templates/_shared/ui/site-footer";
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

      <SocialLinksForm />

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

/** Editable social links — writes the JSON `socials` field on the Convex
 *  `siteSettings` singleton (same row the wizard / public footer read). Only
 *  the platforms with a URL get serialized; the public footer renders only
 *  those. Mirrors the personal-brand-os reference. */
function SocialLinksForm() {
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [socialX, setSocialX] = React.useState("");
  const [socialLinkedin, setSocialLinkedin] = React.useState("");
  const [socialGithub, setSocialGithub] = React.useState("");
  const [socialYoutube, setSocialYoutube] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (settings === undefined || hydrated) return;
    const sc = parseSocials(settings?.socials);
    setSocialX(sc.x ?? "");
    setSocialLinkedin(sc.linkedin ?? "");
    setSocialGithub(sc.github ?? "");
    setSocialYoutube(sc.youtube ?? "");
    setHydrated(true);
  }, [settings, hydrated]);

  async function save() {
    setBusy(true);
    try {
      const socialsMap = Object.fromEntries(
        ([["x", socialX], ["linkedin", socialLinkedin], ["github", socialGithub], ["youtube", socialYoutube]] as const)
          .filter(([, v]) => v.trim()),
      );
      await upsert({
        socials: Object.keys(socialsMap).length ? JSON.stringify(socialsMap) : undefined,
      });
      toast.success("Social links tersimpan.");
    } catch {
      toast.error("Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-6">
        <div>
          <p className="font-medium text-foreground">Social links</p>
          <p className="text-sm text-muted-foreground">
            Hanya platform yang diisi yang tampil di footer situs publik.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="X / Twitter URL">
            <Input value={socialX} onChange={(e) => setSocialX(e.target.value)} placeholder="https://x.com/username" />
          </Field>
          <Field label="LinkedIn URL">
            <Input value={socialLinkedin} onChange={(e) => setSocialLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" />
          </Field>
          <Field label="GitHub URL">
            <Input value={socialGithub} onChange={(e) => setSocialGithub(e.target.value)} placeholder="https://github.com/username" />
          </Field>
          <Field label="YouTube URL">
            <Input value={socialYoutube} onChange={(e) => setSocialYoutube(e.target.value)} placeholder="https://youtube.com/@username" />
          </Field>
        </div>
        <div className="flex justify-end">
          <Button onClick={save} disabled={busy || settings === undefined}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
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
