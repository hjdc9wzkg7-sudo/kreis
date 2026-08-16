"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AvatarGroup } from "@/components/ui/Avatar";
import { FormatBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Circle } from "@/lib/types";
import { formatLabels, getUserById } from "@/lib/data";

interface CircleCardProps {
  circle: Circle;
  variant?: "compact" | "full" | "discovery";
  onJoin?: () => void;
  showWhyMatch?: boolean;
}

export function CircleCard({
  circle,
  variant = "compact",
  onJoin,
  showWhyMatch = false,
}: CircleCardProps) {
  const memberInitials = circle.memberIds
    .map((id) => getUserById(id)?.initials ?? "?")
    .filter(Boolean);

  const spotsLeft = circle.maxMembers - circle.memberIds.length;

  if (variant === "discovery") {
    return (
      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-kreis-ink text-lg">
              {circle.name}
            </h3>
            <p className="text-sm text-kreis-muted mt-0.5">
              {circle.neighborhood} · Host: {circle.hostName}
            </p>
          </div>
          <FormatBadge format={circle.format} />
        </div>

        <p className="text-sm text-kreis-ink/80 leading-relaxed">
          {circle.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AvatarGroup initials={memberInitials} />
            <span className="text-xs text-kreis-muted">
              {circle.memberIds.length}/{circle.maxMembers} · {spotsLeft} Plätze frei
            </span>
          </div>
        </div>

        {showWhyMatch && circle.whyMatch.length > 0 && (
          <div className="bg-kreis-sageLight/50 rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-medium text-kreis-sage">
              Warum dieser Kreis?
            </p>
            {circle.whyMatch.map((reason, i) => (
              <p key={i} className="text-xs text-kreis-ink/70">
                · {reason}
              </p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {onJoin && (
            <Button onClick={onJoin} className="flex-1">
              Kreis beitreten
            </Button>
          )}
          <Link href={`/kreise/${circle.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Mehr erfahren
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Link href={`/kreise/${circle.id}`}>
      <Card className="hover:border-kreis-clay/30 transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-kreis-ink">{circle.name}</h3>
            <p className="text-sm text-kreis-muted mt-0.5">
              {formatLabels[circle.format]} · Saison Woche{" "}
              {circle.season.weekNumber}/{circle.season.totalWeeks}
            </p>
          </div>
          <FormatBadge format={circle.format} />
        </div>
        {variant === "full" && (
          <p className="text-sm text-kreis-muted mt-3 line-clamp-2">
            {circle.season.ritual}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <AvatarGroup initials={memberInitials} />
          <span className="text-xs text-kreis-muted">
            {circle.memberIds.length} Mitglieder
          </span>
        </div>
      </Card>
    </Link>
  );
}
