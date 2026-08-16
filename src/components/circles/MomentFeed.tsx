"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Moment } from "@/lib/types";
import { getUserById } from "@/lib/data";

interface MomentFeedProps {
  moments: Moment[];
  currentUserId: string;
  onAddMoment: (content: string) => void;
  onReact: (momentId: string, emoji: string) => void;
}

const reactionEmojis = ["❤️", "👍", "😊", "👏", "🫶"];

export function MomentFeed({
  moments,
  currentUserId,
  onAddMoment,
  onReact,
}: MomentFeedProps) {
  const [newMoment, setNewMoment] = useState("");
  const [showComposer, setShowComposer] = useState(false);

  function handleSubmit() {
    if (!newMoment.trim()) return;
    onAddMoment(newMoment.trim());
    setNewMoment("");
    setShowComposer(false);
  }

  return (
    <div className="space-y-3">
      {!showComposer ? (
        <button
          onClick={() => setShowComposer(true)}
          className="w-full text-left px-4 py-3 bg-kreis-sand/50 rounded-xl text-sm text-kreis-muted hover:bg-kreis-sand transition-colors"
        >
          Teile einen Moment mit deinem Kreis…
        </button>
      ) : (
        <Card padding="sm">
          <textarea
            value={newMoment}
            onChange={(e) => setNewMoment(e.target.value)}
            placeholder="Was möchtest du mit deinem Kreis teilen?"
            className="w-full bg-transparent text-sm text-kreis-ink placeholder:text-kreis-muted resize-none outline-none min-h-[80px]"
            autoFocus
          />
          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComposer(false)}
            >
              Abbrechen
            </Button>
            <Button size="sm" onClick={handleSubmit} disabled={!newMoment.trim()}>
              Teilen
            </Button>
          </div>
        </Card>
      )}

      {moments.map((moment) => {
        const author = getUserById(moment.authorId);
        const date = new Date(moment.createdAt).toLocaleDateString("de-DE", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <Card key={moment.id} padding="sm">
            <div className="flex gap-3">
              {author && <Avatar initials={author.initials} size="sm" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-kreis-ink">
                    {author?.name}
                  </span>
                  <span className="text-xs text-kreis-muted">{date}</span>
                </div>

                {moment.type === "photo" ? (
                  <div className="mt-2">
                    <div className="bg-kreis-sand rounded-xl h-32 flex items-center justify-center text-kreis-muted text-sm">
                      📷 {moment.caption ?? "Foto"}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-kreis-ink/90 mt-1 leading-relaxed">
                    {moment.content}
                  </p>
                )}

                <div className="flex items-center gap-1 mt-2">
                  {reactionEmojis.map((emoji) => {
                    const count = Object.values(moment.reactions).filter(
                      (r) => r === emoji
                    ).length;
                    const isMine = moment.reactions[currentUserId] === emoji;
                    return (
                      <button
                        key={emoji}
                        onClick={() => onReact(moment.id, emoji)}
                        className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                          isMine
                            ? "bg-kreis-clay/10 text-kreis-clay"
                            : count > 0
                              ? "bg-kreis-sand text-kreis-muted"
                              : "text-kreis-muted/50 hover:bg-kreis-sand"
                        }`}
                      >
                        {emoji} {count > 0 && count}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        );
      })}

      {moments.length === 0 && (
        <p className="text-center text-sm text-kreis-muted py-8">
          Noch keine Momente — teile den ersten mit deinem Kreis.
        </p>
      )}
    </div>
  );
}
