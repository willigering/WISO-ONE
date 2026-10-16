'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CornerDownRight, RotateCcw } from 'lucide-react';
import { decisions, markets, sources, topics } from '../content/topics';
import type { TopicId } from '../types';

export function Learning({
  initialTopic,
  onTopicChange,
  completed,
  onComplete,
  onTrain,
  onExam,
}: {
  initialTopic: TopicId;
  onTopicChange: (id: TopicId) => void;
  completed: Record<string, number>;
  onComplete: (id: string) => void;
  onTrain: (id: TopicId) => void;
  onExam: () => void;
}) {
  const topic = initialTopic;
  const [selected, setSelected] = useState(8);
  const [preview, setPreview] = useState<number | null>(null);
  const [mini, setMini] = useState<string | null>(null);
  const [history, setHistory] = useState(['start']);
  const [treeAnswer, setTreeAnswer] = useState<string | null>(null);
  const node = decisions[history[history.length - 1]];
  const current = topics.find((t) => t.id === topic)!;
  const market = markets[preview ?? selected];
  return (
    <section className="page-enter">
      <div className="eyebrow">DEIN LERNRAUM</div>
      <h1>Lernen mit Beispielen.</h1>
      <p className="lede">Wähle ein Thema. Erkunde das Beispiel und löse danach die kurze Übung.</p>
      <div className="tabs" aria-label="Lernmodule">
        {topics.map((t) => (
          <button
            key={t.id}
            aria-pressed={topic === t.id}
            className={topic === t.id ? 'active' : ''}
            onClick={() => onTopicChange(t.id)}
          >
            {t.title}
            {completed[t.id] && <Check size={15} />}
          </button>
        ))}
      </div>
      <div className="lesson-heading">
        <div>
          <div className="eyebrow">
            {current.category} <span> / </span> {current.minutes} MINUTEN
          </div>
          <h2>{current.title}</h2>
        </div>
        <span className="pill">01 — Verstehen</span>
      </div>
      <div className="lesson-guide">
        <div>
          <span className="eyebrow">SO FUNKTIONIERT DIESE LEKTION</span>
          <h3>
            {topic === 'marktformen'
              ? 'Klicke eine Marktform in der Tabelle an.'
              : 'Beantworte die Fragen zum Unternehmen.'}
          </h3>
          <p>
            {topic === 'marktformen'
              ? 'Links zählt die Zahl der Anbieter (Verkäufer), oben die Zahl der Nachfrager (Käufer). Zu jedem Feld siehst du eine Erklärung und ein Beispiel. Scrolle danach zur Mini-Aufgabe.'
              : 'Wähle die passende Antwort im Entscheidungsbaum. Er führt dich Schritt für Schritt zur Kaufmannsart. Du kannst jederzeit einen Schritt zurückgehen.'}
          </p>
        </div>
        <details>
          <summary>Das lernst du hier</summary>
          <ul>
            {current.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </details>
      </div>
      {topic === 'marktformen' ? (
        <>
          <p className="intro">
            Zwei Fragen. Neun Marktformen. Wähle eine Kombination und entdecke, wie Angebot und
            Nachfrage zusammenspielen.
          </p>
          <div className="market-layout">
            <div className="matrix-wrap">
              <div className="axis-top">
                NACHFRAGER <ArrowRight size={14} />
              </div>
              <div className="matrix">
                <span className="axis-corner">ANBIETER ↓</span>
                {['Einer', 'Wenige', 'Viele'].map((v) => (
                  <span className="matrix-label" key={v}>
                    {v}
                  </span>
                ))}
                {['Einer', 'Wenige', 'Viele'].map((label, row) => (
                  <div className="matrix-row" key={label}>
                    <span className="matrix-label row-label">{label}</span>
                    {markets.slice(row * 3, row * 3 + 3).map((m, col) => {
                      const index = row * 3 + col;
                      return (
                        <button
                          key={m.name}
                          className={`matrix-cell ${selected === index ? 'selected' : ''}`}
                          aria-pressed={selected === index}
                          onMouseEnter={() => setPreview(index)}
                          onMouseLeave={() => setPreview(null)}
                          onFocus={() => setPreview(index)}
                          onBlur={() => setPreview(null)}
                          onClick={() => {
                            setSelected(index);
                            setPreview(null);
                            setMini(null);
                          }}
                        >
                          <span className="cell-dots">
                            {Array.from({ length: row === 0 ? 1 : row === 1 ? 3 : 6 }, (_, n) => (
                              <i key={n} />
                            ))}
                          </span>
                          <span>{m.name}</span>
                          <ArrowRight size={14} />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="caption">Die Beispiele sind bewusst abgegrenzte Modellmärkte.</p>
            </div>
            <aside className="market-detail">
              <span className="eyebrow">MARKT IM FOKUS</span>
              <div className="big-number">
                0{(preview ?? selected) + 1}
                <span>/ 09</span>
              </div>
              <h3>{market.name}</h3>
              <p>{market.short}</p>
              <div className="example">
                <span className="eyebrow">AUS DER PRAXIS</span>
                <p>{market.example}</p>
              </div>
              <p className="muted">{market.insight}</p>
            </aside>
          </div>
          <div className="practice-strip">
            <div>
              <span className="eyebrow">02 — ANWENDEN</span>
              <h3>Ein kurzer Perspektivwechsel.</h3>
              <p>Welche Kombination gehört zum {markets[selected].name}?</p>
            </div>
            <div className="mini-choices">
              {[
                ...new Set([
                  `${markets[selected].suppliers} / ${markets[selected].buyers}`,
                  'viele / einer',
                  'einer / viele',
                  'wenige / wenige',
                ]),
              ]
                .sort()
                .map((option) => (
                  <button
                    className={`button secondary ${mini === option ? 'chosen' : ''}`}
                    key={option}
                    onClick={() => setMini(option)}
                  >
                    {option}
                  </button>
                ))}
              <span className="caption">Anbieter / Nachfrager</span>
              {mini && (
                <p
                  role="status"
                  className={
                    mini === `${markets[selected].suppliers} / ${markets[selected].buyers}`
                      ? 'success'
                      : 'error'
                  }
                >
                  {mini === `${markets[selected].suppliers} / ${markets[selected].buyers}`
                    ? 'Richtig. Du hast die Struktur erkannt.'
                    : 'Noch nicht. Lies die beiden Achsen erneut.'}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="intro">
            Nicht jeder Unternehmer ist Kaufmann. Folge den Merkmalen des Betriebs und finde die
            passende Einordnung.
          </p>
          <div className="decision-layout">
            <div className="decision-path">
              <span className="eyebrow">DEIN ENTSCHEIDUNGSWEG</span>
              {history.map((step, i) => (
                <div key={`${step}-${i}`}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p>{decisions[step].title}</p>
                </div>
              ))}
              <button
                className="text-button"
                onClick={() => {
                  setHistory(['start']);
                  setTreeAnswer(null);
                }}
              >
                <RotateCcw size={14} /> Neu beginnen
              </button>
            </div>
            <div className="decision-panel">
              <span className="pill">
                {node.result ? 'Deine Einordnung' : `Entscheidung ${history.length}`}
              </span>
              <h3>{node.result || node.title}</h3>
              <p>{node.body}</p>
              {node.choices && (
                <div className="decision-options">
                  {node.choices.map((c) => (
                    <button
                      className="choice"
                      key={c.next}
                      onClick={() => setHistory([...history, c.next])}
                    >
                      {c.label}
                      <ArrowRight size={18} />
                    </button>
                  ))}
                </div>
              )}
              {node.source && <p className="source-note">Rechtsgrundlage: {node.source}</p>}
              {history.length > 1 && (
                <button className="text-button" onClick={() => setHistory(history.slice(0, -1))}>
                  <ArrowLeft size={14} /> Einen Schritt zurück
                </button>
              )}
            </div>
          </div>
          <div className="practice-strip">
            <div>
              <span className="eyebrow">02 — ANWENDEN</span>
              <h3>Kleines Gewerbe. Freiwilliger Eintrag.</h3>
              <p>
                Ein kleiner PC-Service ohne kaufmännischen Organisationsbedarf lässt sich freiwillig
                ins Handelsregister eintragen. Welche Kaufmannsart liegt vor?
              </p>
            </div>
            <div className="mini-choices">
              {['Istkaufmann', 'Kannkaufmann', 'Formkaufmann'].map((v) => (
                <button
                  className={`button secondary ${treeAnswer === v ? 'chosen' : ''}`}
                  key={v}
                  onClick={() => setTreeAnswer(v)}
                >
                  {v}
                </button>
              ))}
              {treeAnswer && (
                <p role="status" className={treeAnswer === 'Kannkaufmann' ? 'success' : 'error'}>
                  {treeAnswer === 'Kannkaufmann'
                    ? 'Richtig. Die Eintragung wirkt konstitutiv (§ 2 HGB).'
                    : 'Prüfe die freiwillige Eintragung des Kleingewerbes nach § 2 HGB.'}
                </p>
              )}
            </div>
          </div>
          <details className="sources">
            <summary>Quellen & fachliche Einordnung</summary>
            <p>
              Geprüft am 14.10.2026. Grundlagenpfad für die angegebenen Fälle; Sonderfälle wie § 5
              HGB oder Scheinkaufmann sind nicht Teil dieses Moduls.
            </p>
            {sources.map(([label, url]) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ))}
          </details>
        </>
      )}
      <div className="lesson-footer">
        {completed[topic] && (
          <p className="completion-message" role="status">
            <Check size={17} />
            Gespeichert. Übe jetzt mit Aufgaben zu diesem Thema.
          </p>
        )}
        <button
          className="button secondary"
          disabled={!!completed[topic]}
          onClick={() => onComplete(topic)}
        >
          <Check size={16} />
          {completed[topic] ? 'Lektion abgeschlossen' : 'Lektion abschließen'}
        </button>
        <button className="button primary" onClick={() => onTrain(topic)}>
          Aufgaben zu diesem Thema üben <ArrowRight size={16} />
        </button>
        <button className="text-button" onClick={onExam}>
          <CornerDownRight size={16} /> Zur Prüfungsübersicht
        </button>
      </div>
    </section>
  );
}
