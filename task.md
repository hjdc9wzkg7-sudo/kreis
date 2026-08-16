Du arbeitest an der Expo Router / React Native iOS-App im Ordner `apps/ios`.

Ziel dieser Session: Das Design spürbar fröhlicher, lebendiger und hochwertiger machen, ohne die ruhige, erwachsene Grundstimmung zu zerstören. Die App soll näher an Apple-Design-Award-Niveau kommen (Liquid Glass + Delight + klare Persönlichkeit).

### Aktueller Stand (bereits vorhanden)
- `src/theme/tokens.ts` → cream / clay / sage Palette
- `src/components/glass.tsx` → Atmosphere mit DriftOrbs + GlassSurface (Liquid Glass)
- `src/components/motion.tsx` → PressableScale
- `src/components/ui.tsx` → Button, Card, Chip usw.
- CircleCard und die meisten Screens nutzen Atmosphere + Glass

### Was du umsetzen sollst (in dieser Reihenfolge)

**1. Tokens & Farbe aufwerten**
- Mache `clay` etwas satter und wärmer.
- Füge einen klaren fröhlichen Akzent hinzu (z. B. `coral` oder `peach` – warm, einladend, nicht grell).
- Passe Primary-Button-Farben und wichtige CTAs an den neuen Akzent an.
- Atmosphere-Gradient und die beiden DriftOrbs sollen spürbar lebendiger und farbiger werden (weniger Grau, mehr Wärme und Frische).
- Behalte die generelle Wärme und Premium-Wirkung bei. Kein Regenbogen.

**2. Atmosphere verbessern**
- In `glass.tsx` die Orb-Farben und den Gradient an die neuen Tokens anpassen.
- Die Drift-Bewegung darf etwas präsenter, aber weiterhin elegant und langsam sein.
- Stelle sicher, dass Reduce Motion weiterhin korrekt greift.

**3. Motion & Delight**
- Cards und wichtige Listen-Elemente sollen einen leichten, eleganten Entrance bekommen (Fade + kleiner Y-Offset oder Scale, mit Reanimated).
- PressableScale etwas spielerischer machen (leichter Overshoot erlaubt, aber nicht übertrieben).
- Primary Buttons sollen beim Press klarer und befriedigender reagieren (Haptics + Animation).

**4. Visuelle Hierarchie**
- „Dabei sein“ und andere primäre Aktionen müssen farblich und visuell klar dominieren.
- Secondary/Ghost Buttons bleiben zurückhaltend.
- Empty States (besonders auf Entdecken) sollen mehr Persönlichkeit bekommen – nicht nur trockener Text.

**5. Qualitätssicherung**
- Alle Änderungen müssen mit dem bestehenden Liquid-Glass-System und den aktuellen Komponenten funktionieren.
- Keine Breaking Changes an der Logik.
- Nach den Änderungen kurz auflisten, welche Dateien du geändert hast und warum.

Arbeite strikt sequenziell. Zeige nach jedem größeren Schritt die relevanten Diffs. Am Ende eine kurze Zusammenfassung der Design-Entscheidung.