import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/convex-provider";
import { ThemeProviders } from "@/components/theme-providers";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  ),
  title: { default: "Agency Studio OS", template: "%s — Agency Studio OS" },
  description:
    "Website OS for agencies & creative studios — leads + clients, projects + work showcase, services + journal. Free website template, clone-to-own.",
  openGraph: {
    title: "Agency Studio OS",
    description:
      "Website OS for agencies & creative studios — leads + clients, projects + work showcase, services + journal. Free website template, clone-to-own.",
    type: "website",
    siteName: "Agency Studio OS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agency Studio OS",
    description:
      "Website OS for agencies & creative studios — leads + clients, projects + work showcase, services + journal. Free website template, clone-to-own.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProviders>
          <Suspense fallback={null}>
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </Suspense>
        </ThemeProviders>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
