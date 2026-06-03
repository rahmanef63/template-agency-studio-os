"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Fields = {
  siteName: string;
  tagline: string;
  ownerName: string;
  contactEmail: string;
  brandColor: string;
  themeDefault: string;
  logoUrl: string;
  faviconUrl: string;
  analyticsId: string;
};

const STEPS = ["Identitas", "Branding", "Konten", "Selesai"];

/**
 * Post-claim onboarding wizard. Stores ALL site config in Convex (editable later
 * in admin Settings) so a non-coder configures their site with zero code. Shown
 * once (until siteSettings.onboardedAt is set). Skippable.
 */
export function OnboardingWizard({ onDone }: { onDone: () => void }) {
  const upsert = useMutation(api.settings.upsert);
  const seedSample = useMutation(api.seed.seedSample);
  const status = useQuery(api.setup.status);
  const [step, setStep] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [seeded, setSeeded] = React.useState(false);
  const [f, setF] = React.useState<Fields>({
    siteName: "",
    tagline: "",
    ownerName: "",
    contactEmail: "",
    brandColor: "#0a0a0a",
    themeDefault: "system",
    logoUrl: "",
    faviconUrl: "",
    analyticsId: "",
  });
  const set = (k: keyof Fields, v: string) => setF((p) => ({ ...p, [k]: v }));
  const alreadySeeded = seeded || status?.seeded;

  async function finish(skip = false) {
    setBusy(true);
    try {
      await upsert({
        siteName: f.siteName || undefined,
        tagline: f.tagline || undefined,
        ownerName: f.ownerName || undefined,
        contactEmail: f.contactEmail || undefined,
        brandColor: f.brandColor || undefined,
        themeDefault: f.themeDefault || undefined,
        logoUrl: f.logoUrl || undefined,
        faviconUrl: f.faviconUrl || undefined,
        analyticsId: f.analyticsId || undefined,
        markOnboarded: true,
      });
    } finally {
      setBusy(false);
      void skip;
      onDone();
    }
  }

  async function loadSample() {
    setBusy(true);
    try {
      await seedSample();
      setSeeded(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-6">
      <Card className="w-full max-w-lg border-border/60 shadow-[var(--shadow-lift)]">
        <CardContent className="p-7">
          <div className="mb-4 flex items-center gap-2 text-brand">
            <Sparkles className="size-4" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">Setup</span>
          </div>
          <Progress value={((step + 1) / STEPS.length) * 100} className="mb-5" />

          {step === 0 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight">Identitas situs</h1>
              <Field label="Nama situs / studio">
                <Input value={f.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="atelier.studio" />
              </Field>
              <Field label="Tagline">
                <Input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="Brand systems for ambitious teams" />
              </Field>
              <Field label="Nama pemilik">
                <Input value={f.ownerName} onChange={(e) => set("ownerName", e.target.value)} placeholder="Asti R." />
              </Field>
              <Field label="Email kontak">
                <Input type="email" value={f.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="halo@atelier.studio" />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight">Branding</h1>
              <Field label="Warna brand">
                <div className="flex items-center gap-3">
                  <input type="color" value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} className="size-10 rounded-md border border-border/60" />
                  <Input value={f.brandColor} onChange={(e) => set("brandColor", e.target.value)} />
                </div>
              </Field>
              <Field label="Logo URL (opsional)">
                <Input value={f.logoUrl} onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://…" />
              </Field>
              <Field label="Favicon URL (opsional)">
                <Input value={f.faviconUrl} onChange={(e) => set("faviconUrl", e.target.value)} placeholder="https://…" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold tracking-tight">Konten awal</h1>
              <p className="text-sm text-muted-foreground">
                Isi situs dengan konten contoh (proyek, klien, layanan, jurnal) agar langsung
                terlihat. Bisa kamu ganti kapan saja.
              </p>
              <Button onClick={loadSample} disabled={busy || alreadySeeded} variant="outline" className="w-fit gap-1.5">
                {busy ? <Loader2 className="size-4 animate-spin" /> : alreadySeeded ? <Check className="size-4 text-brand" /> : <Sparkles className="size-4" />}
                {alreadySeeded ? "Konten contoh sudah diisi" : "Isi konten contoh"}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h1 className="text-2xl font-semibold tracking-tight">Selesai 🎉</h1>
              <p className="text-sm text-muted-foreground">
                Situs kamu siap. Kamu bisa edit semua pengaturan ini nanti di Studio Settings.
              </p>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || busy} className="gap-1">
              <ArrowLeft className="size-4" /> Kembali
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => void finish(true)} disabled={busy}>
                Lewati
              </Button>
              {step < STEPS.length - 1 ? (
                <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={busy} className="gap-1">
                  Lanjut <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button size="sm" onClick={() => void finish(false)} disabled={busy} className="gap-1">
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Selesai
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
