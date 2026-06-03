"use client";

// Public AI assistant — a floating chat FAB (bottom-right) shown on every public
// page. Self-contained: no store/convex coupling, so it drops into any template
// unchanged. Demo replies are canned (like the showcase chat) — a cloner can
// later wire `reply()` to a real Convex action / LLM. Pairs with <DemoRibbon/>
// (bottom-left) without overlap.
import * as React from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Apa saja layanan yang ditawarkan?",
  "Bagaimana cara mulai kerja sama?",
  "Berapa estimasi harga & waktunya?",
];

function reply(q: string, brand: string): string {
  const t = q.toLowerCase();
  if (/harga|biaya|tarif|price|budget/.test(t))
    return `Untuk estimasi harga, paling enak kita ngobrol singkat dulu — kirim kebutuhanmu lewat halaman Kontak, tim ${brand} balas dengan penawaran yang pas.`;
  if (/layanan|service|jasa|bisa apa|produk/.test(t))
    return `${brand} fokus bantu kamu dari perencanaan sampai eksekusi. Cek halaman Layanan untuk rincian, atau tanya hal spesifik di sini.`;
  if (/mulai|start|kerja sama|kontak|hubungi|booking|jadwal/.test(t))
    return `Gampang — buka halaman Kontak, isi formnya, nanti kita jadwalkan obrolan. Mau aku ringkas dulu kebutuhanmu?`;
  if (/halo|hai|hi|hello|assalam/.test(t))
    return `Halo! Aku asisten ${brand}. Ada yang bisa kubantu soal layanan, harga, atau cara mulai?`;
  return `Noted! Untuk jawaban lengkap soal "${q.slice(0, 60)}", tim ${brand} bisa lanjut lewat halaman Kontak. Ada lagi yang mau ditanya?`;
}

export function AiFab({ brand = "kami" }: { brand?: string }) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [msgs, setMsgs] = React.useState<Msg[]>([
    { role: "ai", text: `Hai 👋 aku asisten ${brand}. Tanya apa saja soal layanan, harga, atau cara mulai.` },
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  function send(q: string) {
    const question = q.trim();
    if (!question) return;
    setText("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    // demo latency, then canned reply
    window.setTimeout(() => setMsgs((m) => [...m, { role: "ai", text: reply(question, brand) }]), 450);
  }

  return (
    <>
      {open && (
        <Card className="fixed bottom-20 right-5 z-40 flex h-[26rem] w-[20rem] flex-col overflow-hidden border-border/60 shadow-xl sm:w-[22rem]">
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" /> Asisten {brand}
            </div>
            <button onClick={() => setOpen(false)} aria-label="Tutup" className="text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <CardContent ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
            className="flex items-center gap-2 border-t p-3"
          >
            <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan…" className="h-9" />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0" aria-label="Kirim">
              <Send className="size-4" />
            </Button>
          </form>
        </Card>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Buka asisten AI"
        className="fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition hover:-translate-y-0.5"
      >
        {open ? <X className="size-5" /> : <Bot className="size-5" />}
      </button>
    </>
  );
}
