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
