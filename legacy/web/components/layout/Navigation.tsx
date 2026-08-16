"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Heute", icon: "◎" },
  { href: "/entdecken", label: "Entdecken", icon: "◇" },
  { href: "/kreise", label: "Meine Kreise", icon: "○" },
  { href: "/profil", label: "Profil", icon: "◉" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-kreis-border z-50">
      <div className="max-w-lg mx-auto flex">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex-1 flex flex-col items-center gap-0.5 py-3 text-xs transition-colors",
                active
                  ? "text-kreis-clay font-medium"
                  : "text-kreis-muted hover:text-kreis-ink"
              )}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function AppHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-5 pt-8 pb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-kreis-clay font-display text-lg font-bold tracking-tight">
          KREIS
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-kreis-ink">{title}</h1>
      {subtitle && (
        <p className="text-kreis-muted text-sm mt-1">{subtitle}</p>
      )}
    </header>
  );
}
