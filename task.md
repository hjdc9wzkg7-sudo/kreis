Du arbeitest an der Expo Router / React Native App im Ordner `apps/ios`.

Ziel: Die ersten sinnvollen Produkt-Features umsetzen, die den Kern der App (kleine, intentionale Kreise, Saisons, Rituale) spürbar stärken. Keine kosmetischen Spielereien. Bestehende Navigation, Design-System und State-Architektur beibehalten und erweitern.

### Kontext der App
- Kleine Kreise (4–8 Personen)
- Wiederkehrende Rituale / Saisons (2–4 Wochen)
- Fokus auf Einladung, RSVP und gemeinsame Termine
- Privacy-first, keine offenen DMs

---

### Phase 1 – Host-Tools stärken

- Wenn der aktuelle User Host eines Kreises ist, klar sichtbare Aktionen anbieten:
  - Nächsten Termin vorschlagen / festlegen (ScheduleNextCard ausbauen oder verbessern)
  - Übersicht, wer zugesagt hat
- Host-Status muss überall klar erkennbar sein.

### Phase 2 – RSVP & Treffen-Flow

- Zusage / Absage zu einem Treffen muss klar, schnell und mit Feedback funktionieren.
- Nach dem RSVP soll der User sofort sehen, was der aktuelle Stand ist (wer kommt).
- Edge-Cases abfangen (bereits zugesagt, Treffen vorbei, etc.).

### Phase 3 – Saison-Fortschritt spürbar machen

- SeasonBar und Saison-Informationen sollen dem User zeigen, wo die Gruppe in der aktuellen Saison steht.
- Kurzer, verständlicher Hinweis, was als Nächstes ansteht.

### Phase 4 – Profil & Intention

- User soll seine Intention / Präferenzen (Formate, Pace etc.) im Profil nachträglich anpassen können.
- Änderungen sollen sich auf zukünftige Vorschläge auswirken.

### Phase 5 – Kleine Qualitäts-Features

- Flash-Banner / Erfolgsmeldungen bei wichtigen Aktionen (Beitritt, RSVP, Termin gesetzt) konsistent nutzen.
- Sicherstellen, dass leere und Fehlerzustände weiterhin sauber sind.

---

### Regeln
- Bestehende Domain-Logik (`src/domain`), Store und Design-System maximal wiederverwenden.
- Keine neuen parallelen Navigationswege.
- Nach jeder Phase kurze Statusmeldung + relevante Diffs.
- Am Ende Auflistung der neuen/geänderten Features und was der User davon spürt.

Arbeite präzise und sequenziell. Priorisiere echten Nutzen vor Umfang.