"use client";

import { AppHeader } from "@/components/layout/Navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/lib/store";
import type { Availability, EnergyLevel, FormatType } from "@/lib/types";
import { energyLabels, formatLabels } from "@/lib/data";

const neighborhoods = [
  "Prenzlauer Berg",
  "Mitte",
  "Friedrichshain",
  "Kreuzberg",
  "Neukölln",
  "Charlottenburg",
];

export default function ProfilPage() {
  const { state, dispatch } = useApp();
  const { intention } = state.currentUser;

  function updateIntention(partial: Partial<typeof intention>) {
    dispatch({ type: "UPDATE_INTENTION", intention: partial });
  }

  function toggleFormat(format: FormatType) {
    const formats = intention.formats.includes(format)
      ? intention.formats.filter((f) => f !== format)
      : [...intention.formats, format];
    updateIntention({ formats });
  }

  return (
    <main>
      <AppHeader
        title="Dein Profil"
        subtitle="Intention statt Hochglanzprofil — Passung über Energie und Verfügbarkeit."
      />

      <div className="px-5 space-y-5 pb-6">
        <Card>
          <div className="flex items-center gap-4">
            <Avatar initials={state.currentUser.initials} size="lg" />
            <div>
              <h2 className="font-semibold text-kreis-ink">
                {state.currentUser.name}
              </h2>
              <p className="text-sm text-kreis-muted mt-0.5">
                {intention.neighborhood}
              </p>
            </div>
          </div>
        </Card>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide">
            Energie
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["ruhig", "ausgeglichen", "aktiv"] as EnergyLevel[]).map(
              (level) => (
                <button
                  key={level}
                  onClick={() => updateIntention({ energy: level })}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    intention.energy === level
                      ? "bg-kreis-clay text-white"
                      : "bg-kreis-sand text-kreis-muted hover:bg-kreis-border"
                  }`}
                >
                  {energyLabels[level]}
                </button>
              )
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide">
            Verfügbarkeit
          </h3>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["wochentags", "Wochentags"],
                ["wochenende", "Wochenende"],
                ["flexibel", "Flexibel"],
              ] as [Availability, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => updateIntention({ availability: value })}
                className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                  intention.availability === value
                    ? "bg-kreis-clay text-white"
                    : "bg-kreis-sand text-kreis-muted hover:bg-kreis-border"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide">
            Formate
          </h3>
          <div className="flex flex-wrap gap-2">
            {(["kochen", "fotowalk", "bewegung"] as FormatType[]).map(
              (format) => (
                <button
                  key={format}
                  onClick={() => toggleFormat(format)}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                    intention.formats.includes(format)
                      ? "bg-kreis-sage text-white"
                      : "bg-kreis-sand text-kreis-muted hover:bg-kreis-border"
                  }`}
                >
                  {formatLabels[format]}
                </button>
              )
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide">
            Gegend
          </h3>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((n) => (
              <button
                key={n}
                onClick={() => updateIntention({ neighborhood: n })}
                className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${
                  intention.neighborhood === n
                    ? "bg-kreis-clay text-white"
                    : "bg-kreis-sand text-kreis-muted hover:bg-kreis-border"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-kreis-muted uppercase tracking-wide">
            Über dich
          </h3>
          <textarea
            value={intention.bio}
            onChange={(e) => updateIntention({ bio: e.target.value })}
            placeholder="Kurz: Was suchst du? Was magst du?"
            className="w-full bg-white border border-kreis-border rounded-xl p-4 text-sm text-kreis-ink placeholder:text-kreis-muted resize-none outline-none focus:border-kreis-clay min-h-[100px]"
          />
        </section>

        <Card padding="sm" className="bg-kreis-sageLight/20">
          <p className="text-xs text-kreis-muted leading-relaxed">
            <Badge tone="success">Privat ist Standard</Badge>
            <span className="ml-2">
              Dein Profil ist nur für Kreis-Mitglieder sichtbar. Keine
              öffentlichen Follower- oder Like-Zahlen.
            </span>
          </p>
        </Card>
      </div>
    </main>
  );
}
