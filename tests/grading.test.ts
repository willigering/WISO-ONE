import { describe, expect, it } from 'vitest';
import { questions, questionById, trainingQuestions } from '../src/content/questions';
import { demoExam } from '../src/content/exams';
import { grade, score, evaluate, isOpen } from '../src/lib/grading';
import { analytics } from '../src/features/analytics';
import { emptyProgress } from '../src/lib/storage';
import { decisions, markets } from '../src/content/topics';
import { aiPackage, createExamPdf } from '../src/features/export';
import type { ExamSession } from '../src/types';

const session: ExamSession = {
  id: 'test',
  examId: demoExam.id,
  startedAt: 1792000000000,
  deadline: 1792001800000,
  submittedAt: 1792000600000,
  answers: Object.fromEntries(questions.map((q) => [q.id, q.solution])),
  flagged: [],
  current: 0,
};
describe('deterministic grading', () => {
  it('uses all exact grade boundaries without rounding up', () => {
    for (const [p, g] of [
      [100, 1],
      [92, 1],
      [91.999, 2],
      [81, 2],
      [80.999, 3],
      [67, 3],
      [66.999, 4],
      [50, 4],
      [49.999, 5],
      [30, 5],
      [29.999, 6],
      [0, 6],
    ])
      expect(grade(p).grade).toBe(g);
  });
  it('never grades free text, including model answers', () => {
    questions.filter(isOpen).forEach((q) => {
      expect(score(q, q.solution)).toBeNull();
      expect(score(q)).toBeNull();
    });
  });
  it('distinguishes a full answer, wrong choices and a blank answer', () => {
    expect(score(questionById.m01, 'Angebotsoligopol')).toBe(5);
    expect(score(questionById.m01, 'Polypol')).toBe(0);
    expect(score(questionById.m01)).toBe(0);
  });
  it('rejects over-selection and grants exact multiple selections in any order', () => {
    const q = questionById.m03;
    expect(score(q, [...q.options])).toBe(0);
    expect(score(q, [...(q.solution as string[])].reverse())).toBe(5);
    expect(score(q, [q.options[0]])).toBe(0);
  });
  it('requires exact ordering and grants proportional matching credit', () => {
    expect(score(questionById.k05, [...questionById.k05.options].reverse())).toBe(0);
    expect(score(questionById.k05, questionById.k05.solution)).toBe(5);
    expect(score(questionById.m04, { 'Ein Anbieter / viele Nachfrager': 'Angebotsmonopol' })).toBe(
      1.67,
    );
  });
  it('keeps ungraded points outside the closed-question score', () => {
    const r = evaluate(session);
    expect(r.total).toBe(100);
    expect(r.earned).toBe(85);
    expect(r.pending).toBe(15);
    expect(r.closedPercent).toBe(100);
    expect(grade(r.percent).grade).toBe(2);
  });
});
describe('content and analytics', () => {
  it('provides 15 training tasks and 20 distinct exam tasks with valid rubrics', () => {
    expect(trainingQuestions).toHaveLength(15);
    expect(new Set(demoExam.questionIds).size).toBe(20);
    questions.forEach((q) => {
      expect(q.explanation.length).toBeGreaterThan(20);
      if (isOpen(q)) expect(q.gradingRubric!.reduce((s, c) => s + c.points, 0)).toBe(q.points);
    });
  });
  it('covers all supported input types', () =>
    expect(new Set(questions.map((q) => q.type)).size).toBe(10));
  it('has all nine unique matrix combinations and no broken decision links', () => {
    expect(new Set(markets.map((m) => `${m.suppliers}/${m.buyers}`)).size).toBe(9);
    Object.values(decisions).forEach((d) =>
      d.choices?.forEach((c) => expect(decisions[c.next]).toBeDefined()),
    );
    expect(decisions.land.choices?.[0].next).toBe('landregister');
  });
  it('does not fabricate initial readiness and recommends weak topics', () => {
    const p = emptyProgress();
    expect(analytics(p).readiness).toBeNull();
    p.attempts = [
      { questionId: 'm01', topic: 'marktformen', earned: 5, max: 5, confidence: 3, at: 1 },
      { questionId: 'k01', topic: 'kaufmann', earned: 0, max: 5, confidence: 3, at: 2 },
    ];
    expect(analytics(p).recommended.id).toBe('kaufmann');
    expect(analytics(p).readiness).toBe(50);
  });
});
describe('exports', () => {
  it('exports only free text with explicit criteria and no credentials', () => {
    const data = aiPackage(session);
    expect(data.questions).toHaveLength(3);
    expect(data.questions.every((q) => q.gradingRubric && q.studentAnswer && q.modelAnswer)).toBe(
      true,
    );
    expect(data.questions.map((q) => q.id)).toEqual(['m07', 'k07', 'k08']);
  });
  it('creates paginated PDF with optional solutions and handles long text', () => {
    const long = {
      ...session,
      answers: { ...session.answers, m07: 'Eine ausführliche Antwort. '.repeat(460) },
    };
    const plain = createExamPdf(long, false, 'Jörg Müller');
    const solved = createExamPdf(long, true);
    expect(plain.getNumberOfPages()).toBeGreaterThan(5);
    const text = plain.output();
    expect(text).toContain('WISO//ONE');
    expect(text).not.toContain('Musterlösung:');
    expect(solved.output()).toContain('Musterlösung:');
  });
});
