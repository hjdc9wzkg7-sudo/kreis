import type { Metadata } from "next";
import { AppProvider } from "@/lib/store";
import { BottomNav } from "@/components/layout/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "KREIS — Finde deinen kleinen Kreis",
  description:
    "Soziale Plattform für kleine Gruppen mit wiederkehrenden gemeinsamen Erlebnissen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <AppProvider>
          <div className="max-w-lg mx-auto min-h-screen safe-bottom">
            {children}
            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
