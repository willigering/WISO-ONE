'use client';
import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { trainingQuestions } from '../content/questions';
import { AnswerInput } from '../components/AnswerInput';
import { answered, answerText, isOpen, score } from '../lib/grading';
import type { Answer, Attempt, TopicId } from '../types';

export function Training({
  initialTopic,
  onAttempt,
}: {
  initialTopic: TopicId | 'all';
  onAttempt: (a: Attempt) => void;
}) {
  const [filter, setFilter] = useState<TopicId | 'all'>(initialTopic);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState<Answer>();
  const [checked, setChecked] = useState(false);
  const [confidence, setConfidence] = useState(2);
  const [finished, setFinished] = useState(false);
  const items = trainingQuestions.filter((q) => filter === 'all' || q.topic === filter);
  const q = items[index];
  const reset = () => {
    setValue(undefined);
    setChecked(false);
    setConfidence(2);
  };
  const earned = score(q, value);
  if (finished)
    return (
      <section className="finish-training page-enter">
        <span className="eyebrow">TRAINING ABGESCHLOSSEN</span>
        <h1>Ein Stück sicherer.</h1>
        <p className="lede">
          Du hast {items.length} Aufgaben bearbeitet. Deine geschlossenen Antworten sind in deinem
          Lernprofil gespeichert. Freitext bleibt zur eigenen Reflexion.
        </p>
        <button
          className="button primary"
          onClick={() => {
            setIndex(0);
            setFinished(false);
            reset();
          }}
        >
          <RotateCcw size={16} /> Neue Trainingsrunde
        </button>
      </section>
    );
  return (
    <section className="page-enter">
      <div className="eyebrow">WISSEN WIRD KÖNNEN</div>
      <h1>Dein Trainingsraum.</h1>
      <p className="lede">Ausprobieren. Verstehen. Beim nächsten Mal wissen.</p>
      <div className="tabs">
        {(['all', 'marktformen', 'kaufmann'] as const).map((t) => (
          <button
            aria-pressed={filter === t}
            key={t}
            className={filter === t ? 'active' : ''}
            onClick={() => {
              setFilter(t);
              setIndex(0);
              reset();
            }}
          >
            {t === 'all'
              ? 'Alle 15 Aufgaben'
              : t === 'marktformen'
                ? 'Marktformen'
                : 'Kaufmannseigenschaft'}
          </button>
        ))}
      </div>
      <div className="training-layout">
        <article className="question-panel">
          <div className="question-meta">
            <span className="eyebrow">
              AUFGABE {String(index + 1).padStart(2, '0')} <span>/ {items.length}</span>
            </span>
            <span className="pill">
              {q.difficulty === 'ihk'
                ? 'Prüfungsniveau'
                : q.difficulty === 'easy'
                  ? 'Einstieg'
                  : 'Vertiefung'}{' '}
              · {q.points} Punkte
            </span>
          </div>
          <h2>{q.question}</h2>
          <AnswerInput q={q} value={value} onChange={setValue} disabled={checked} />
          {!checked && (
            <>
              <fieldset className="confidence">
                <legend>Wie sicher bist du?</legend>
                {['Unsicher', 'Ziemlich sicher', 'Sehr sicher'].map((v, i) => (
                  <label key={v}>
                    <input
                      type="radio"
                      name="confidence"
                      checked={confidence === i + 1}
                      onChange={() => setConfidence(i + 1)}
                    />
                    {v}
                  </label>
                ))}
              </fieldset>
              <button
                className="button primary"
                disabled={!answered(value)}
                onClick={() => {
                  setChecked(true);
                  if (!isOpen(q))
                    onAttempt({
                      questionId: q.id,
                      topic: q.topic,
                      earned: earned ?? 0,
                      max: q.points,
                      confidence,
                      at: Date.now(),
                    });
                }}
              >
                {isOpen(q) ? 'Mit Musterlösung vergleichen' : 'Antwort prüfen'}
                <ArrowRight size={16} />
              </button>
            </>
          )}
          {checked && (
            <div className="feedback" role="status">
              <span
                className={`eyebrow ${earned === null ? '' : earned === q.points ? 'success' : 'error'}`}
              >
                {earned === null
                  ? 'SELBSTREFLEXION · KEINE AUTOMATISCHE BEWERTUNG'
                  : `${earned} / ${q.points} PUNKTE`}
              </span>
              <h3>
                {earned === null
                  ? 'Vergleiche deinen Gedankengang.'
                  : earned === q.points
                    ? 'Richtig eingeordnet.'
                    : 'Hier steckt dein nächster Lernschritt.'}
              </h3>
              <p>{q.explanation}</p>
              <div className="solution">
                <strong>Musterlösung</strong>
                <p className="preserve-lines">{answerText(q.solution)}</p>
                {q.gradingRubric?.map((r) => (
                  <p key={r.criterion}>
                    {r.criterion} · {r.points} Punkte
                  </p>
                ))}
              </div>
              <button
                className="button primary"
                onClick={() => {
                  if (index + 1 === items.length) setFinished(true);
                  else setIndex(index + 1);
                  reset();
                }}
              >
                {index + 1 === items.length ? 'Training abschließen' : 'Nächste Aufgabe'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </article>
        <aside className="training-aside">
          <span className="eyebrow">KLEINE SCHRITTE. KLARER FOKUS.</span>
          <h3>Verstehen schlägt Auswendiglernen.</h3>
          <p>Begründe deine Entscheidung erst für dich. Dann prüfe sie mit der Lösung.</p>
          <div className="training-steps">
            {items.map((item, i) => (
              <span key={item.id} className={i === index ? 'current' : i < index ? 'done' : ''}>
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
          <p className="caption">
            Trainingsfeedback erscheint sofort. Im Prüfungsmodus erst nach der Abgabe.
          </p>
        </aside>
      </div>
    </section>
  );
}
