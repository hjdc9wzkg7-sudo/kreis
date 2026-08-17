Du arbeitest an der Expo Router / React Native App im Ordner `apps/ios`.

Ziel: Komplettes Design-Upgrade auf Apple-Design-Award-Niveau.
Kern: liquid glass behalten, deutlich fluider, minimalistisch, aber mit klarem Wiedererkennungswert. Einheitlich, intuitiv, lebendig, nicht verwirrend.

### Design-Richtung
- Visuelle Identität: warmer, ruhiger Ritual-Raum (kleine Kreise, Nähe, Intention)
- Material: Liquid Glass als Hauptmaterial – gezielt einsetzen, nicht flächendeckend gleich
- Farbe: warmes Cream als Basis, ein klarer lebendiger Primary-Akzent (Coral/Peach-Linie), Sage nur sparsam
- Motion: durchgängiges Spring-System, flüssige Übergänge, spürbare aber elegante Micro-Interactions
- Typo & Spacing: klarer Rhythmus, mehr Luft, weniger Varianten
- UX: eine dominante Aktion pro Screen, klare Hierarchie, keine visuellen Konflikte

### Phase 1 – Design-System schärfen
- `src/theme/tokens.ts` überarbeiten (Farben, Spacing, Radius, Motion, Type)
- Atmosphere in `glass.tsx` verfeinern (Gradient, Orbs, Intensität)
- PressableScale / Enter in `motion.tsx` fluider und einheitlicher machen
- Button-, Card-, EmptyState- und Text-Komponenten in `ui.tsx` vereinheitlichen

### Phase 2 – Komponenten-Konsistenz
- CircleCard, MeetupCard, FormatGuideCard und weitere Cards auf ein gemeinsames System bringen
- Primary / Secondary / Ghost klar trennen
- Empty States auf allen wichtigen Screens (Entdecken, Kreise, Profil, Heute) aufwerten – warm, menschlich, nicht generisch

### Phase 3 – Screens angleichen
- Heute, Entdecken, Kreise, Profil, Kreis-Detail
- Einheitliche Abstände, Header-Wirkung, visuelle Hierarchie
- Dominante CTAs (Dabei sein, Zusagen, Verlassen) müssen sofort klar sein
- Tab-Bar und Header ruhig und konsistent

### Phase 4 – Fluidität & Delight
- Bessere Screen-Übergänge wo sinnvoll
- Spürbares Feedback bei Join, RSVP, Leave (Haptic + kurzes visuelles Feedback)
- Keine übertriebenen Animationen – hochwertig und zurückhaltend

### Phase 5 – UX-Klarheit
- Verwirrende oder doppelte visuelle Muster entfernen
- Lade-, Leer- und Fehlerzustände konsistent
- Bestehende Navigation und Auth nicht kaputt machen

### Regeln
- Liquid Glass beibehalten und verbessern
- Keine völlig neue App-Architektur
- Bestehende Tokens/Komponenten maximal schärfen statt parallel neue Systeme bauen
- Nach jeder Phase Status + relevante Diffs
- Am Ende: was sich für den Nutzer spürbar verändert hat

Arbeite präzise und sequenziell. Ziel ist Craft + Identität, nicht mehr Dekoration.