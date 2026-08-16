"use client";

import Link from "next/link";
import { AppHeader } from "@/components/layout/Navigation";
import { CircleCard } from "@/components/circles/CircleCard";
import { MeetupCard } from "@/components/circles/MeetupCard";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/store";
import { getJoinedCircles, getMeetupById, energyLabels } from "@/lib/data";

export default function HomePage() {
  const { state, dispatch } = useApp();
  const joinedCircles = getJoinedCircles(state);
  const nextCircle = joinedCircles[0];
  const nextMeetup = nextCircle
    ? getMeetupById(nextCircle.nextMeetupId)
    : undefined;

  const greeting = getGreeting();

  return (
    <main>
      <AppHeader
        title={`${greeting}, ${state.currentUser.name}`}
        subtitle="Was möchtest du diese Woche tun?"
      />

      <div className="px-5 space-y-6 pb-6">
        <Card padding="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-kreis-muted">Deine Intention</p>
              <p className="text-sm font-medium text-kreis-ink mt-0.5">
                {energyLabels[state.currentUser.intention.energy]} ·{" "}
                {state.currentUser.intention.neighborhood}
              </p>
            </div>
            <Link
              href="/profil"
              className="text-xs text-kreis-clay font-medium hover:underline"
            >
              Anpassen
            </Link>
          </div>
        </Card>

        {nextMeetup && nextCircle && (
          <section>
            <h2 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide mb-3">
              Nächstes Treffen
            </h2>
            <MeetupCard
              meetup={nextMeetup}
              currentUserId={state.currentUser.id}
              onRsvp={(status) =>
                dispatch({ type: "UPDATE_RSVP", meetupId: nextMeetup.id, status })
              }
            />
            <Link
              href={`/kreise/${nextCircle.id}`}
              className="block text-center text-sm text-kreis-clay mt-2 hover:underline"
            >
              Zum Kreis „{nextCircle.name}"
            </Link>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide">
              Deine Kreise
            </h2>
            <Link
              href="/kreise"
              className="text-xs text-kreis-clay font-medium hover:underline"
            >
              Alle anzeigen
            </Link>
          </div>
          <div className="space-y-3">
            {joinedCircles.map((circle) => (
              <CircleCard key={circle.id} circle={circle} variant="full" />
            ))}
          </div>
        </section>

        {joinedCircles.length < 2 && (
          <section>
            <Card className="bg-kreis-sageLight/30 border-kreis-sage/20">
              <p className="text-sm text-kreis-ink">
                <span className="font-medium">Tipp:</span> Ein zweiter Kreis
                kann helfen, neue Routinen aufzubauen. Heute hast du noch{" "}
                <span className="font-medium">2 Vorschläge</span> offen.
              </p>
              <Link
                href="/entdecken"
                className="inline-block text-sm text-kreis-sage font-medium mt-2 hover:underline"
              >
                Vorschläge ansehen →
              </Link>
            </Card>
          </section>
        )}
      </div>
    </main>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Guten Morgen";
  if (hour < 18) return "Hallo";
  return "Guten Abend";
}
