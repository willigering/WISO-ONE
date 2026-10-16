# Validierung des ersten Vertical Slice

Stand: 15.10.2026. Umgebung: Windows, Node.js 24.21, npm 11.19; Next.js 16.4, React 19.3.

## Durchgeführt

- `npm install`: erfolgreich; npm meldet keine bekannten Paket-Sicherheitslücken.
- `npm run typecheck`: erfolgreich.
- `npm run build`: erfolgreicher Produktions-Build, Startseite statisch vorgerendert.
- `npm test`: 12 Tests bestanden. Notengrenzen einschließlich Dezimalwerten, vollständige und teilweise Antworten, Freitextausschluss, Datenintegrität, alle zehn Aufgabentypen, Empfehlungen und mehrseitige PDF-/KI-Exporte.
- Browserprüfung in Microsoft Edge: Desktop 1440×1000 und Mobil-Emulation 390×664. Jeweils Lernen, Persistenz, Training, Prüfungswiederaufnahme, Abgabe, Downloads, vollständige Beantwortung aller Aufgabentypen, Zeitablauf und Umgang mit beschädigtem Speicher geprüft.
- Sichtprüfung: Dashboard, Entscheidungsbaum, Prüfung und Auswertung auf Desktop und Mobil. Mobile Dekoration gegen Überschneidungen korrigiert. Matrix auf horizontales Überlaufen geprüft.
- PDF-Downloads mit und ohne Musterlösung erzeugt; Auswertungs-PDF mit Poppler gerendert und geprüft. Umbrüche, Branding, deutsche Umlaute und Seitenzahlen kontrolliert. Zuordnungszeilen sind auch bei leeren Antworten enthalten.
- Kein JavaScript-Laufzeitfehler in den überwachten Browserabläufen. Beide Exportvarianten und JSON-Download funktionieren.
- `.gitignore` für `.env*`, Schlüsseldateien, `.npmrc`, Build-, Abhängigkeits-, Test- und lokale Konfigurationsdateien geprüft; Projektquellen auf gängige Secret-Muster geprüft.

## Grenzen

- Die Browserprüfung nutzt Chromium/Edge einschließlich Mobil-Emulation; kein Test auf physischem iPhone oder in Safari/Firefox.
- Eigene Grundlagenprüfung mit 85 automatisch bewerteten und 15 offenen Freitextpunkten. Keine finale Gesamtnote ohne externe Freitextbewertung.
- Der Lernstand gehört zum jeweiligen Browser. Es gibt noch keinen Geräteabgleich und keine Mehrtab-Konfliktauflösung.
- Der Slice enthält genau zwei vollständige Themenmodule; der weitere fachliche Umfang ist in `curriculum.md` geplant.

Die generierten Testbilder, PDF-Dateien und Traces liegen ausschließlich im ignorierten Verzeichnis `test-results/`.

## Nutzerführung überarbeitet am 16.10.2026

- Einheitliche Navigation „Start · Lernen · Üben · Prüfung“ mit verständlichen Beschreibungen; auf schmalen Ansichten feste Navigation am unteren Rand.
- Konkreter erster Lernschritt vor den Kennzahlen, direkt beschriftete Einstiege und eine Schrittleiste zwischen Verstehen, Üben und Prüfen.
- Bedienhinweise für die interaktiven Lektionen und Aufgabentypen, Bestätigung beim Lektionsabschluss und klare nächste Aktionen.
- URL-Fragmente für Themen und Ansichten; Browser-Zurück sowie Neuladen bleiben in der gewählten Ansicht. Beim Nachlesen bleibt die aktuelle Trainingsantwort innerhalb der laufenden Anwendung erhalten.
- In der Prüfung führen „Nächste Aufgabe“ und zuletzt „Zur Abgabe“ durch die Bearbeitung.
- Produktions-Build und TypeScript erfolgreich; zwölf Logiktests sowie 14 Desktop-/Mobil-Browsertests bestanden, darunter direkte Einstiege, Zurück-Navigation und der Wechsel zwischen Nachlesen und Üben.
