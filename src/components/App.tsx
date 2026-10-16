'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react';
import { Learning } from '../features/Learning';
import { Training } from '../features/Training';
import { Exam } from '../features/Exam';
import { analytics } from '../features/analytics';
import { topics } from '../content/topics';
import { demoExam } from '../content/exams';
import { evaluate } from '../lib/grading';
import { emptyProgress, localRepository } from '../lib/storage';
import { locationHash, readLocation, type Page } from '../lib/navigation';
import { LearningPath } from './LearningPath';
import type { ExamSession, Progress, TopicId } from '../types';

const nav = [
  { id: 'dashboard', label: 'Start', icon: LayoutDashboard, detail: 'Dein nächster Lernschritt' },
  { id: 'learning', label: 'Lernen', icon: BookOpen, detail: 'Themen und Beispiele verstehen' },
  { id: 'training', label: 'Üben', icon: Target, detail: 'Aufgaben mit direktem Feedback' },
  {
    id: 'exam',
    label: 'Prüfung',
    icon: GraduationCap,
    detail: 'Dein Wissen unter Zeitdruck testen',
  },
] as const;

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [topic, setTopic] = useState<TopicId>('marktformen');
  const [trainingTopic, setTrainingTopic] = useState<TopicId | 'all'>('all');
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [canSave, setCanSave] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [help, setHelp] = useState(false);
  useEffect(() => {
    const restoreLocation = () => {
      const location = readLocation(window.location.hash);
      setPage(location?.page ?? 'dashboard');
      if (location) {
        if (
          location.page === 'learning' ||
          (location.page === 'training' && location.trainingTopic !== 'all')
        )
          setTopic(location.topic);
        if (location.page === 'training') setTrainingTopic(location.trainingTopic);
      }
      setMobile(false);
    };
    try {
      const p = localRepository.load();
      setProgress(p);
      if (readLocation(window.location.hash)) restoreLocation();
      else if (p.activeExam) setPage('exam');
    } catch {
      setCanSave(false);
      setStorageError(
        'Dein gespeicherter Lernstand konnte nicht gelesen werden. Vorhandene Daten werden nicht überschrieben. Diese Sitzung wird nicht gespeichert.',
      );
    }
    setReady(true);
    window.addEventListener('popstate', restoreLocation);
    window.addEventListener('hashchange', restoreLocation);
    return () => {
      window.removeEventListener('popstate', restoreLocation);
      window.removeEventListener('hashchange', restoreLocation);
    };
  }, []);
  useEffect(() => {
    if (!ready || !canSave) return;
    try {
      localRepository.save(progress);
      setStorageError('');
    } catch {
      setStorageError(
        'Der Browser konnte deinen Lernstand nicht speichern. Bitte prüfe den verfügbaren Browserspeicher. Diese Sitzung ist möglicherweise nicht dauerhaft gesichert.',
      );
    }
  }, [progress, ready, canSave]);
  const finalize = useCallback((session: ExamSession) => {
    setProgress((p) => {
      if (p.exams.some((s) => s.id === session.id)) return p;
      const evaluated = evaluate(session);
      return {
        ...p,
        activeExam: null,
        exams: [...p.exams, session],
        lastActivity: session.submittedAt!,
        attempts: [
          ...p.attempts,
          ...evaluated.entries
            .filter((e) => e.earned !== null)
            .map((e) => ({
              questionId: e.q.id,
              topic: e.q.topic,
              earned: e.earned!,
              max: e.q.points,
              confidence: 0,
              at: session.submittedAt!,
            })),
        ].slice(-2000),
      };
    });
  }, []);
  useEffect(() => {
    if (!progress.activeExam || page === 'exam') return;
    const tick = () => {
      const s = progress.activeExam!;
      if (Date.now() >= s.deadline) finalize({ ...s, submittedAt: s.deadline });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [progress.activeExam, page, finalize]);
  const go = (next: Page, nextTopic = topic, nextTrainingTopic = trainingTopic) => {
    setPage(next);
    setTopic(nextTopic);
    setTrainingTopic(nextTrainingTopic);
    const hash = locationHash(next, nextTopic, nextTrainingTopic);
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    setMobile(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const learn = (id: TopicId) => {
    go('learning', id);
  };
  const train = (id: TopicId | 'all') => {
    go('training', id === 'all' ? topic : id, id);
  };
  const data = analytics(progress);
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Zum Inhalt
      </a>
      <aside className={`sidebar ${mobile ? 'open' : ''}`}>
        <a
          href="#"
          className="wordmark"
          onClick={(e) => {
            e.preventDefault();
            go('dashboard');
          }}
        >
          WISO<span>//</span>ONE
          <span className="brand-dot" />
        </a>
        <div className="workspace-label">DEIN WISSEN. DEIN VORSPRUNG.</div>
        <div className="sidebar-section">DEINE WISO-VORBEREITUNG</div>
        <nav aria-label="Hauptnavigation">
          {nav.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? 'nav-item active' : 'nav-item'}
              aria-current={page === item.id ? 'page' : undefined}
              onClick={() => go(item.id)}
            >
              <item.icon size={18} strokeWidth={1.6} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
            </button>
          ))}
        </nav>
        <div className="sidebar-course">
          <span className="small-orbit">
            <GraduationCap size={20} />
          </span>
          <span>
            Dein Lernpfad<strong>Fachinformatik</strong>
          </span>
          <span className="pill">WISO</span>
        </div>
        <div className="sidebar-bottom">
          <div className="local-status">
            <i />
            <span>Lokal. Privat. Dein Fortschritt.</span>
          </div>
          <button className="nav-item" onClick={() => setHelp(!help)} aria-expanded={help}>
            <CircleHelp size={17} />
            <span>So funktioniert’s</span>
          </button>
          <div className="profile">
            <div>DU</div>
            <span>
              Dein Lernprofil<small>Persönlicher Workspace</small>
            </span>
            <Check size={15} />
          </div>
        </div>
      </aside>
      {mobile && (
        <button
          className="sidebar-backdrop"
          aria-label="Navigation schließen"
          onClick={() => setMobile(false)}
        />
      )}
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              aria-label={mobile ? 'Navigation schließen' : 'Navigation öffnen'}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button className="breadcrumb-home" onClick={() => go('dashboard')}>
              Startseite
            </button>
            <ChevronRight size={13} />
            <strong>{nav.find((n) => n.id === page)?.label}</strong>
          </div>
          <div className="topbar-right">
            <span className="desktop-only">DEIN NÄCHSTER SCHRITT ZÄHLT.</span>
            <span className="topbar-divider" />
            <span className="status-dot" />
            {storageError ? 'Speicher prüfen' : ready ? 'Lokal gespeichert' : 'Wird geladen'}
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {storageError && (
            <div className="notice" role="alert">
              {storageError}
            </div>
          )}
          {help && (
            <div className="help-panel">
              <button
                className="icon-button"
                aria-label="Hilfe schließen"
                onClick={() => setHelp(false)}
              >
                <X size={18} />
              </button>
              <h3>Dein Wissen wächst in drei Schritten.</h3>
              <p>
                Lerne mit Matrix und Entscheidungsbaum. Trainiere mit sofortigem Feedback. Prüfe
                dich unter Zeitdruck. Freitexte vergleichst du selbst oder exportierst sie für eine
                externe Bewertung.
              </p>
              <p>
                Deine Daten bleiben in diesem Browser. Das Löschen der Browserdaten entfernt deinen
                Lernstand. PDFs und KI-Pakete werden erst auf deinen Klick heruntergeladen; die
                Website übermittelt keine Antworten an eine KI.
              </p>
            </div>
          )}
          {!ready ? (
            <div className="loading">Dein Lernraum wird vorbereitet …</div>
          ) : (
            <>
              {page !== 'dashboard' && (
                <LearningPath
                  current={page}
                  onLearn={() => learn(topic)}
                  onTrain={() => train(topic)}
                  onExam={() => go('exam')}
                />
              )}
              {page === 'dashboard' && (
                <Dashboard
                  progress={progress}
                  learn={learn}
                  train={train}
                  exam={() => go('exam')}
                />
              )}
              {page === 'learning' && (
                <Learning
                  key={topic}
                  initialTopic={topic}
                  onTopicChange={learn}
                  completed={progress.lessons}
                  onComplete={(id) =>
                    setProgress((p) => ({
                      ...p,
                      lessons: { ...p.lessons, [id]: Date.now() },
                      lastActivity: Date.now(),
                    }))
                  }
                  onTrain={train}
                  onExam={() => go('exam')}
                />
              )}
              <div hidden={page !== 'training'}>
                <Training
                  active={page === 'training'}
                  key={trainingTopic}
                  initialTopic={trainingTopic}
                  onTopicChange={train}
                  onLearn={() => learn(topic)}
                  onExam={() => go('exam')}
                  onHome={() => go('dashboard')}
                  onAttempt={(a) =>
                    setProgress((p) => ({
                      ...p,
                      attempts: [...p.attempts, a].slice(-2000),
                      lastActivity: a.at,
                    }))
                  }
                />
              </div>
              {page === 'exam' && (
                <Exam
                  session={progress.activeExam}
                  past={progress.exams}
                  onStart={() => {
                    const startedAt = Date.now();
                    setProgress((p) => ({
                      ...p,
                      activeExam: {
                        id: crypto.randomUUID(),
                        examId: demoExam.id,
                        startedAt,
                        deadline: startedAt + demoExam.durationMinutes * 60000,
                        answers: {},
                        flagged: [],
                        current: 0,
                      },
                      lastActivity: startedAt,
                    }));
                  }}
                  onUpdate={(s) =>
                    setProgress((p) => ({ ...p, activeExam: s, lastActivity: Date.now() }))
                  }
                  onSubmit={finalize}
                  onExit={() => go('dashboard')}
                />
              )}
            </>
          )}
          <footer className="app-footer">
            <span>
              WISO<span className="gold">//</span>ONE
            </span>
            <p>Wirtschaft verstehen. Prüfung bestehen.</p>
            <span>{data.byTopic.length} Lernmodule · Dein eigener Weg.</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-bottom-nav" aria-label="Schnellnavigation">
        {nav.map((item) => (
          <button
            key={item.id}
            aria-current={page === item.id ? 'page' : undefined}
            onClick={() => go(item.id)}
          >
            <item.icon size={19} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Dashboard({
  progress,
  learn,
  train,
  exam,
}: {
  progress: Progress;
  learn: (id: TopicId) => void;
  train: (id: TopicId | 'all') => void;
  exam: () => void;
}) {
  const { byTopic, readiness, recommended } = analytics(progress);
  const lessonCount = topics.filter((t) => progress.lessons[t.id]).length;
  const activity = [...progress.attempts].reverse().slice(0, 4);
  const latestLesson = Object.entries(progress.lessons).sort((a, b) => b[1] - a[1])[0];
  const trend = progress.attempts.slice(-12);
  const nextTopic = topics.find((t) => !progress.lessons[t.id]) ?? recommended;
  const continueTraining = lessonCount === topics.length;
  const points = trend
    .map(
      (a, i) => `${14 + i * (252 / Math.max(1, trend.length - 1))},${69 - (a.earned / a.max) * 50}`,
    )
    .join(' ');
  return (
    <section className="dashboard page-enter">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">DEIN PERSÖNLICHER LERNRAUM</span>
          <h1>{lessonCount ? 'Dein nächster Lernschritt.' : 'Starte deine WISO-Vorbereitung.'}</h1>
          <p>Erst verstehen, dann üben, zum Schluss unter Prüfungsbedingungen testen.</p>
        </div>
        <span className="edition">
          WISO ESSENTIALS<span>EDITION 01 / FACHINFORMATIK</span>
        </span>
      </div>
      <div className="start-panel">
        <div className="start-copy">
          <span className="eyebrow">
            {progress.activeExam
              ? 'DEINE PRÜFUNG LÄUFT WEITER'
              : continueTraining
                ? 'EMPFOHLEN FÜR DICH'
                : `SCHRITT 1 · ${nextTopic.minutes} MINUTEN`}
          </span>
          <h2>
            {progress.activeExam
              ? 'Setze deine Prüfung fort.'
              : continueTraining
                ? `${recommended.title} üben`
                : `${nextTopic.title} verstehen`}
          </h2>
          <p>
            {progress.activeExam
              ? 'Deine Antworten sind gespeichert. Die Prüfungszeit läuft weiter.'
              : continueTraining
                ? 'Wende das Gelernte an. Du bekommst nach jeder Aufgabe eine Erklärung.'
                : 'Eine kurze Erklärung, ein interaktives Beispiel und eine kleine Aufgabe. Du brauchst kein Vorwissen.'}
          </p>
          <button
            className="button primary"
            onClick={() =>
              progress.activeExam
                ? exam()
                : continueTraining
                  ? train(recommended.id)
                  : learn(nextTopic.id)
            }
          >
            {progress.activeExam
              ? 'Prüfung fortsetzen'
              : continueTraining
                ? 'Training starten'
                : 'Jetzt mit dem Lernen beginnen'}
            <ArrowRight size={17} />
          </button>
        </div>
        <ol className="start-checklist">
          <li className={lessonCount ? 'done' : 'current'}>
            <span>{lessonCount ? <Check size={16} /> : '1'}</span>
            <div>
              <strong>Thema verstehen</strong>
              <p>Matrix und Beispiele entdecken</p>
            </div>
          </li>
          <li className={progress.attempts.length ? 'done' : ''}>
            <span>{progress.attempts.length ? <Check size={16} /> : '2'}</span>
            <div>
              <strong>Mit Aufgaben üben</strong>
              <p>Feedback direkt nach jeder Antwort</p>
            </div>
          </li>
          <li className={progress.exams.length ? 'done' : ''}>
            <span>{progress.exams.length ? <Check size={16} /> : '3'}</span>
            <div>
              <strong>Prüfung ausprobieren</strong>
              <p>20 Aufgaben in 30 Minuten</p>
            </div>
          </li>
        </ol>
      </div>
      <div className="quick-actions" aria-label="Direkt starten">
        <button onClick={() => learn(nextTopic.id)}>
          <BookOpen size={20} />
          <span>
            <strong>Thema lernen</strong>
            <small>In Ruhe verstehen · 8–10 Min.</small>
          </span>
          <ArrowRight size={17} />
        </button>
        <button onClick={() => train('all')}>
          <Target size={20} />
          <span>
            <strong>Aufgaben üben</strong>
            <small>15 Aufgaben · mit Erklärungen</small>
          </span>
          <ArrowRight size={17} />
        </button>
        <button onClick={exam}>
          <GraduationCap size={20} />
          <span>
            <strong>Prüfung testen</strong>
            <small>20 Aufgaben · 30 Min. · ohne Tipps</small>
          </span>
          <ArrowRight size={17} />
        </button>
      </div>
      <div className="section-title progress-heading">
        <div>
          <span className="eyebrow">DEIN BISHERIGER STAND</span>
          <h2>So kommst du voran.</h2>
        </div>
        <span className="caption">Deine Ergebnisse werden automatisch gespeichert.</span>
      </div>
      <div className="hero-grid">
        <div className="readiness-panel">
          <div className="panel-top">
            <span className="eyebrow">DEINE PRÜFUNGSSICHERHEIT</span>
            <ShieldCheck size={19} strokeWidth={1.5} />
          </div>
          <div className="readiness-body">
            <div className="ring">
              <svg
                viewBox="0 0 220 220"
                role="img"
                aria-label={
                  readiness === null
                    ? 'Noch kein Wissensstand ermittelt'
                    : `${readiness} Prozent Trainingsquote`
                }
              >
                <circle className="ring-track" cx="110" cy="110" r="91" />
                <circle className="ring-inner" cx="110" cy="110" r="78" />
                <circle
                  className="ring-value"
                  cx="110"
                  cy="110"
                  r="91"
                  strokeDasharray={`${(readiness ?? 0) * 5.718} 572`}
                />
                <g className="ring-ticks">
                  {Array.from({ length: 40 }, (_, i) => (
                    <line
                      key={i}
                      x1="110"
                      y1="41"
                      x2="110"
                      y2="44"
                      transform={`rotate(${i * 9} 110 110)`}
                    />
                  ))}
                </g>
              </svg>
              <div>
                <strong>
                  {readiness === null ? '—' : readiness}
                  <small>{readiness !== null && '%'}</small>
                </strong>
                <span>{readiness === null ? 'DEIN STARTPUNKT' : 'TRAININGSQUOTE'}</span>
              </div>
            </div>
            <div className="readiness-copy">
              <span className="pill gold-pill">
                {readiness === null
                  ? 'Alles beginnt mit Neugier'
                  : readiness >= 80
                    ? 'Auf einem guten Weg'
                    : 'Dein Wissen wächst'}
              </span>
              <h2>
                {readiness === null ? (
                  <>
                    Mach Wissen
                    <br />
                    zu deiner Stärke.
                  </>
                ) : (
                  <>
                    Dein Fortschritt.
                    <br />
                    Sichtbar gemacht.
                  </>
                )}
              </h2>
              <p>
                {readiness === null
                  ? 'Mit deinem ersten Training wird sichtbar, was du schon kannst und wo du ansetzen solltest.'
                  : 'Deine Quote basiert auf den letzten 20 bewerteten Antworten je Thema. Sie ist eine Lernorientierung, keine Bestehensprognose.'}
              </p>
              <button className="text-button gold" onClick={() => train('all')}>
                {readiness === null ? 'Übungsaufgaben starten' : 'Weiter üben'}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div>
              <span>LEKTIONEN</span>
              <strong>
                {lessonCount}
                <small> / 2</small>
              </strong>
            </div>
            <div>
              <span>ANTWORTEN BEWERTET</span>
              <strong>{progress.attempts.length.toString().padStart(2, '0')}</strong>
            </div>
            <div>
              <span>PRÜFUNGEN</span>
              <strong>{progress.exams.length.toString().padStart(2, '0')}</strong>
            </div>
          </div>
        </div>
        <aside className="recommend-panel">
          <div className="panel-top">
            <span className="eyebrow">DEIN NÄCHSTER SCHRITT</span>
            <ArrowDownRight size={19} />
          </div>
          <div className="recommend-symbol">
            <div />
            <div />
            <div />
            <span>↗</span>
          </div>
          <span className="eyebrow">
            {recommended.percent === null ? 'EMPFOHLENER EINSTIEG' : 'GEZIELT WIEDERHOLEN'}
          </span>
          <h2>{recommended.title}</h2>
          <p>{recommended.description}</p>
          <div className="recommend-meta">
            <Clock3 size={14} />
            {recommended.minutes} Minuten<span>·</span>Interaktives Lernmodul
          </div>
          <button className="button primary full" onClick={() => learn(recommended.id)}>
            {recommended.title} lernen <ArrowRight size={17} />
          </button>
        </aside>
      </div>
      <div className="section-title">
        <div>
          <span className="eyebrow">WISSEN MIT SYSTEM</span>
          <h2>Deine Lernbereiche.</h2>
        </div>
        <span className="caption">Zwei Perspektiven. Ein besseres Verständnis.</span>
      </div>
      <div className="module-grid">
        {byTopic.map((t, i) => (
          <button className="module" key={t.id} onClick={() => learn(t.id)}>
            <div className="module-top">
              <span className="module-number">0{i + 1}</span>
              <span className="eyebrow">{t.category}</span>
              <ArrowRight size={19} />
            </div>
            <div
              className={`module-visual ${i === 1 ? 'branch-visual' : 'grid-visual'}`}
              aria-hidden="true"
            >
              {i === 0 ? (
                Array.from({ length: 9 }, (_, n) => <i key={n} />)
              ) : (
                <>
                  <i />
                  <span />
                  <i />
                  <i />
                </>
              )}
            </div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <div className="module-footer">
              <span>
                {progress.lessons[t.id] ? (
                  <>
                    <Check size={13} /> Lektion abgeschlossen
                  </>
                ) : (
                  <>
                    <Clock3 size={13} /> {t.minutes} Minuten
                  </>
                )}
              </span>
              <span>
                {t.percent === null
                  ? 'Noch nicht gemessen'
                  : `${t.percent}% · ${t.percent >= 80 ? 'Sicher' : t.percent >= 50 ? 'Im Aufbau' : 'Wiederholen'}`}
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="bottom-grid">
        <section className="knowledge">
          <div className="section-title">
            <h3>Dein Wissensprofil</h3>
            <span className="pill">LIVE AUS DEINEM TRAINING</span>
          </div>
          {byTopic.map((t) => (
            <div className="knowledge-row" key={t.id}>
              <div>
                <span>{t.title}</span>
                <small>
                  {t.count
                    ? `${t.errors} Fehler in ${t.count} Antworten`
                    : 'Starte ein Training für deine erste Einschätzung'}
                </small>
              </div>
              <strong>{t.percent === null ? '—' : `${t.percent}%`}</strong>
              <button
                className="text-button"
                aria-label={`${t.title} üben`}
                onClick={() => train(t.id)}
              >
                Üben <ArrowRight size={17} />
              </button>
            </div>
          ))}
          <div className="trend">
            <svg
              viewBox="0 0 280 80"
              role="img"
              aria-label="Verlauf der letzten Trainingsantworten"
            >
              <path d="M14 20H266 M14 45H266 M14 70H266" stroke="var(--border)" fill="none" />
              {trend.length > 0 && (
                <polyline points={points} fill="none" stroke="var(--gold)" strokeWidth="2" />
              )}
              {trend.map((a, i) => (
                <circle
                  key={`${a.at}-${i}`}
                  cx={14 + (i * 252) / Math.max(1, trend.length - 1)}
                  cy={69 - (a.earned / a.max) * 50}
                  r="3"
                  fill="var(--gold)"
                />
              ))}
            </svg>
            <span>
              {trend.length ? 'Deine letzten Antworten' : 'Hier entsteht dein Lernverlauf.'}
            </span>
          </div>
        </section>
        <section className="recent">
          <div className="section-title">
            <h3>Zuletzt aktiv</h3>
            <Clock3 size={16} />
          </div>
          {activity.length ? (
            activity.map((a, i) => (
              <div className="activity-row" key={`${a.at}-${i}`}>
                <span className="activity-dot" />
                <div>
                  <strong>
                    {a.topic === 'marktformen' ? 'Marktformen' : 'Kaufmannseigenschaft'}
                  </strong>
                  <small>
                    {a.earned} / {a.max} Punkte · {new Date(a.at).toLocaleDateString('de-DE')}
                  </small>
                </div>
                <span className="caption">
                  {a.confidence
                    ? ['Unsicher', 'Ziemlich sicher', 'Sehr sicher'][a.confidence - 1]
                    : 'Prüfung'}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-activity">
              <BookOpen size={26} strokeWidth={1} />
              <p>
                {latestLesson
                  ? `${topics.find((t) => t.id === latestLesson[0])?.title} abgeschlossen. Zeit, dein Wissen anzuwenden.`
                  : 'Deine Lernreise wartet auf den ersten Schritt.'}
              </p>
              <button className="text-button" onClick={() => learn('marktformen')}>
                Mit Marktformen starten <ArrowRight size={15} />
              </button>
            </div>
          )}
        </section>
      </div>
      <div className="exam-banner">
        <div className="exam-banner-icon">
          <GraduationCap size={28} strokeWidth={1.3} />
        </div>
        <div>
          <span className="eyebrow">VOM LERNEN ZUM KÖNNEN</span>
          <h3>
            {progress.activeExam ? 'Deine Prüfung läuft.' : 'Teste dich unter Prüfungsbedingungen.'}
          </h3>
          <p>20 Aufgaben · 30 Minuten · Auswertung nach der Abgabe</p>
        </div>
        <button className="button secondary" onClick={exam}>
          {progress.activeExam ? 'Prüfung fortsetzen' : 'Zur Prüfung'}
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
