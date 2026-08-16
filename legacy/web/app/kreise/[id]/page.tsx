"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/Navigation";
import { MeetupCard } from "@/components/circles/MeetupCard";
import { MomentFeed } from "@/components/circles/MomentFeed";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { FormatBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/store";
import { getUserById, getMeetupById } from "@/lib/data";

export default function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"treffen" | "momente" | "info">(
    "treffen"
  );

  const circle = state.circles.find((c) => c.id === id);
  const isMember = state.joinedCircleIds.includes(id);
  const meetup = circle ? getMeetupById(circle.nextMeetupId) : undefined;
  const moments = state.moments
    .filter((m) => m.circleId === id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  if (!circle) {
    return (
      <main className="px-5 py-12 text-center">
        <p className="text-kreis-muted">Kreis nicht gefunden.</p>
        <Button variant="ghost" onClick={() => router.push("/kreise")} className="mt-4">
          Zurück
        </Button>
      </main>
    );
  }

  const members = circle.memberIds
    .map((uid) => getUserById(uid))
    .filter(Boolean);

  function handleLeave() {
    dispatch({ type: "LEAVE_CIRCLE", circleId: id });
    router.push("/kreise");
  }

  function handleJoin() {
    dispatch({ type: "JOIN_CIRCLE", circleId: id });
  }

  return (
    <main>
      <AppHeader title={circle.name} subtitle={circle.neighborhood} />

      <div className="px-5 space-y-5 pb-6">
        {/* Season banner */}
        <Card className="bg-gradient-to-br from-kreis-clay/5 to-kreis-sageLight/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-kreis-muted uppercase tracking-wide">
                Saison · Woche {circle.season.weekNumber}/
                {circle.season.totalWeeks}
              </p>
              <h2 className="font-semibold text-kreis-ink mt-1">
                {circle.season.name}
              </h2>
              <p className="text-sm text-kreis-muted mt-1">
                {circle.season.ritual}
              </p>
            </div>
            <FormatBadge format={circle.format} />
          </div>
          <div className="mt-3 h-1.5 bg-kreis-sand rounded-full overflow-hidden">
            <div
              className="h-full bg-kreis-clay rounded-full transition-all"
              style={{
                width: `${(circle.season.weekNumber / circle.season.totalWeeks) * 100}%`,
              }}
            />
          </div>
        </Card>

        {/* Members */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarGroup
              initials={members.map((m) => m!.initials)}
            />
            <span className="text-sm text-kreis-muted">
              {circle.memberIds.length}/{circle.maxMembers} Mitglieder
            </span>
          </div>
          {!isMember && (
            <Button size="sm" onClick={handleJoin}>
              Beitreten
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-kreis-sand/50 rounded-xl p-1">
          {(
            [
              ["treffen", "Treffen"],
              ["momente", "Momente"],
              ["info", "Info"],
            ] as const
          ).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-white text-kreis-ink font-medium shadow-sm"
                  : "text-kreis-muted hover:text-kreis-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "treffen" && meetup && (
          <MeetupCard
            meetup={meetup}
            currentUserId={state.currentUser.id}
            onRsvp={(status) =>
              dispatch({ type: "UPDATE_RSVP", meetupId: meetup.id, status })
            }
          />
        )}

        {activeTab === "momente" && isMember && (
          <MomentFeed
            moments={moments}
            currentUserId={state.currentUser.id}
            onAddMoment={(content) =>
              dispatch({ type: "ADD_MOMENT", circleId: id, content })
            }
            onReact={(momentId, emoji) =>
              dispatch({ type: "ADD_REACTION", momentId, emoji })
            }
          />
        )}

        {activeTab === "momente" && !isMember && (
          <p className="text-center text-sm text-kreis-muted py-8">
            Momente sind nur für Kreis-Mitglieder sichtbar.
          </p>
        )}

        {activeTab === "info" && (
          <div className="space-y-4">
            <Card>
              <h3 className="font-medium text-kreis-ink mb-2">Über diesen Kreis</h3>
              <p className="text-sm text-kreis-muted leading-relaxed">
                {circle.description}
              </p>
            </Card>

            <Card>
              <h3 className="font-medium text-kreis-ink mb-2">Mitglieder</h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member!.id} className="flex items-center gap-3">
                    <Avatar initials={member!.initials} size="sm" />
                    <div>
                      <p className="text-sm font-medium">{member!.name}</p>
                      <p className="text-xs text-kreis-muted">
                        {member!.intention.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {circle.whyMatch.length > 0 && (
              <Card>
                <h3 className="font-medium text-kreis-ink mb-2">
                  Warum dieser Kreis?
                </h3>
                <ul className="space-y-1">
                  {circle.whyMatch.map((reason, i) => (
                    <li key={i} className="text-sm text-kreis-muted">
                      · {reason}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {isMember && (
              <div className="pt-4 border-t border-kreis-border">
                {!showLeaveConfirm ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    onClick={() => setShowLeaveConfirm(true)}
                  >
                    Kreis verlassen
                  </Button>
                ) : (
                  <Card padding="sm" className="border-red-200 bg-red-50/50">
                    <p className="text-sm text-kreis-ink mb-3">
                      Möchtest du „{circle.name}" wirklich verlassen?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleLeave}
                      >
                        Ja, verlassen
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowLeaveConfirm(false)}
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
