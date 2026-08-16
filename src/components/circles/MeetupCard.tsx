"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Meetup, RsvpStatus } from "@/lib/types";
import { getUserById } from "@/lib/data";

interface MeetupCardProps {
  meetup: Meetup;
  currentUserId: string;
  onRsvp: (status: RsvpStatus) => void;
}

const rsvpLabels: Record<RsvpStatus, string> = {
  yes: "Dabei",
  maybe: "Vielleicht",
  no: "Absagen",
  pending: "Offen",
};

export function MeetupCard({ meetup, currentUserId, onRsvp }: MeetupCardProps) {
  const myRsvp = meetup.rsvps[currentUserId] ?? "pending";
  const attending = Object.entries(meetup.rsvps).filter(
    ([, status]) => status === "yes"
  );

  const dateObj = new Date(meetup.date + "T" + meetup.time);
  const dateStr = dateObj.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-kreis-ink">{meetup.title}</h3>
          <p className="text-sm text-kreis-clay font-medium mt-1">
            {dateStr} · {meetup.time} Uhr
          </p>
        </div>

        <div className="bg-kreis-cream rounded-xl p-3">
          <p className="text-sm text-kreis-ink">{meetup.location}</p>
          {myRsvp !== "yes" && (
            <p className="text-xs text-kreis-muted mt-1">
              {meetup.locationHint}
            </p>
          )}
        </div>

        {attending.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {attending.slice(0, 4).map(([userId]) => {
                const user = getUserById(userId);
                return user ? (
                  <Avatar
                    key={userId}
                    initials={user.initials}
                    size="sm"
                    className="ring-2 ring-white"
                  />
                ) : null;
              })}
            </div>
            <span className="text-xs text-kreis-muted">
              {attending.length} bestätigt
            </span>
          </div>
        )}

        <div className="flex gap-2">
          {(["yes", "maybe", "no"] as RsvpStatus[]).map((status) => (
            <Button
              key={status}
              variant={myRsvp === status ? "primary" : "secondary"}
              size="sm"
              className="flex-1"
              onClick={() => onRsvp(status)}
            >
              {rsvpLabels[status]}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
