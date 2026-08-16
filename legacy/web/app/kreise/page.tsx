"use client";

import Link from "next/link";
import { AppHeader } from "@/components/layout/Navigation";
import { CircleCard } from "@/components/circles/CircleCard";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { getJoinedCircles } from "@/lib/data";

export default function KreisePage() {
  const { state } = useApp();
  const joinedCircles = getJoinedCircles(state);

  return (
    <main>
      <AppHeader
        title="Meine Kreise"
        subtitle={`${joinedCircles.length} aktive ${joinedCircles.length === 1 ? "Kreis" : "Kreise"}`}
      />

      <div className="px-5 space-y-4 pb-6">
        {joinedCircles.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-kreis-muted text-sm">
              Du bist noch in keinem Kreis. Finde deinen ersten über Entdecken.
            </p>
            <Link href="/entdecken">
              <Button>Kreis finden</Button>
            </Link>
          </div>
        ) : (
          joinedCircles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} variant="full" />
          ))
        )}
      </div>
    </main>
  );
}
