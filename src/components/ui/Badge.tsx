import clsx from "clsx";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "info";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-kreis-sand text-kreis-muted": tone === "neutral",
          "bg-kreis-sageLight text-kreis-sage": tone === "success",
          "bg-amber-50 text-amber-700": tone === "warning",
          "bg-blue-50 text-blue-700": tone === "info",
        }
      )}
    >
      {children}
    </span>
  );
}

export function FormatBadge({ format }: { format: string }) {
  const icons: Record<string, string> = {
    kochen: "🍳",
    fotowalk: "📷",
    bewegung: "🚶",
  };
  const labels: Record<string, string> = {
    kochen: "Kochen",
    fotowalk: "Fotowalk",
    bewegung: "Bewegung",
  };
  return (
    <Badge tone="info">
      {icons[format]} {labels[format] ?? format}
    </Badge>
  );
}
