export type TopicId = 'marktformen' | 'kaufmann';
export type QuestionType =
  | 'singleChoice'
  | 'multipleChoice'
  | 'trueFalse'
  | 'shortText'
  | 'longText'
  | 'matching'
  | 'ordering'
  | 'dragDrop'
  | 'table'
  | 'caseStudy';
export type Answer = string | string[] | Record<string, string>;
export interface Question {
  id: string;
  topic: TopicId;
  difficulty: 'easy' | 'medium' | 'hard' | 'ihk';
  type: QuestionType;
  question: string;
  options: string[];
  solution: Answer;
  explanation: string;
  points: number;
  tags: string[];
  rows?: string[];
  expectedConcepts?: string[];
  gradingRubric?: { criterion: string; points: number }[];
}
export interface Attempt {
  questionId: string;
  topic: TopicId;
  earned: number;
  max: number;
  confidence: number;
  at: number;
}
export interface ExamSession {
  id: string;
  examId: string;
  startedAt: number;
  deadline: number;
  submittedAt?: number;
  answers: Record<string, Answer>;
  flagged: string[];
  current: number;
}
export interface Progress {
  version: 1;
  lessons: Record<string, number>;
  attempts: Attempt[];
  exams: ExamSession[];
  activeExam: ExamSession | null;
  lastActivity: number | null;
}
