import { ArrowRight, BookOpen, GraduationCap, Target } from 'lucide-react';

export function LearningPath({
  current,
  onLearn,
  onTrain,
  onExam,
}: {
  current: 'learning' | 'training' | 'exam';
  onLearn: () => void;
  onTrain: () => void;
  onExam: () => void;
}) {
  return (
    <nav className="learning-path" aria-label="Dein Lernablauf">
      {[
        {
          id: 'learning',
          label: 'Verstehen',
          detail: 'Mit Beispielen lernen',
          icon: BookOpen,
          action: onLearn,
        },
        {
          id: 'training',
          label: 'Üben',
          detail: 'Aufgaben mit Feedback',
          icon: Target,
          action: onTrain,
        },
        {
          id: 'exam',
          label: 'Prüfen',
          detail: 'Ohne Hilfe testen',
          icon: GraduationCap,
          action: onExam,
        },
      ].map((step, i) => (
        <button
          key={step.id}
          onClick={step.action}
          aria-current={step.id === current ? 'step' : undefined}
        >
          <span className="path-number">{i + 1}</span>
          <span>
            <strong>{step.label}</strong>
            <small>{step.detail}</small>
          </span>
          {i < 2 && <ArrowRight size={15} />}
        </button>
      ))}
    </nav>
  );
}
