Du arbeitest an der Expo Router / React Native App im Ordner `apps/ios`.

Ziel: Design-Feinschliff. Die App soll einheitlicher, ruhiger und etwas freudiger wirken — ohne die bestehende Coral-Primary, Atmosphere und Enter-Animationen zu zerstören.

### Aktueller Stand
- Navigation und Back-Verhalten sind behoben
- Coral als Primary, Enter-Komponente und verbesserte Atmosphere vorhanden
- Entdecken-Empty-State ist bereits aufgewertet
- „Kreis verlassen“ ist sichtbar

---

### Phase 1 – Restliche Empty States

Verbessere die Empty States auf:
- Kreise-Tab (wenn keine Kreise vorhanden)
- Profil (leere Bereiche)
- Heute / Index (falls leer)

Jeder Empty State braucht:
- Einen kurzen, warmen Kicker (gerne mit Coral)
- Klaren Titel
- Menschlichen, nicht generischen Body-Text
- Konsistentes Spacing und die gleiche visuelle Sprache wie der Entdecken-Empty-State

---

### Phase 2 – Einheitlichkeit

1. Alle Cards (CircleCard, MeetupCard, FormatGuideCard, etc.) sollen gleiches Padding, gleichen Radius und die gleiche Enter-Animation nutzen.
2. Primary-, Secondary- und Ghost-Buttons müssen überall identisch wirken (Höhe, Radius, Press-Verhalten).
3. Section-Titel, Kickers und Abstände auf den Haupt-Tabs vereinheitlichen.
4. Header und Tab-Inhalte sollen visuell ruhiger und konsistenter werden.

---

### Phase 3 – Dezente Delight-Momente

- Beim erfolgreichen Beitreten zu einem Kreis ein kurzes, positives Feedback (Text oder sehr dezente Animation/Haptic).
- Beim Verlassen eines Kreises ebenfalls klares, ruhiges Feedback.
- Keine übertriebenen Animationen. Nur spürbare, hochwertige Momente.

---

### Regeln
- Bestehende Tokens und Komponenten maximal wiederverwenden.
- Keine neuen großen Design-Systeme.
- Keine Logik-Änderungen außer dem Nötigsten für Feedback.
- Nach jeder Phase kurze Statusmeldung + relevante Diffs.
- Am Ende Auflistung der geänderten Dateien und was sich für den Nutzer spürbar verbessert.

Arbeite präzise und sequenziell.