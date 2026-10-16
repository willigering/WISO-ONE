'use client';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Clock3,
  Download,
  FileJson,
  ShieldCheck,
} from 'lucide-react';
import { demoExam, gradeScale } from '../content/exams';
import { questions } from '../content/questions';
import { topics } from '../content/topics';
import { AnswerInput } from '../components/AnswerInput';
import { answered, answerText, evaluate, grade } from '../lib/grading';
import type { ExamSession } from '../types';

export function Exam({
  session,
  past,
  onStart,
  onUpdate,
  onSubmit,
  onExit,
}: {
  session: ExamSession | null;
  past: ExamSession[];
  onStart: () => void;
  onUpdate: (s: ExamSession) => void;
  onSubmit: (s: ExamSession) => void;
  onExit: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<ExamSession | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = setInterval(tick, 1000);
    window.addEventListener('focus', tick);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', tick);
    };
  }, []);
  useEffect(() => {
    if (session && now >= session.deadline) {
      const done = { ...session, submittedAt: session.deadline };
      onSubmit(done);
      setResult(done);
      setConfirm(false);
    }
  }, [now, session, onSubmit]);
  if (result) return <ExamResult session={result} onBack={() => setResult(null)} />;
  if (!session)
    return (
      <section className="page-enter">
        <span className="eyebrow">DER NÄCHSTE SCHRITT</span>
        <h1>Bereit, wenn du es bist.</h1>
        <p className="lede">Ein ruhiger Raum. Ein klarer Zeitrahmen. Dein Wissen zählt.</p>
        <div className="exam-intro">
          <div>
            <span className="pill">GRUNDLAGENPRÜFUNG 01</span>
            <h2>
              Wirtschaft &<br />
              Handelsrecht.
            </h2>
            <p>
              Marktformen und Kaufmannseigenschaft in praxisnahen Aufgaben. Entwickelt für deine
              WISO-Vorbereitung.
            </p>
            <div className="exam-facts">
              <div>
                <strong>20</strong>
                <span>Aufgaben</span>
              </div>
              <div>
                <strong>
                  30<span> min</span>
                </strong>
                <span>Zeit</span>
              </div>
              <div>
                <strong>100</strong>
                <span>Punkte</span>
              </div>
            </div>
            <button
              className="button primary"
              onClick={() => {
                setNow(Date.now());
                onStart();
              }}
            >
              Prüfung jetzt starten <ArrowRight size={17} />
            </button>
          </div>
          <aside>
            <ShieldCheck size={40} strokeWidth={1} />
            <h3>Dein Prüfungsmodus</h3>
            <p>
              Keine Hinweise oder Lösungen während der Bearbeitung. Du kannst Aufgaben markieren und
              jederzeit zurückkehren.
            </p>
            <p>
              Antworten werden in diesem Browser gespeichert. Die Zeit läuft auch bei geschlossenem
              Tab weiter.
            </p>
            <p className="caption">
              85 Punkte werden automatisch bewertet. 15 Freitextpunkte bleiben für eine externe
              Bewertung offen. Die Prüfung ist eine eigene Übung, keine offizielle IHK-Prüfung.
            </p>
          </aside>
        </div>
        {past.length > 0 && (
          <div className="history">
            <h3>Deine bisherigen Prüfungen</h3>
            {[...past].reverse().map((s) => (
              <button key={s.id} className="history-row" onClick={() => setResult(s)}>
                <span>{new Date(s.submittedAt!).toLocaleString('de-DE')}</span>
                <span>{evaluate(s).earned} / 100 gesichert</span>
                <span>
                  Auswertung <ArrowRight size={15} />
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    );
  const q = questions[session.current];
  const remaining = Math.max(0, Math.ceil((session.deadline - now) / 1000));
  const filled = questions.filter((item) => answered(session.answers[item.id])).length;
  const submit = () => {
    const done = { ...session, submittedAt: Math.min(Date.now(), session.deadline) };
    onSubmit(done);
    setResult(done);
    setConfirm(false);
  };
  return (
    <section className="page-enter">
      <div className="exam-topline">
        <div>
          <span className="eyebrow">PRÜFUNG LÄUFT</span>
          <h1>Fokus auf dein Wissen.</h1>
        </div>
        <div className={`timer ${remaining < 300 ? 'error' : ''}`} aria-label="Verbleibende Zeit">
          <Clock3 size={18} />
          {Math.floor(remaining / 60)
            .toString()
            .padStart(2, '0')}
          :{(remaining % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="exam-layout">
        <article className="question-panel">
          <div className="question-meta">
            <span className="eyebrow">
              AUFGABE {String(session.current + 1).padStart(2, '0')} <span>/ 20</span>
            </span>
            <span className="pill">{q.points} Punkte</span>
          </div>
          <h2>{q.question}</h2>
          <AnswerInput
            q={q}
            value={session.answers[q.id]}
            onChange={(a) => {
              if (Date.now() < session.deadline)
                onUpdate({ ...session, answers: { ...session.answers, [q.id]: a } });
            }}
          />
          <div className="exam-actions">
            <button
              className="text-button"
              aria-pressed={session.flagged.includes(q.id)}
              onClick={() =>
                onUpdate({
                  ...session,
                  flagged: session.flagged.includes(q.id)
                    ? session.flagged.filter((id) => id !== q.id)
                    : [...session.flagged, q.id],
                })
              }
            >
              <Bookmark size={16} fill={session.flagged.includes(q.id) ? 'currentColor' : 'none'} />
              {session.flagged.includes(q.id) ? 'Markiert' : 'Für später markieren'}
            </button>
            <div>
              <button
                className="button secondary"
                aria-label="Vorherige Aufgabe"
                disabled={session.current === 0}
                onClick={() => onUpdate({ ...session, current: session.current - 1 })}
              >
                <ArrowLeft size={16} /> Zurück
              </button>
              <button
                className="button primary"
                onClick={() =>
                  session.current === questions.length - 1
                    ? setConfirm(true)
                    : onUpdate({ ...session, current: session.current + 1 })
                }
              >
                {session.current === questions.length - 1 ? 'Zur Abgabe' : 'Nächste Aufgabe'}{' '}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </article>
        <aside className="exam-sidebar">
          <span className="eyebrow">AUFGABENÜBERSICHT</span>
          <div className="question-grid">
            {questions.map((item, i) => (
              <button
                aria-label={`Aufgabe ${i + 1}${session.flagged.includes(item.id) ? ', markiert' : ''}`}
                aria-current={session.current === i ? 'step' : undefined}
                className={`${session.current === i ? 'current' : ''} ${answered(session.answers[item.id]) ? 'answered' : ''}`}
                key={item.id}
                onClick={() => onUpdate({ ...session, current: i })}
              >
                {String(i + 1).padStart(2, '0')}
                {session.flagged.includes(item.id) && <i />}
              </button>
            ))}
          </div>
          <p className="caption">
            {filled} von 20 beantwortet · {session.flagged.length} markiert
          </p>
          <p className="caption">Gefüllt = bearbeitet · goldener Punkt = markiert</p>
          <button className="button primary full" onClick={() => setConfirm(true)}>
            Prüfung abgeben <Check size={16} />
          </button>
          <button className="text-button" onClick={onExit}>
            Übersicht öffnen · Zeit läuft weiter
          </button>
        </aside>
      </div>
      {confirm && (
        <div className="modal-backdrop">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-title"
            onKeyDown={(e) => {
              if (e.key === 'Escape') setConfirm(false);
              if (e.key === 'Tab') {
                e.preventDefault();
                const buttons = e.currentTarget.querySelectorAll('button');
                const next = document.activeElement === buttons[0] ? buttons[1] : buttons[0];
                next.focus();
              }
            }}
          >
            <span className="eyebrow">DEINE ABGABE</span>
            <h2 id="submit-title">Prüfung abschließen?</h2>
            <p>
              {filled} von 20 Aufgaben sind beantwortet. {session.flagged.length} Aufgaben sind
              markiert. Nach der Abgabe kannst du deine Antworten nicht mehr ändern.
            </p>
            <div className="button-row">
              <button autoFocus className="button secondary" onClick={() => setConfirm(false)}>
                Weiter bearbeiten
              </button>
              <button className="button primary" onClick={submit}>
                Verbindlich abgeben
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ExamResult({ session, onBack }: { session: ExamSession; onBack: () => void }) {
  const r = evaluate(session);
  const [name, setName] = useState('');
  const [exportStatus, setExportStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const exportFile = async (kind: 'pdf' | 'solutions' | 'json' | 'copy') => {
    setBusy(true);
    setExportStatus('Export wird vorbereitet …');
    try {
      const exports = await import('./export');
      if (kind === 'json') exports.downloadJson(session);
      else if (kind === 'copy')
        await navigator.clipboard.writeText(JSON.stringify(exports.aiPackage(session), null, 2));
      else
        exports
          .createExamPdf(session, kind === 'solutions', name)
          .save(`WISO-ONE-${kind === 'solutions' ? 'Auswertung' : 'Antworten'}.pdf`);
      setExportStatus(kind === 'copy' ? 'KI-Paket kopiert.' : 'Export erstellt.');
    } catch {
      setExportStatus(
        'Export fehlgeschlagen. Bitte erneut versuchen oder den JSON-Download verwenden.',
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="page-enter">
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={16} /> Prüfungsübersicht
      </button>
      <span className="eyebrow block">DEINE AUSWERTUNG</span>
      <h1>Wissen, wo du stehst.</h1>
      <p className="lede">
        {demoExam.title} · {new Date(session.submittedAt!).toLocaleDateString('de-DE')}
      </p>
      <div className="result-overview">
        <div>
          <span className="eyebrow">GESICHERTE PUNKTE</span>
          <strong>
            {r.earned}
            <small> / {r.total}</small>
          </strong>
          <p>
            {r.percent.toFixed(1)} % gesichert · {r.pending} Punkte noch offen
          </p>
        </div>
        <div>
          <span className="eyebrow">VORLÄUFIGE MINDESTNOTE</span>
          <strong>
            {grade(r.percent).grade}
            <small> / 6</small>
          </strong>
          <p>
            Bestmögliche Note nach Freitextbewertung:{' '}
            {grade(((r.earned + r.pending) / r.total) * 100).grade}
          </p>
        </div>
      </div>
      <div className="notice">
        Freitext wird nicht automatisch benotet. Die Mindestnote zählt offene Punkte vorläufig als
        0; eine endgültige Gesamtnote liegt noch nicht vor. Exportiere die freien Antworten für eine
        externe Bewertung.
      </div>
      <div className="result-topics">
        {topics.map((t) => {
          const entries = r.entries.filter((e) => e.q.topic === t.id);
          const closed = entries.filter((e) => e.earned !== null);
          const earned = closed.reduce((s, e) => s + e.earned!, 0);
          const max = closed.reduce((s, e) => s + e.q.points, 0);
          return (
            <div key={t.id}>
              <h3>{t.title}</h3>
              <span className="topic-percent">
                {Math.round((earned / max) * 100)}
                <small>%</small>
              </span>
              <p>
                {earned} / {max} automatisch bewertete Punkte
              </p>
              <span className="pill">
                {earned / max >= 0.8 ? 'Deine Stärke' : 'Hier lohnt sich Wiederholung'}
              </span>
            </div>
          );
        })}
      </div>
      <div className="export-panel">
        <div>
          <span className="eyebrow">DEIN ERGEBNIS ZUM MITNEHMEN</span>
          <h3>Behalten. Reflektieren. Weiterlernen.</h3>
          <label className="name-field">
            Name im PDF (optional)
            <input
              value={name}
              maxLength={100}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
            />
          </label>
        </div>
        <div className="export-buttons">
          <button disabled={busy} className="button secondary" onClick={() => exportFile('pdf')}>
            <Download size={16} /> PDF ohne Musterlösung
          </button>
          <button
            disabled={busy}
            className="button secondary"
            onClick={() => exportFile('solutions')}
          >
            <Download size={16} /> PDF mit Auswertung
          </button>
          <button disabled={busy} className="button secondary" onClick={() => exportFile('json')}>
            <FileJson size={16} /> Für KI-Auswertung exportieren
          </button>
          <button disabled={busy} className="text-button" onClick={() => exportFile('copy')}>
            KI-Paket als Text kopieren
          </button>
          <span role="status" className="caption">
            {exportStatus}
          </span>
        </div>
      </div>
      <details className="sources">
        <summary>IHK-naher Notenschlüssel & Bewertungsregeln</summary>
        <p>
          Prozentwerte werden für die Note nicht aufgerundet. Mehrfachauswahl und Reihenfolgen:
          volle Punkte nur bei vollständig richtiger Antwort. Zuordnungen: anteilige Punkte je
          richtiger Zeile. Freitext: externe Bewertung.
        </p>
        <div className="grade-scale">
          {gradeScale.map((g, i) => (
            <span key={g.grade}>
              Note {g.grade}: {g.min}
              {i === 0 ? '–100' : ` bis unter ${gradeScale[i - 1].min}`} %
            </span>
          ))}
        </div>
      </details>
      <h2 className="review-heading">Deine Antworten im Detail.</h2>
      <div className="answer-review">
        {r.entries.map(({ q, earned }, i) => (
          <details key={q.id}>
            <summary>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{q.question}</span>
              <strong
                className={earned === null ? 'muted' : earned === q.points ? 'success' : 'error'}
              >
                {earned === null ? 'Offen' : `${earned} / ${q.points}`}
              </strong>
            </summary>
            <div>
              <h4>Deine Antwort</h4>
              <p className="preserve-lines">{answerText(session.answers[q.id])}</p>
              <h4>Musterlösung</h4>
              <p className="preserve-lines">{answerText(q.solution)}</p>
              <p>{q.explanation}</p>
              {q.gradingRubric?.map((c) => (
                <p key={c.criterion}>
                  {c.criterion} · {c.points} Punkte
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
