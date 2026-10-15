import type { Progress } from '../types';
import { demoExam } from '../content/exams';
import { questionById } from '../content/questions';
export const STORAGE_KEY = 'wiso-one.progress.v1';
export const emptyProgress = (): Progress => ({
  version: 1,
  lessons: {},
  attempts: [],
  exams: [],
  activeExam: null,
  lastActivity: null,
});
export interface ProgressRepository {
  load(): Progress;
  save(value: Progress): void;
}
// Repository boundary: replace with an authenticated backend adapter later.
export const localRepository: ProgressRepository = {
  load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const p = JSON.parse(raw) as Progress;
    if (
      !p ||
      p.version !== 1 ||
      !p.lessons ||
      Array.isArray(p.lessons) ||
      !Object.values(p.lessons).every((v) => Number.isFinite(v) && v > 0) ||
      !Array.isArray(p.attempts) ||
      !Array.isArray(p.exams) ||
      !('activeExam' in p)
    )
      throw new Error('Unbekanntes Speicherformat');
    const validAnswer = (a: unknown): boolean =>
      typeof a === 'string' ||
      (Array.isArray(a)
        ? a.every((v) => typeof v === 'string')
        : !!a && typeof a === 'object' && Object.values(a).every((v) => typeof v === 'string'));
    const validSession = (s: Progress['activeExam']) =>
      !!s &&
      typeof s.id === 'string' &&
      s.examId === demoExam.id &&
      Number.isFinite(s.deadline) &&
      Number.isFinite(s.startedAt) &&
      s.deadline >= s.startedAt &&
      (s.submittedAt === undefined ||
        (Number.isFinite(s.submittedAt) &&
          s.submittedAt >= s.startedAt &&
          s.submittedAt <= s.deadline)) &&
      Number.isInteger(s.current) &&
      s.current >= 0 &&
      s.current < demoExam.questionIds.length &&
      Array.isArray(s.flagged) &&
      s.flagged.every((id) => typeof id === 'string' && !!questionById[id]) &&
      !!s.answers &&
      !Array.isArray(s.answers) &&
      typeof s.answers === 'object' &&
      Object.entries(s.answers).every(([id, answer]) => !!questionById[id] && validAnswer(answer));
    if (
      (p.activeExam !== null &&
        (!validSession(p.activeExam) || p.activeExam.submittedAt !== undefined)) ||
      !p.exams.every((s) => validSession(s) && s.submittedAt !== undefined) ||
      !p.attempts.every(
        (a) =>
          !!a &&
          typeof a.questionId === 'string' &&
          !!questionById[a.questionId] &&
          ['marktformen', 'kaufmann'].includes(a.topic) &&
          Number.isFinite(a.earned) &&
          Number.isFinite(a.max) &&
          a.max > 0 &&
          a.earned >= 0 &&
          a.earned <= a.max &&
          Number.isFinite(a.at) &&
          [0, 1, 2, 3].includes(a.confidence),
      )
    )
      throw new Error('Beschädigter Lernstand');
    return p;
  },
  save(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
};
