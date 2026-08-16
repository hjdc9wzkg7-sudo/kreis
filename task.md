Du arbeitest an der Expo Router / React Native App im Ordner `apps/ios`.

Ziel: Polishing und kleine UX-Details. Die App soll sich fertiger, ruhiger und professioneller anfühlen. Keine großen Feature- oder Design-Experimente.

### Fokus-Bereiche

**1. Header**
- Einheitliche Header-Behandlung auf allen Haupt-Screens und im Kreis-Detail
- Zurück-Button, Titel und eventuelle Aktionen klar und konsistent
- Keine springenden Layouts oder unterschiedlichen Abstände

**2. Tab-Bar**
- Aktiver Tab klar erkennbar
- Icons und Labels ruhig und konsistent
- Gutes Verhalten beim Scrollen (minimizeBehavior prüfen und ggf. nachschärfen)

**3. Loading-States**
- Wo Daten geladen oder State hydriert wird: dezente, konsistente Loading-Hinweise
- Kein leerer Bildschirm während der Hydration

**4. Error- und Edge-States**
- Fehlende Kreise, fehlgeschlagene Aktionen oder ungültige IDs sauber abfangen
- Klare, ruhige Fehlermeldungen statt Crash oder leerer Screen

**5. Mikro-Interaktionen**
- Press-States und Haptics auf allen wichtigen Buttons einheitlich
- Keine toten Flächen, die sich nicht interaktiv anfühlen
- Scroll-Verhalten und Safe-Area-Abstände prüfen und vereinheitlichen

**6. Kleine Text- und Hierarchie-Details**
- Überall konsistente Verwendung von Display, Title, Body, Kicker
- Keine willkürlichen fontSizes oder margins mehr

---

### Regeln
- Bestehende Design-Tokens und Komponenten wiederverwenden
- Keine neuen großen Features
- Navigation und bestehende Logik nicht kaputt machen
- Nach jedem Bereich kurze Statusmeldung + relevante Diffs
- Am Ende Liste der geänderten Dateien und was sich spürbar verbessert hat

Arbeite präzise und sequenziell.