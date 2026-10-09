import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavLinks } from "@/app/components/nav-links";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FinanceFlow — Sistem Keuangan Bisnis",
    template: "%s | FinanceFlow",
  },
  description:
    "Dashboard pencatatan keuangan bisnis: transaksi, kategori, dan ringkasan saldo kas & bank.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
            <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                F
              </span>
              <div className="leading-tight">
                <p className="text-base font-bold text-slate-900">
                  FinanceFlow
                </p>
                <p className="text-[11px] text-slate-500">
                  Sistem Keuangan Bisnis
                </p>
              </div>
            </div>

            <div className="flex-1 px-3 py-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Menu
              </p>
              <NavLinks />
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <p className="text-[11px] text-slate-400">
                FinanceFlow — Catatan keuangan bisnis
              </p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 backdrop-blur">
              <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-8">
                <div className="flex items-center gap-2 md:hidden">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                    F
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    FinanceFlow
                  </span>
                </div>

                <div className="hidden md:block">
                  <NavLinks orientation="horizontal" />
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden text-sm font-medium text-slate-600 sm:inline">
                    Admin Finance
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-600 shadow-sm">
                    AF
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 px-3 py-2 md:hidden">
                <NavLinks orientation="horizontal" />
              </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 md:px-8 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
