import type { Question } from '../types';

const question = (
  q: Omit<Question, 'difficulty' | 'points' | 'tags'> &
    Partial<Pick<Question, 'difficulty' | 'points' | 'tags'>>,
): Question => ({ difficulty: 'medium', points: 5, tags: [q.topic], ...q });
export const questions: Question[] = [
  question({
    id: 'm01',
    topic: 'marktformen',
    type: 'singleChoice',
    difficulty: 'easy',
    question:
      'Drei Anbieter von Cloudspeicher bedienen in einem abgegrenzten Markt sehr viele Unternehmen. Welche Marktform liegt vor?',
    options: ['Angebotsmonopol', 'Angebotsoligopol', 'Nachfrageoligopol', 'Polypol'],
    solution: 'Angebotsoligopol',
    explanation: 'Wenige Anbieter und viele Nachfrager ergeben ein Angebotsoligopol.',
  }),
  question({
    id: 'm02',
    topic: 'marktformen',
    type: 'singleChoice',
    question:
      'Viele kleine Softwarestudios verkaufen Speziallizenzen an genau einen zentralen Beschaffer. Welche Marktform beschreibt diesen Modellfall?',
    options: ['Nachfragemonopol', 'Angebotsmonopol', 'Zweiseitiges Oligopol', 'Polypol'],
    solution: 'Nachfragemonopol',
    explanation:
      'Viele Anbieter stehen genau einem Nachfrager gegenüber. Die Konzentration liegt auf der Nachfrageseite.',
  }),
  question({
    id: 'm03',
    topic: 'marktformen',
    type: 'multipleChoice',
    question: 'Welche Aussagen über ein Polypol treffen zu? Wähle alle zutreffenden Aussagen.',
    options: [
      'Es gibt viele Anbieter.',
      'Es gibt viele Nachfrager.',
      'Es gibt genau einen Nachfrager.',
      'Es ist immer ein vollkommener Markt.',
    ],
    solution: ['Es gibt viele Anbieter.', 'Es gibt viele Nachfrager.'],
    explanation:
      'Ein Polypol bezeichnet die Anzahl der Marktteilnehmer. Vollkommene Information oder homogene Güter folgen daraus nicht.',
  }),
  question({
    id: 'm04',
    topic: 'marktformen',
    type: 'matching',
    question: 'Ordne jeder Konstellation die passende Marktform zu.',
    rows: [
      'Ein Anbieter / viele Nachfrager',
      'Viele Anbieter / wenige Nachfrager',
      'Wenige Anbieter / wenige Nachfrager',
    ],
    options: ['Angebotsmonopol', 'Nachfrageoligopol', 'Zweiseitiges Oligopol'],
    solution: {
      'Ein Anbieter / viele Nachfrager': 'Angebotsmonopol',
      'Viele Anbieter / wenige Nachfrager': 'Nachfrageoligopol',
      'Wenige Anbieter / wenige Nachfrager': 'Zweiseitiges Oligopol',
    },
    explanation:
      'Prüfe zuerst die Anbieterzahl, dann die Nachfragerzahl. „Oligo“ steht für wenige.',
  }),
  question({
    id: 'm05',
    topic: 'marktformen',
    type: 'trueFalse',
    difficulty: 'easy',
    question: 'Ein Anbieter und wenige Nachfrager bilden ein beschränktes Angebotsmonopol.',
    options: ['Richtig', 'Falsch'],
    solution: 'Richtig',
    explanation:
      'Die Angebotsseite ist monopolistisch; die Nachfrageseite besteht aus wenigen Teilnehmern.',
  }),
  question({
    id: 'm06',
    topic: 'marktformen',
    type: 'table',
    question: 'Vervollständige die Tabelle. Es gibt jeweils genau einen Nachfrager.',
    rows: ['Ein Anbieter', 'Wenige Anbieter', 'Viele Anbieter'],
    options: ['Zweiseitiges Monopol', 'Beschränktes Nachfragemonopol', 'Nachfragemonopol'],
    solution: {
      'Ein Anbieter': 'Zweiseitiges Monopol',
      'Wenige Anbieter': 'Beschränktes Nachfragemonopol',
      'Viele Anbieter': 'Nachfragemonopol',
    },
    explanation:
      'Bei nur einem Nachfrager entscheidet die Anbieterzahl, welche Form des Nachfragemonopols vorliegt.',
  }),
  question({
    id: 'm07',
    topic: 'marktformen',
    type: 'shortText',
    question:
      'Warum muss der relevante Markt abgegrenzt werden, bevor du die Marktform bestimmst? Erkläre es in zwei Sätzen.',
    options: [],
    solution:
      'Erst die sachliche und räumliche Abgrenzung legt fest, welche Anbieter und Nachfrager gezählt werden. Ein lokaler Markt kann anders strukturiert sein als ein weltweiter Markt.',
    expectedConcepts: [
      'sachliche Abgrenzung',
      'räumliche Abgrenzung',
      'Anzahl der Marktteilnehmer',
    ],
    gradingRubric: [
      { criterion: 'Sachliche oder räumliche Abgrenzung erklären', points: 2 },
      { criterion: 'Einfluss auf die gezählte Teilnehmerzahl erklären', points: 3 },
    ],
    explanation:
      'Vergleichbare Produkte und das betrachtete Gebiet bestimmen, wer überhaupt zum Markt gehört.',
  }),
  question({
    id: 'm08',
    topic: 'marktformen',
    type: 'dragDrop',
    question:
      'Ordne die Modellfälle zu. Ziehe einen Begriff auf eine Zeile oder nutze das Auswahlfeld.',
    rows: [
      'Ein Netzbetreiber versorgt viele Haushalte',
      'Viele Webstudios bedienen viele Firmen',
      'Drei Hersteller beliefern vier Großkunden',
    ],
    options: ['Angebotsmonopol', 'Polypol', 'Zweiseitiges Oligopol'],
    solution: {
      'Ein Netzbetreiber versorgt viele Haushalte': 'Angebotsmonopol',
      'Viele Webstudios bedienen viele Firmen': 'Polypol',
      'Drei Hersteller beliefern vier Großkunden': 'Zweiseitiges Oligopol',
    },
    explanation:
      'Die Zuordnung folgt allein der im Modell angegebenen Anzahl von Anbietern und Nachfragern.',
  }),
  question({
    id: 'k01',
    topic: 'kaufmann',
    type: 'singleChoice',
    difficulty: 'easy',
    question: 'Eine eingetragene Software-GmbH beschäftigt zwei Personen. Wie ist sie einzuordnen?',
    options: [
      'Formkaufmann',
      'Nur bei hohem Umsatz Kaufmann',
      'Kein Kaufmann',
      'Kannkaufmann nach § 2 HGB',
    ],
    solution: 'Formkaufmann',
    explanation:
      'Eine GmbH ist kraft Rechtsform Handelsgesellschaft. Die kleine Betriebsgröße ändert das nicht (§ 13 Abs. 3 GmbHG, § 6 HGB).',
  }),
  question({
    id: 'k02',
    topic: 'kaufmann',
    type: 'singleChoice',
    question:
      'Ein gewerblicher IT-Großhandel erfordert nach Art oder Umfang eine kaufmännische Organisation. Die Registereintragung fehlt noch. Welche Aussage stimmt?',
    options: [
      'Bereits Istkaufmann',
      'Erst nach Eintragung Kaufmann',
      'Immer Kannkaufmann',
      'Freiberufler',
    ],
    solution: 'Bereits Istkaufmann',
    explanation:
      'Die Voraussetzungen des § 1 HGB begründen die Kaufmannseigenschaft bereits. Die Eintragung ist grundsätzlich verpflichtend, aber hier nur deklaratorisch.',
  }),
  question({
    id: 'k03',
    topic: 'kaufmann',
    type: 'trueFalse',
    question:
      'Jeder große landwirtschaftliche Einzelbetrieb ist automatisch Istkaufmann nach § 1 HGB.',
    options: ['Richtig', 'Falsch'],
    solution: 'Falsch',
    explanation:
      '§ 3 HGB nimmt Land- und Forstwirtschaft von § 1 aus. Für § 3 Abs. 2 sind kaufmännische Organisation und Registereintragung relevant.',
  }),
  question({
    id: 'k04',
    topic: 'kaufmann',
    type: 'matching',
    question: 'Ordne die Wirkung der Handelsregistereintragung zu.',
    rows: ['Istkaufmann nach § 1 HGB', 'Kannkaufmann nach § 2 HGB'],
    options: ['Deklaratorisch', 'Konstitutiv'],
    solution: {
      'Istkaufmann nach § 1 HGB': 'Deklaratorisch',
      'Kannkaufmann nach § 2 HGB': 'Konstitutiv',
    },
    explanation:
      'Deklaratorisch bestätigt eine schon bestehende Rechtslage. Konstitutiv begründet die Eintragung die Rechtslage.',
  }),
  question({
    id: 'k05',
    topic: 'kaufmann',
    type: 'ordering',
    question:
      'Ein gewerblicher Einzelbetrieb ist vorgegeben. Ordne den Prüfungspfad für einen nicht kaufmännisch organisierten Betrieb logisch.',
    options: [
      'Kaufmännische Organisation prüfen',
      'Kleingewerbe feststellen',
      'Freiwillige Registereintragung prüfen',
      'Bei Eintragung: Kannkaufmann',
    ],
    solution: [
      'Kaufmännische Organisation prüfen',
      'Kleingewerbe feststellen',
      'Freiwillige Registereintragung prüfen',
      'Bei Eintragung: Kannkaufmann',
    ],
    explanation:
      'Zuerst wird § 1 geprüft. Greift er nicht, kann beim Kleingewerbe eine freiwillige Eintragung nach § 2 zur Kaufmannseigenschaft führen.',
  }),
  question({
    id: 'k06',
    topic: 'kaufmann',
    type: 'multipleChoice',
    question:
      'Welche Angaben sind für die Einordnung eines gewerblichen Einzelbetriebs als Istkaufmann relevant?',
    options: [
      'Art der Geschäftstätigkeit',
      'Umfang des Geschäftsbetriebs',
      'Lieblingsmarke der Inhaberin',
      'Farbe des Firmenlogos',
    ],
    solution: ['Art der Geschäftstätigkeit', 'Umfang des Geschäftsbetriebs'],
    explanation:
      '§ 1 Abs. 2 HGB knüpft an Art oder Umfang und den dadurch erforderlichen kaufmännisch eingerichteten Geschäftsbetrieb an.',
  }),
  question({
    id: 'k07',
    topic: 'kaufmann',
    type: 'caseStudy',
    difficulty: 'ihk',
    question:
      'Mira betreibt allein einen kleinen gewerblichen PC-Reparaturdienst. Eine kaufmännische Organisation ist nicht erforderlich. Sie lässt ihre Firma freiwillig ins Handelsregister eintragen. Bestimme die Kaufmannsart und begründe die Wirkung der Eintragung.',
    options: [],
    solution:
      'Mira ist Kannkaufmann nach § 2 HGB. Ihr Kleingewerbe gilt durch die freiwillige Handelsregistereintragung als Handelsgewerbe. Die Eintragung wirkt konstitutiv.',
    expectedConcepts: ['Kleingewerbe', 'Kannkaufmann', '§ 2 HGB', 'konstitutiv'],
    gradingRubric: [
      { criterion: 'Kleingewerbe als Ausgangslage erkennen', points: 1 },
      { criterion: 'Kannkaufmann und § 2 HGB nennen', points: 2 },
      { criterion: 'Konstitutive Wirkung zutreffend erklären', points: 2 },
    ],
    explanation:
      'Relevant sind der geringe Organisationsbedarf und die erfolgte freiwillige Eintragung.',
  }),
  question({
    id: 'm09',
    topic: 'marktformen',
    type: 'singleChoice',
    question:
      'Ein Hersteller eines patentgeschützten Spezialmoduls verkauft ausschließlich an drei Anlagenbauer. Welche Marktform liegt im beschriebenen Markt vor?',
    options: [
      'Beschränktes Angebotsmonopol',
      'Beschränktes Nachfragemonopol',
      'Angebotsoligopol',
      'Nachfrageoligopol',
    ],
    solution: 'Beschränktes Angebotsmonopol',
    explanation: 'Ein Anbieter steht wenigen Nachfragern gegenüber.',
  }),
  question({
    id: 'm10',
    topic: 'marktformen',
    type: 'singleChoice',
    question:
      'Drei Spezialanbieter bieten ihre Leistungen genau einer Beschaffungsstelle an. Wähle die Marktform.',
    options: [
      'Beschränktes Nachfragemonopol',
      'Zweiseitiges Monopol',
      'Nachfrageoligopol',
      'Angebotsmonopol',
    ],
    solution: 'Beschränktes Nachfragemonopol',
    explanation: 'Wenige Anbieter und ein Nachfrager bilden ein beschränktes Nachfragemonopol.',
  }),
  question({
    id: 'k08',
    topic: 'kaufmann',
    type: 'longText',
    difficulty: 'hard',
    question:
      'Vergleiche Istkaufmann und Kannkaufmann beim gewerblichen Einzelbetrieb. Gehe auf die Entstehung der Kaufmannseigenschaft und die Wirkung der Registereintragung ein.',
    options: [],
    solution:
      'Der Istkaufmann betreibt ein Handelsgewerbe nach § 1 HGB und ist bereits kraft Gesetzes Kaufmann; die Eintragung ist deklaratorisch. Beim Kleingewerbe entsteht die Kaufmannseigenschaft nach § 2 HGB durch freiwillige Eintragung; diese wirkt konstitutiv.',
    expectedConcepts: ['§ 1 HGB', '§ 2 HGB', 'deklaratorisch', 'konstitutiv'],
    gradingRubric: [
      { criterion: 'Istkaufmann und Entstehung kraft Gesetzes erklären', points: 2 },
      { criterion: 'Kannkaufmann durch freiwillige Eintragung erklären', points: 2 },
      { criterion: 'Beide Eintragungswirkungen korrekt benennen', points: 1 },
    ],
    explanation:
      'Entscheidend ist, ob die Eintragung einen vorhandenen Status bestätigt oder ihn erst begründet.',
  }),
  question({
    id: 'k09',
    topic: 'kaufmann',
    type: 'singleChoice',
    question:
      'Ein landwirtschaftlicher Einzelbetrieb erfordert nach Art und Umfang kaufmännische Organisation und ist im Handelsregister eingetragen. Welche Vorschrift passt?',
    options: [
      '§ 3 Abs. 2 HGB',
      'Nur § 1 HGB',
      'Allein § 6 HGB',
      'Keine Kaufmannseigenschaft möglich',
    ],
    solution: '§ 3 Abs. 2 HGB',
    explanation:
      'Die Sonderregelung für die Land- und Forstwirtschaft verweist unter diesen Voraussetzungen auf § 2 HGB.',
  }),
  question({
    id: 'm11',
    topic: 'marktformen',
    type: 'ordering',
    question:
      'Bringe die Schritte einer nachvollziehbaren Marktanalyse in die richtige Reihenfolge.',
    options: [
      'Relevanten Markt abgrenzen',
      'Anbieter und Nachfrager zählen',
      'Konstellation in der Matrix suchen',
      'Marktform benennen',
    ],
    solution: [
      'Relevanten Markt abgrenzen',
      'Anbieter und Nachfrager zählen',
      'Konstellation in der Matrix suchen',
      'Marktform benennen',
    ],
    explanation:
      'Die Abgrenzung muss vor dem Zählen erfolgen. Die Matrix übersetzt die Konstellation in eine Marktform.',
  }),
];
export const trainingQuestions = questions.slice(0, 15);
export const questionById = Object.fromEntries(questions.map((q) => [q.id, q]));
