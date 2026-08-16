Du arbeitest an der Expo Router / React Native App im Ordner `apps/ios`.

Ziel: Das Design einheitlicher, ruhiger und gleichzeitig etwas fröhlicher und hochwertiger machen. Keine großen Experimente. Bestehende Coral-Primary, Atmosphere und Enter-Animation beibehalten und konsequent durchziehen.

### Aktueller Stand
- Tokens: coral als Primary, verbesserte Atmosphere, Enter-Komponente vorhanden
- Komponenten: `src/components/ui.tsx`, `glass.tsx`, `motion.tsx`, `CircleCard.tsx`
- Screens: Entdecken, Kreise, Profil, Heute, Kreis-Detail

---

### Phase 1 – Einheitlichkeit herstellen

1. **Cards**
   - Alle wichtigen Listen- und Inhalts-Cards sollen die gleiche `Enter`-Animation und das gleiche Spacing nutzen.
   - Prüfe CircleCard, MeetupCard, FormatGuideCard, Empty States und stelle sicher, dass Padding, Radius und Schatten konsistent sind.

2. **Buttons**
   - Primary = coral, klar dominant.
   - Secondary und Ghost müssen visuell klar untergeordnet sein.
   - Gleiche Höhe, gleiche Border-Radius und gleiche Press-Animation überall.

3. **Typografie & Abstände**
   - Section-Titel, Kickers und Body-Texte sollen auf allen Haupt-Screens die gleichen Tokens und Abstände verwenden.
   - Keine willkürlichen fontSize oder margin-Werte mehr.

---

### Phase 2 – Empty States aufwerten

Besonders wichtig:
- Entdecken („Für heute genug“)
- Kreise (wenn leer)
- Profil-Bereiche ohne Inhalt

Jeder Empty State soll:
- Einen klaren, warmen Titel haben
- Einen kurzen, menschlichen Body-Text
- Optional einen dezenten Coral-Akzent (Kicker oder kleiner visueller Hinweis)
- Nicht mehr trocken und generisch wirken

---

### Phase 3 – Visuelle Hierarchie & Ruhe

- Primäre Aktionen (Dabei sein, Zusagen, Verlassen) müssen sofort ins Auge springen.
- Sekundäre Aktionen zurücknehmen.
- Auf den Haupt-Tabs (Heute, Entdecken, Kreise, Profil) für mehr Luft und klarere Abschnitte sorgen.
- Header und Tab-Bar sollen ruhig und konsistent wirken (keine wilden Abweichungen).

---

### Phase 4 – Leichte Delight-Momente (nur dezent)

- Beim erfolgreichen Beitreten zu einem Kreis ein kurzes positives Feedback (Text oder sehr dezente Animation).
- PressableScale und Haptics beibehalten und nur dort nachschärfen, wo es noch inkonsistent ist.

---

### Regeln
- Keine neuen großen Design-Systeme erfinden.
- Bestehende Tokens und Komponenten maximal wiederverwenden.
- Keine Breaking Changes an der Logik.
- Nach jeder Phase kurze Statusmeldung + relevante Diffs.
- Am Ende Auflistung der geänderten Dateien und was sich für den Nutzer spürbar verbessert hat.

Arbeite präzise und sequenziell.