"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeColorPicker } from "@/features/_shared/ui/theme-color-picker";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UpdateCard } from "@/components/admin/update-card";
import { BackupCard } from "@/components/admin/backup-card";
import { ThemePresetSwitcher } from "@/features/theme-presets";
import { ImagePickerButton } from "@/features/image-picker";
import { parseSocials } from "@/features/_shared/ui/site-footer";
import { DEFAULT_SITE_CONFIG } from "@/features/_app/site-config";
import { ResetLandingCard } from "@/features/_shared/ui/reset-landing-card";

/** One coherent settings editor for the Convex `siteSettings` singleton (the
 *  same row the wizard / public chrome read). Brand / Contact / Social / About
 *  are sections of a single form: hydrated once from `settings.get`, saved in a
 *  single `settings.upsert`. Empty fields stay undefined so the public pages
 *  keep falling back to their template defaults. */
export function SettingsView() {
  const c = DEFAULT_SITE_CONFIG;
  const settings = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const genUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useMutation(api.files.getUrl);

  // Brand
  const [siteName, setSiteName] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [ownerName, setOwnerName] = React.useState("");
  const [brandColor, setBrandColor] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState("");
  // Contact
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactPhone, setContactPhone] = React.useState("");
  const [contactAddress, setContactAddress] = React.useState("");
  // Social
  const [socialX, setSocialX] = React.useState("");
  const [socialLinkedin, setSocialLinkedin] = React.useState("");
  const [socialGithub, setSocialGithub] = React.useState("");
  const [socialYoutube, setSocialYoutube] = React.useState("");
  // About
  const [aboutHeadline, setAboutHeadline] = React.useState("");
  const [aboutBody, setAboutBody] = React.useState("");
  const [aboutImageUrl, setAboutImageUrl] = React.useState("");

  const [hydrated, setHydrated] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (settings === undefined || hydrated) return;
    setSiteName(settings?.siteName ?? "");
    setTagline(settings?.tagline ?? "");
    setOwnerName(settings?.ownerName ?? "");
    setBrandColor(settings?.brandColor ?? "");
    setLogoUrl(settings?.logoUrl ?? "");
    setContactEmail(settings?.contactEmail ?? "");
    setContactPhone(settings?.contactPhone ?? "");
    setContactAddress(settings?.contactAddress ?? "");
    const sc = parseSocials(settings?.socials);
    setSocialX(sc.x ?? "");
    setSocialLinkedin(sc.linkedin ?? "");
    setSocialGithub(sc.github ?? "");
    setSocialYoutube(sc.youtube ?? "");
    setAboutHeadline(settings?.aboutHeadline ?? "");
    setAboutBody(settings?.seoDescription ?? "");
    setAboutImageUrl(settings?.aboutImageUrl ?? "");
    setHydrated(true);
  }, [settings, hydrated]);

  const onUpload = async (file: File): Promise<string> => {
    const uploadUrl = await genUploadUrl();
    const res = await fetch(uploadUrl, { method: "POST", headers: { "Content-Type": file.type }, body: file });
    const { storageId } = (await res.json()) as { storageId: string };
    return ((await getFileUrl({ storageId: storageId as never })) as string) ?? "";
  };

  async function save() {
    setBusy(true);
    try {
      const socialsMap = Object.fromEntries(
        ([["x", socialX], ["linkedin", socialLinkedin], ["github", socialGithub], ["youtube", socialYoutube]] as const)
          .filter(([, v]) => v.trim()),
      );
      await upsert({
        siteName: siteName || undefined,
        tagline: tagline || undefined,
        ownerName: ownerName || undefined,
        brandColor: brandColor || undefined,
        logoUrl: logoUrl || undefined,
        contactEmail: contactEmail || undefined,
        contactPhone: contactPhone || undefined,
        contactAddress: contactAddress || undefined,
        socials: Object.keys(socialsMap).length ? JSON.stringify(socialsMap) : undefined,
        aboutHeadline: aboutHeadline || undefined,
        seoDescription: aboutBody || undefined,
        aboutImageUrl: aboutImageUrl || undefined,
      });
      toast.success("Settings tersimpan.");
    } catch {
      toast.error("Gagal menyimpan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Studio Settings</h1>
          <p className="text-sm text-muted-foreground">
            Identitas situs disimpan di Convex (diisi lewat wizard onboarding). Default
            template ada di components/templates/agency-studio/shared/site-config.ts.
          </p>
        </div>
        <Button onClick={save} disabled={busy || settings === undefined} className="gap-1.5">
          {busy ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
        </Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="space-y-8 p-6">
          {/* Brand identity */}
          <Section
            title="Brand identity"
            hint="Nama studio, tagline, owner, warna brand, dan logo. Tampil di header/footer situs publik."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Studio / brand name">
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder={c.studioName} />
              </Field>
              <Field label="Tagline">
                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder={c.tagline} />
              </Field>
              <Field label="Owner">
                <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder={c.studioName} />
              </Field>
              <Field label="Brand color">
                <ThemeColorPicker
                  value={brandColor}
                  onChange={setBrandColor}
                  placeholder={c.themeColor}
                />
              </Field>
            </div>
            <Field label="Logo">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" className="h-9 w-auto rounded-md border border-border/60 object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">Belum ada logo — header pakai wordmark.</span>
                )}
                <ImagePickerButton
                  label={logoUrl ? "Ganti logo" : "Upload logo"}
                  title="Logo"
                  onUpload={onUpload}
                  searchUnsplash={undefined}
                  onChange={(img) => setLogoUrl(img?.value ?? "")}
                />
                {logoUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setLogoUrl("")}>
                    Hapus
                  </Button>
                )}
              </div>
            </Field>
          </Section>

          {/* Contact info */}
          <Section
            title="Contact info"
            hint="Email, telepon/WhatsApp, dan alamat yang tampil di halaman Contact publik."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email kontak">
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="halo@atelier.studio" />
              </Field>
              <Field label="Telepon / WhatsApp">
                <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+62 812 3456 7890" />
              </Field>
              <Field label="Alamat">
                <Input value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} placeholder="Jakarta, Indonesia" />
              </Field>
            </div>
          </Section>

          {/* Social links */}
          <Section
            title="Social links"
            hint="Hanya platform yang diisi yang tampil di footer situs publik."
          >
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
          </Section>

          {/* About page */}
          <Section
            title="About page"
            hint="Headline, bio, dan foto di halaman About. Kosongkan untuk pakai teks default template."
          >
            <Field label="Judul / headline">
              <Input value={aboutHeadline} onChange={(e) => setAboutHeadline(e.target.value)} placeholder="Atelier Studio — founded 2019" />
            </Field>
            <Field label="Bio / intro">
              <Textarea value={aboutBody} onChange={(e) => setAboutBody(e.target.value)} rows={3} placeholder="Ceritakan tentang studio…" />
            </Field>
            <Field label="Foto">
              <div className="flex items-center gap-3">
                {aboutImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={aboutImageUrl} alt="About" className="size-16 rounded-lg border border-border/60 object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">Belum ada foto.</span>
                )}
                <ImagePickerButton
                  label={aboutImageUrl ? "Ganti foto" : "Upload foto"}
                  title="Foto About"
                  onUpload={onUpload}
                  searchUnsplash={undefined}
                  onChange={(img) => setAboutImageUrl(img?.value ?? "")}
                />
                {aboutImageUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setAboutImageUrl("")}>
                    Hapus
                  </Button>
                )}
              </div>
            </Field>
          </Section>

          <div className="flex justify-end">
            <Button onClick={save} disabled={busy || settings === undefined}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : "Simpan"}
            </Button>
          </div>
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

      <ResetLandingCard />

      <div className="grid gap-4 md:grid-cols-2">
        <UpdateCard />
        <BackupCard />
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      {children}
    </div>
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
