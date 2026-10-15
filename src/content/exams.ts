import { questions } from './questions';
export const demoExam = {
  id: 'wiso-grundlagen-v1',
  title: 'Wirtschaft & Handelsrecht',
  subtitle: 'Grundlagenprüfung 01',
  durationMinutes: 30,
  questionIds: questions.map((q) => q.id),
};
export const gradeScale = [
  { min: 92, grade: 1, label: 'Sehr gut' },
  { min: 81, grade: 2, label: 'Gut' },
  { min: 67, grade: 3, label: 'Befriedigend' },
  { min: 50, grade: 4, label: 'Ausreichend' },
  { min: 30, grade: 5, label: 'Mangelhaft' },
  { min: 0, grade: 6, label: 'Ungenügend' },
];
