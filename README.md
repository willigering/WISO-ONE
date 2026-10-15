# WISO//ONE

**Wirtschaft verstehen. Prüfung bestehen.** Ein interaktiver, lokal speichernder Lernraum für die WISO-Vorbereitung von Fachinformatikern und Umschülern. Next.js, React und TypeScript; dunkle matte Oberflächen, warme Amber-Akzente und lokal ausgelieferte variable Schriften.

## Funktionsumfang

- Dashboard mit echten Lerndaten, SVG-Ring, Lernverlauf, zuletzt bearbeiteten Aufgaben und adaptiver Empfehlung. Ohne Trainingsdaten wird keine Quote erfunden.
- **Marktformen:** vollständige 3×3-Matrix, Hover-/Fokus-Vorschau, ausgewählte Mini-Lektion, IT-nahe Modellbeispiele und Mini-Aufgabe.
- **Kaufmannseigenschaft:** interaktiver Entscheidungsbaum einschließlich Kapitalgesellschaften, OHG/KG, Istkaufmann, Kannkaufmann, freien Berufen sowie Land- und Forstwirtschaft.
- 15 Trainingsaufgaben mit unmittelbarem Feedback und selbst eingeschätzter Antwortsicherheit.
- Eine eigene Grundlagenprüfung: 20 Aufgaben, 30 Minuten, 100 Punkte. Zehn Aufgabentypen: Single-/Multiple-Choice, Richtig/Falsch, kurzer/langer Freitext, Zuordnung, Reihenfolge, Drag-and-drop mit Tastaturalternative, Tabelle, Fallstudie.
- Aufgabenübersicht, Markierungen, Rücksprünge, Abgabebestätigung, automatische Abgabe bei Zeitablauf, Wiederaufnahme nach Neuladen.
- Deterministische Bewertung geschlossener Aufgaben, Themen-/Fehleranalyse und zentral konfigurierbarer IHK-naher Notenschlüssel.
- Echte mehrseitige PDF-Downloads mit oder ohne Musterlösungen; Name optional. Separater JSON-/Zwischenablageexport ausschließlich für die externe Freitextbewertung.
- Lokaler Lernfortschritt und Prüfungshistorie. Keine Accounts, keine Cloud, keine API-Keys und keine Übertragung von Antworten an KI-Dienste.

## Setup und Start

Node.js **22.12+** (getestet mit Node 24), npm und Git verwenden.

```bash
git clone https://github.com/willigering/WISO-ONE.git
cd WISO-ONE
npm install
npm run dev
```

Die Anwendung ist unter `http://localhost:3000` erreichbar. Es sind keine `.env`-Dateien oder lokalen Konfigurationen erforderlich.

```bash
npm run typecheck
npm test
npm run build
npm start
```

## Browserprüfung

Die End-to-End-Tests laufen gegen den Produktionsserver und prüfen Desktop (1440 px) und Mobil (390 px), Navigation, Matrix, Entscheidungsbaum, persistente Lerndaten, Prüfungswiederaufnahme, verdeckte Lösungen, Abgabe, Downloads und abgelaufene Prüfungen. Screenshots und Exporte liegen im ignorierten Verzeichnis `test-results/`.

```bash
# Edge ist auf dem Entwicklungsrechner bereits vorhanden.
# Auf anderen Rechnern einmalig installieren:
npx playwright install msedge
npm run build
npm run test:e2e
```

## Architektur

```text
src/
  app/              # Next-App-Router, Metadaten, lokale Schriften, Designsystem
  components/       # Anwendungsschale, Dashboard, barrierearme Aufgabeneingaben
  content/          # Strukturierte Lernmodule, Entscheidungsbaum, Aufgaben, Prüfung
  features/         # Lernen, Training, Prüfung, Analyse, PDF-/KI-Export
  lib/              # Deterministische Bewertung und austauschbares Speicher-Repository
  types/            # Inhalts-, Antwort-, Lernstands- und Prüfungstypen
tests/
  grading.test.ts   # Grenzwerte, Bewertungsregeln, Datenintegrität, Exporte
  e2e/              # Produktionsnahe Browserabläufe
docs/
  curriculum.md     # Geplanter weiterer Themenumfang und Quellenpflege
```

Der Slice verwendet bewusst CSS-Designvariablen und eigene SVGs statt einer zusätzlichen CSS- oder Chart-Laufzeit. Fachinhalte liegen in `src/content`, nicht in den Ansichts-Komponenten. `ProgressRepository` kapselt den Browser-Speicher und kann später durch einen Backendadapter ersetzt werden. PDF-Code wird erst beim Export dynamisch geladen.

### Content-Struktur

- `topics.ts`: Lernmodule, neun Marktformen, Entscheidungsbaum und amtliche Quellenlinks.
- `questions.ts`: Aufgaben mit ID, Thema, Schwierigkeit, Typ, Aufgabenstellung, Optionen, Lösung, Erklärung, Punkten und Tags. Freitext enthält zusätzlich Kernbegriffe und punktgewichtete Kriterien.
- `exams.ts`: Prüfungsdefinition und Notengrenzen.

### Eine Frage ergänzen

In `questions.ts` einen `Question`-Datensatz mit eindeutiger ID ergänzen. `options` enthält bei Auswahlaufgaben die möglichen Antworten, `rows` bei Zuordnungen die Zeilen. `solution` ist je nach Typ ein String, eine Liste oder ein Zeile-Antwort-Objekt. Bei Freitext müssen die Punkte der `gradingRubric` genau die maximale Punktzahl ergeben. Fachquelle und Abrufdatum dokumentieren; selbst formulierte Beispiele verwenden. Für zusätzliche Trainingsaufgaben `trainingQuestions` explizit erweitern.

### Eine Prüfung ergänzen

Der erste Slice verwendet genau eine versionierte Prüfung `wiso-grundlagen-v1`. Für eine weitere Prüfung eine Definition mit eigener ID, Dauer und Aufgaben-IDs ergänzen und die Auswahl mit einer Prüfungssammlung verbinden. Dabei `evaluate`, die Fragenauflösung in `Exam`, den PDF-Export und die Speicherprüfung auf die jeweilige Definition umstellen. Bestehende Aufgaben-IDs oder Lösungen einer bereits veröffentlichten Prüfung nicht rückwirkend verändern; neue Versionen anlegen. Bereits abgelegte Prüfungen werden derzeit mit dem unveränderten v1-Aufgabensatz ausgewertet.

## Bewertung und Aussagekraft

Der vorgegebene Schlüssel ist zentral: ab 92 % Note 1, ab 81 % Note 2, ab 67 % Note 3, ab 50 % Note 4, ab 30 % Note 5, darunter Note 6. Dezimalwerte werden vor der Notenzuordnung nicht aufgerundet.

- Single-/Multiple-Choice, Richtig/Falsch und Reihenfolgen: vollständig richtige Antwort = volle Punkte, andernfalls 0.
- Zuordnung/Drag-and-drop/Tabellen: proportionale Punkte pro richtiger Zeile, auf zwei Dezimalstellen gerundet.
- **Freitext wird niemals automatisch benotet**, auch nicht anhand bloßer Schlüsselwortsuche. 85 Punkte sind geschlossen, 15 Punkte bleiben zur externen Bewertung offen. Angezeigt werden gesicherte Punkte, vorläufige Mindestnote und bestmögliche Note. Es wird keine endgültige Gesamtnote behauptet.
- Das KI-Paket enthält nur die drei offenen Aufgaben samt Antwort, Kriterien, Kernbegriffen und Musterlösung. Der Nutzer entscheidet selbst über eine Weitergabe. Eine automatische Rückübernahme fremder Bewertungen ist nicht Teil des Slice.
- „Prüfungssicherheit“ ist eine Orientierung aus den letzten 20 geschlossenen Antworten pro Thema, keine statistische Bestehensprognose. Unbekannte Themen werden zuerst empfohlen, danach das Thema mit der niedrigsten Quote.
- Eigene Übungsprüfung; keine offizielle IHK-Prüfung oder Zertifizierung.

## Speicherung

`localStorage`, Schlüssel `wiso-one.progress.v1`, speichert abgeschlossene Lektionen, bis zu 2.000 geschlossene Antwortversuche einschließlich Sicherheit, Prüfungsverlauf, Antworten, Markierungen und Zeitstempel. Der Timer verwendet eine absolute Deadline und läuft beim Verlassen der Seite weiter. Beim nächsten Öffnen wird eine abgelaufene Prüfung abgegeben. Löschen von Browserdaten entfernt den Fortschritt. Für konsistente Daten nur einen aktiven Tab verwenden.

Fehler beim Lesen oder Schreiben werden sichtbar gemeldet. Ein beschädigter gespeicherter Lernstand wird nicht stillschweigend überschrieben. Lernfortschritt kann bei deaktiviertem Browserspeicher nicht dauerhaft gesichert werden. Ein späterer Backendadapter sollte Mehrgeräteabgleich, Prüfungsversionen und Konfliktbehandlung übernehmen.

## Inhaltliche Grundlage und Erweiterungen

Übergeben wurde die Produktspezifikation, keine zusätzliche WISO-Unterlagensammlung. Deshalb sind die Inhalte dieses Slice neu formulierte Grundlagen mit amtlichen HGB-/GmbHG-/AktG-Quellen. Rechtsstandprüfung: 14./15.10.2026. Marktbeispiele sind ausdrücklich vereinfachte Modellfälle.

Der weitere Themenplan steht in [docs/curriculum.md](docs/curriculum.md). Geplant sind insbesondere Rechtsgeschäfte, Geschäftsfähigkeit, Kaufverträge, Rechtsformen und Märkte. Sie werden erst nach fachlicher Prüfung als vollständige Module ergänzt; es gibt keine inaktiven Themenkacheln im Produkt.

## Git und Datenschutz

Bestehendes Repository: `willigering/WISO-ONE`, Branch `main`. Keine zusätzlichen Remotes. `.gitignore` schließt Abhängigkeiten, Build-Ausgaben, Testartefakte, `.env*`, Schlüsseldateien, npm-Konfiguration und lokale Editor-/Agentenkonfiguration aus. Schriften werden lokal ausgeliefert. Der Browser-Client benötigt keine Secrets.
