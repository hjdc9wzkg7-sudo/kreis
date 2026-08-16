Du bist ein erfahrener Full-Stack- und Mobile-Entwickler + UX-Spezialist. Du arbeitest direkt am bestehenden Code dieser App (Profil, Kreise, Entdecken, Einladungen, Join/Leave). 

Zuerst analysierst du den aktuellen Tech-Stack, die Navigations-Bibliothek (React Navigation / Expo Router / Flutter Navigator / etc.), den State-Management-Ansatz und die bestehende Screen-Struktur. Arbeite ausschließlich auf Basis des realen Codes – keine Annahmen.

### Phase 1 – Konkrete UX- und Navigations-Bugs sofort beheben

1. **Back-Navigation von Kreis-Detail**
   - Aktuelles Verhalten: Profil → Kreis antippen → Zurück → landet auf Kreise-Liste statt zurück auf Profil.
   - Gewünschtes Verhalten: Der Back-Stack muss korrekt sein. Von Profil in einen Kreis und zurück muss wieder auf dem Profil landen (nicht auf der globalen Kreise-Übersicht).
   - Prüfe und korrigiere die Navigation-History / `navigation.goBack()` / `router.back()` / Stack-Parameter. Stelle sicher, dass der Ursprungs-Screen korrekt übergeben und wiederhergestellt wird.

2. **„Kreis verlassen“ ist zu versteckt**
   - Aktuell liegt die Aktion unter „Info“ und ist schwer auffindbar.
   - Mache „Kreis verlassen“ deutlich sichtbarer und zugänglicher (z. B. eigener Button oder klarer Eintrag im Kreis-Menü / Overflow-Menü / Settings-Bereich des Kreises). 
   - Füge eine Bestätigungs-Dialog hinzu (mit klarem Hinweis auf die Konsequenzen).

3. **Button-Anordnung auf dem Entdecken-Screen**
   - Aktuell: Links „Andere Einladung“, Rechts „Dabei sein“ (farbig hervorgehoben).
   - Ändere die Reihenfolge und Semantik so, dass die primäre positive Aktion („Dabei sein“ / „Mitmachen“) links steht und die sekundäre / ablehnende Aktion („Ablehnen“ / „Andere Einladung“) rechts.
   - Stelle sicher, dass die visuelle Hierarchie (Farbe, Gewicht, Position) klar die primäre Aktion kommuniziert und konsistent mit dem Rest der App ist.

Nach jedem Fix: Kurzer Diff + kurze Erklärung warum die Änderung korrekt ist. Danach manuell den Flow testen (gedanklich + über den Code).

### Phase 2 – Vollständige Code- und App-Audit

Nachdem die drei Punkte oben behoben sind, führe eine systematische, vollständige Prüfung der gesamten App und des Codes durch:

- Funktionalität: Jeder User-Flow (Profil, Kreise erstellen/beitreten/verlassen, Entdecken, Einladungen, Join/Decline, Back-Navigation überall)
- Redundanzen (doppelte Komponenten, doppelte Logik, unnötige State-Kopien)
- Bugs, Edge-Cases, Race-Conditions, fehlende Error-Handling
- Inkonsistenzen (Namensgebung, Spacing, Farben, Typography, Button-Styles, Loading-States, Empty-States)
- Verwirrende UX / unklare Hierarchien / versteckte Aktionen
- Performance (unnötige Re-Renders, schwere Listen, fehlende Memoization)
- Accessibility (Labels, Kontrast, Touch-Targets)
- Code-Qualität (DRY, Trennung von Concerns, Typisierung, Dead Code)
- Sicherheit relevante Stellen (Einladungs-Links, Berechtigungen in Kreisen)

Liste alle gefundenen Probleme priorisiert (Critical / High / Medium / Low) und behebe die Critical + High Probleme direkt.

### Phase 3 – Nächste logische Schritte & Feature-Umsetzung

Nach Abschluss von Phase 1 + 2:

1. Analysiere den aktuellen Stand der App und leite die logisch nächsten Features und Verbesserungen ab (User-Value × Aufwand × technische Schuld).
2. Priorisiere klar (Top 3–5 nächste Maßnahmen).
3. Setze die höchsten Prioritäten direkt um (Code + UI + Logik).
4. Dokumentiere kurz, warum genau diese Reihenfolge sinnvoll ist.

Arbeite strikt sequenziell. Nach jeder Phase kurze Statusmeldung was erledigt wurde und was als nächstes kommt. Keine unnötigen Erklärungen, nur konkrete Änderungen und Begründungen.
