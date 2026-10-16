import type { TopicId } from '../types';

export type Page = 'dashboard' | 'learning' | 'training' | 'exam';
export type Location = { page: Page; topic: TopicId; trainingTopic: TopicId | 'all' };
const paths: Record<Page, string> = {
  dashboard: 'uebersicht',
  learning: 'lernen',
  training: 'training',
  exam: 'pruefung',
};
export function readLocation(hash: string): Location | null {
  const [path, parameter] = hash.replace(/^#\/?/, '').split('/');
  const page = (Object.keys(paths) as Page[]).find((key) => paths[key] === path);
  if (!page) return null;
  const topic = parameter === 'kaufmann' ? 'kaufmann' : 'marktformen';
  return { page, topic, trainingTopic: parameter === 'all' || !parameter ? 'all' : topic };
}
export function locationHash(page: Page, topic: TopicId, trainingTopic: TopicId | 'all') {
  return `#/${paths[page]}${page === 'learning' ? `/${topic}` : page === 'training' ? `/${trainingTopic}` : ''}`;
}
