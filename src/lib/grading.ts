import type { Answer, ExamSession, Question } from '../types';
import { gradeScale } from '../content/exams';
import { questions } from '../content/questions';
export const isOpen = (q: Question) => ['shortText', 'longText', 'caseStudy'].includes(q.type);
export const answered = (value?: Answer): boolean =>
  typeof value === 'string'
    ? value.trim().length > 0
    : Array.isArray(value)
      ? value.length > 0
      : !!value && Object.values(value).some((v) => v.trim().length > 0);
export function score(q: Question, answer?: Answer): number | null {
  if (isOpen(q)) return null;
  if (!answered(answer)) return 0;
  if (typeof q.solution === 'string') return answer === q.solution ? q.points : 0;
  if (Array.isArray(q.solution)) {
    if (!Array.isArray(answer)) return 0;
    if (q.type === 'multipleChoice')
      return new Set(answer).size === q.solution.length &&
        q.solution.every((v) => answer.includes(v))
        ? q.points
        : 0;
    return q.solution.length === answer.length && q.solution.every((v, i) => v === answer[i])
      ? q.points
      : 0;
  }
  if (!answer || typeof answer === 'string' || Array.isArray(answer)) return 0;
  const entries = Object.entries(q.solution);
  return (
    Math.round(
      ((q.points * entries.filter(([k, v]) => answer[k] === v).length) / entries.length) * 100,
    ) / 100
  );
}
export const grade = (percent: number) =>
  gradeScale.find((g) => percent >= g.min) ?? gradeScale[gradeScale.length - 1];
export function evaluate(session: ExamSession) {
  const entries = questions.map((q) => ({ q, earned: score(q, session.answers[q.id]) }));
  const earned = entries.reduce((s, e) => s + (e.earned ?? 0), 0);
  const total = entries.reduce((s, e) => s + e.q.points, 0);
  const pending = entries.filter((e) => e.earned === null).reduce((s, e) => s + e.q.points, 0);
  return {
    entries,
    earned,
    total,
    pending,
    percent: (earned / total) * 100,
    closedPercent: (earned / (total - pending)) * 100,
  };
}
export function answerText(value?: Answer): string {
  if (!value) return 'Nicht beantwortet';
  if (typeof value === 'string') return value || 'Nicht beantwortet';
  return Array.isArray(value)
    ? value.join(' → ')
    : Object.entries(value)
        .map(([k, v]) => `${k}: ${v || '–'}`)
        .join('\n');
}
