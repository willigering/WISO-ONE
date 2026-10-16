'use client';
import type { Answer, Question } from '../types';
import { useId } from 'react';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';

export function AnswerInput({
  q,
  value,
  onChange,
  disabled = false,
}: {
  q: Question;
  value?: Answer;
  onChange: (a: Answer) => void;
  disabled?: boolean;
}) {
  const inputId = useId();
  if (['shortText', 'longText', 'caseStudy'].includes(q.type))
    return (
      <label className="text-answer">
        Deine Begründung
        <textarea
          aria-label="Deine Begründung"
          disabled={disabled}
          maxLength={12000}
          rows={q.type === 'shortText' ? 4 : 7}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Formuliere deine Antwort mit eigenen Worten …"
        />
        <span className="muted">
          {typeof value === 'string' ? value.length : 0} / 12.000 Zeichen
        </span>
      </label>
    );
  if (['matching', 'table', 'dragDrop'].includes(q.type)) {
    const map = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return (
      <div>
        <p className="answer-instruction">
          {q.type === 'dragDrop'
            ? 'Ziehe die Begriffe auf die passenden Zeilen oder wähle sie im Auswahlfeld aus.'
            : 'Wähle für jede Zeile die passende Antwort im Auswahlfeld.'}
        </p>
        {q.type === 'dragDrop' && (
          <div className="drag-bank">
            {q.options.map((option) => (
              <span
                key={option}
                draggable={!disabled}
                onDragStart={(e) => e.dataTransfer.setData('text/plain', option)}
              >
                <GripVertical size={14} />
                {option}
              </span>
            ))}
          </div>
        )}
        <div className="matching">
          {q.rows?.map((row, i) => (
            <div
              className="match-row"
              key={row}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const text = e.dataTransfer.getData('text/plain');
                if (!disabled && q.options.includes(text)) onChange({ ...map, [row]: text });
              }}
            >
              <label htmlFor={`${inputId}-${q.id}-${i}`}>{row}</label>
              <select
                id={`${inputId}-${q.id}-${i}`}
                disabled={disabled}
                value={map[row] ?? ''}
                onChange={(e) => onChange({ ...map, [row]: e.target.value })}
              >
                <option value="">Zuordnen …</option>
                {q.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (q.type === 'ordering') {
    const order = Array.isArray(value) ? value : [...q.options].reverse();
    const move = (from: number, to: number) => {
      const next = [...order];
      [next[from], next[to]] = [next[to], next[from]];
      onChange(next);
    };
    return (
      <div className="ordering">
        <p className="answer-instruction">
          Verschiebe die Schritte mit ↑ und ↓ in die richtige Reihenfolge.
        </p>
        {order.map((o, i) => (
          <div key={o}>
            <span className="order-number">{i + 1}</span>
            <span>{o}</span>
            <button
              aria-label={`${o} nach oben`}
              disabled={disabled || i === 0}
              onClick={() => move(i, i - 1)}
            >
              <ArrowUp size={16} />
            </button>
            <button
              aria-label={`${o} nach unten`}
              disabled={disabled || i === order.length - 1}
              onClick={() => move(i, i + 1)}
            >
              <ArrowDown size={16} />
            </button>
          </div>
        ))}
        <button
          className="button secondary compact"
          disabled={disabled}
          onClick={() => onChange([...order])}
        >
          {value ? 'Reihenfolge übernommen' : 'Reihenfolge übernehmen'}
        </button>
      </div>
    );
  }
  return (
    <fieldset className="choices">
      <legend className="answer-instruction">
        {q.type === 'multipleChoice'
          ? 'Mehrere Antworten sind möglich. Wähle alle zutreffenden Aussagen.'
          : 'Wähle genau eine Antwort.'}
      </legend>
      {q.options.map((o, i) => {
        const checked =
          q.type === 'multipleChoice' ? Array.isArray(value) && value.includes(o) : value === o;
        return (
          <label key={o} className={checked ? 'choice selected' : 'choice'}>
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
            <input
              type={q.type === 'multipleChoice' ? 'checkbox' : 'radio'}
              name={`${inputId}-${q.id}`}
              disabled={disabled}
              checked={checked}
              onChange={() => {
                if (q.type === 'multipleChoice') {
                  const current = Array.isArray(value) ? value : [];
                  onChange(checked ? current.filter((v) => v !== o) : [...current, o]);
                } else onChange(o);
              }}
            />
            <span>{o}</span>
          </label>
        );
      })}
    </fieldset>
  );
}
