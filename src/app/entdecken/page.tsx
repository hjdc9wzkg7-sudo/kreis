"use client";

import { AppHeader } from "@/components/layout/Navigation";
import { CircleCard } from "@/components/circles/CircleCard";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/store";
import { getDiscoverySuggestions } from "@/lib/data";

const MAX_DAILY_SUGGESTIONS = 3;

export default function EntdeckenPage() {
  const { state, dispatch } = useApp();
  const suggestions = getDiscoverySuggestions(state).slice(
    0,
    MAX_DAILY_SUGGESTIONS
  );
  const remaining = MAX_DAILY_SUGGESTIONS - state.dailySuggestionsShown;

  function handleJoin(circleId: string) {
    dispatch({ type: "JOIN_CIRCLE", circleId });
    dispatch({ type: "INCREMENT_SUGGESTIONS" });
  }

  return (
    <main>
      <AppHeader
        title="Entdecken"
        subtitle="Endliche Vorschläge — max. 3 pro Tag, immer mit klarem Anlass."
      />

      <div className="px-5 space-y-5 pb-6">
        <Card padding="sm" className="bg-kreis-cream border-dashed">
          <p className="text-xs text-kreis-muted">
            Heute {remaining} von {MAX_DAILY_SUGGESTIONS} Vorschlägen · Jeder
            führt zu einem konkreten Format und Termin
          </p>
        </Card>

        {suggestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-kreis-muted text-sm">
              Keine neuen Vorschläge — du bist in allen passenden Kreisen
              dabei oder hast dein Tageslimit erreicht.
            </p>
          </div>
        ) : (
          suggestions.map((circle) => (
            <CircleCard
              key={circle.id}
              circle={circle}
              variant="discovery"
              showWhyMatch
              onJoin={() => handleJoin(circle.id)}
            />
          ))
        )}

        <Card padding="sm">
          <p className="text-xs text-kreis-muted leading-relaxed">
            <span className="font-medium text-kreis-ink">Kein Algorithmus-Black-Box:</span>{" "}
            Du siehst immer, warum ein Kreis vorgeschlagen wird. Präferenzen
            kannst du in deinem Profil anpassen.
          </p>
        </Card>
      </div>
    </main>
  );
}
