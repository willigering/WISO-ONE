import { topics } from '../content/topics';
import type { Progress } from '../types';
export function analytics(progress: Progress) {
  const byTopic = topics.map((topic) => {
    const recent = progress.attempts.filter((a) => a.topic === topic.id).slice(-20);
    const total = recent.reduce((s, a) => s + a.max, 0);
    return {
      ...topic,
      count: recent.length,
      percent: total ? Math.round((recent.reduce((s, a) => s + a.earned, 0) / total) * 100) : null,
      errors: recent.filter((a) => a.earned < a.max).length,
    };
  });
  const measured = byTopic.filter((t) => t.percent !== null);
  const readiness = measured.length
    ? Math.round(measured.reduce((s, t) => s + t.percent!, 0) / measured.length)
    : null;
  const recommended = [...byTopic].sort((a, b) => (a.percent ?? -1) - (b.percent ?? -1))[0];
  return { byTopic, readiness, recommended };
}
