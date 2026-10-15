export const topics = [
  {
    id: 'marktformen',
    title: 'Marktformen',
    category: 'Wirtschaft & Märkte',
    minutes: 8,
    description: 'Wer bietet an? Wer fragt nach? Verstehe die Kräfte hinter jedem Markt.',
    objectives: [
      'Die neun Marktformen unterscheiden',
      'Anbieter und Nachfrager richtig zuordnen',
      'Abgegrenzte Märkte an Praxisfällen erkennen',
    ],
  },
  {
    id: 'kaufmann',
    title: 'Kaufmannseigenschaft',
    category: 'Recht & Unternehmen',
    minutes: 10,
    description: 'Vom Gewerbe zum Kaufmann. Finde den richtigen Weg durch das HGB.',
    objectives: [
      'Ist-, Kann- und Formkaufmann unterscheiden',
      'Die Wirkung der Registereintragung erklären',
      'Land- und Forstwirtschaft richtig einordnen',
    ],
  },
] as const;

export const markets = [
  {
    name: 'Zweiseitiges Monopol',
    suppliers: 'einer',
    buyers: 'einer',
    short: 'Ein Anbieter trifft auf einen Nachfrager.',
    example:
      'Modellfall: Ein Spezialentwickler liefert eine einmalige Steuerung an den einzigen Betreiber einer Anlage.',
    insight:
      'Beide Seiten sind voneinander abhängig. Der Preis ist stark von ihrer Verhandlungsmacht geprägt.',
  },
  {
    name: 'Beschränktes Angebotsmonopol',
    suppliers: 'einer',
    buyers: 'wenige',
    short: 'Ein Anbieter trifft auf wenige Nachfrager.',
    example:
      'Modellfall: Ein Hersteller bietet einen Spezialchip an, den nur drei Raumfahrtunternehmen benötigen.',
    insight:
      'Der einzige Anbieter hat wenige mögliche Abnehmer. Auch deren Entscheidungen beeinflussen den Markt.',
  },
  {
    name: 'Angebotsmonopol',
    suppliers: 'einer',
    buyers: 'viele',
    short: 'Ein Anbieter trifft auf viele Nachfrager.',
    example:
      'Modellfall: Ein einziges Unternehmen betreibt das örtliche Wassernetz für alle Haushalte.',
    insight: 'Die Nachfrager haben in diesem abgegrenzten Markt keine alternative Bezugsquelle.',
  },
  {
    name: 'Beschränktes Nachfragemonopol',
    suppliers: 'wenige',
    buyers: 'einer',
    short: 'Wenige Anbieter treffen auf einen Nachfrager.',
    example:
      'Modellfall: Drei Anbieter zertifizierter Sicherheitssoftware bieten ausschließlich einer einzigen staatlichen Stelle an.',
    insight: 'Der einzige Nachfrager kann zwischen wenigen spezialisierten Anbietern wählen.',
  },
  {
    name: 'Zweiseitiges Oligopol',
    suppliers: 'wenige',
    buyers: 'wenige',
    short: 'Wenige Anbieter treffen auf wenige Nachfrager.',
    example:
      'Modellfall: Drei Hersteller von Rechenzentrumsanlagen beliefern vier große Cloudbetreiber.',
    insight: 'Jede größere Entscheidung kann auf beiden Seiten spürbare Reaktionen auslösen.',
  },
  {
    name: 'Angebotsoligopol',
    suppliers: 'wenige',
    buyers: 'viele',
    short: 'Wenige Anbieter treffen auf viele Nachfrager.',
    example:
      'Modellfall: Drei Mobilfunknetzbetreiber bieten ihre Netzdienste vielen Haushalten an.',
    insight:
      'Anbieter berücksichtigen bei ihren Entscheidungen die erwarteten Reaktionen der Konkurrenz.',
  },
  {
    name: 'Nachfragemonopol',
    suppliers: 'viele',
    buyers: 'einer',
    short: 'Viele Anbieter treffen auf einen Nachfrager.',
    example:
      'Modellfall: Zahlreiche freie Übersetzer bieten ihre Leistung einem einzigen zentralen Auftraggeber in einem eng abgegrenzten Markt an.',
    insight:
      'Die Nachfrageseite ist konzentriert. Viele Anbieter konkurrieren um denselben Abnehmer.',
  },
  {
    name: 'Nachfrageoligopol',
    suppliers: 'viele',
    buyers: 'wenige',
    short: 'Viele Anbieter treffen auf wenige Nachfrager.',
    example:
      'Modellfall: Viele kleine App-Studios bieten exklusive Lizenzen nur drei großen Publishern an.',
    insight:
      'Die wenigen Käufer können eine starke Verhandlungsposition gegenüber vielen Verkäufern haben.',
  },
  {
    name: 'Polypol',
    suppliers: 'viele',
    buyers: 'viele',
    short: 'Viele Anbieter treffen auf viele Nachfrager.',
    example:
      'Modellfall: Viele Webdesignbüros bieten vergleichbare Websites für viele kleine Unternehmen an.',
    insight:
      'Es gibt auf beiden Seiten viele Alternativen. Ein Polypol ist nicht automatisch ein vollkommener Markt.',
  },
];

export interface Decision {
  title: string;
  body: string;
  choices?: { label: string; next: string }[];
  result?: string;
  source?: string;
}
export const decisions: Record<string, Decision> = {
  start: {
    title: 'Welche Art von Unternehmen liegt vor?',
    body: 'Entscheidend sind die Rechtsform und die tatsächliche Tätigkeit, nicht die Berufsbezeichnung.',
    choices: [
      { label: 'GmbH, UG oder AG', next: 'form' },
      { label: 'OHG oder KG', next: 'gesellschaft' },
      { label: 'Gewerblicher Einzelbetrieb', next: 'gewerbe' },
      { label: 'Land- oder Forstwirtschaft', next: 'land' },
      { label: 'Rein freiberuflicher Einzelbetrieb', next: 'frei' },
    ],
  },
  form: {
    title: 'Kaufmann kraft Rechtsform',
    result: 'Formkaufmann',
    body: 'Eine bestehende GmbH, UG oder AG ist unabhängig von der Betriebsgröße Handelsgesellschaft. Hier entscheidet die Rechtsform.',
    source: '§ 6 HGB, § 13 Abs. 3 GmbHG, § 3 Abs. 1 AktG',
  },
  gesellschaft: {
    title: 'Handelsgesellschaft',
    result: 'Kaufmann nach HGB',
    body: 'Auf OHG und KG sind die Vorschriften für Kaufleute anwendbar. Anders als bei Kapitalgesellschaften ist für ihre Entstehung auch die Tätigkeit bzw. die Eintragung zu beachten.',
    source: '§§ 6, 105, 107, 161 HGB',
  },
  gewerbe: {
    title: 'Erfordert der Betrieb kaufmännische Organisation?',
    body: 'Betrachte Art oder Umfang: beispielsweise komplexe Geschäftsabläufe, Lagerhaltung und viele Geschäftsbeziehungen. Ein einzelner Umsatzwert entscheidet nicht automatisch.',
    choices: [
      { label: 'Ja, nach Art oder Umfang', next: 'ist' },
      { label: 'Nein, ein überschaubares Kleingewerbe', next: 'register' },
    ],
  },
  ist: {
    title: 'Der Betrieb ist ein Handelsgewerbe',
    result: 'Istkaufmann',
    body: 'Die Kaufmannseigenschaft besteht bereits kraft Gesetzes. Die verpflichtende Registereintragung bestätigt sie nur (deklaratorische Wirkung).',
    source: '§ 1 und § 29 HGB',
  },
  register: {
    title: 'Ist die Firma freiwillig im Handelsregister eingetragen?',
    body: 'Bei einem Kleingewerbe kann die Eintragung die Kaufmannseigenschaft erst begründen.',
    choices: [
      { label: 'Ja, eingetragen', next: 'kann' },
      { label: 'Nein, nicht eingetragen', next: 'kein' },
    ],
  },
  kann: {
    title: 'Die Eintragung macht den Unterschied',
    result: 'Kannkaufmann',
    body: 'Durch die freiwillige Eintragung gilt das gewerbliche Unternehmen als Handelsgewerbe. Die Wirkung ist konstitutiv.',
    source: '§ 2 HGB',
  },
  kein: {
    title: 'Kein Handelsgewerbe, keine Eintragung',
    result: 'Kein Kaufmann nach diesem Prüfungspfad',
    body: 'Das nicht eingetragene Kleingewerbe erfüllt hier weder § 1 noch § 2 HGB. „Unternehmer“ und „Kaufmann“ sind unterschiedliche Begriffe.',
    source: '§§ 1, 2 HGB',
  },
  land: {
    title: 'Erfordert der landwirtschaftliche Betrieb kaufmännische Organisation?',
    body: 'Land- und Forstwirtschaft wird nicht automatisch nach § 1 HGB zum Handelsgewerbe. Hier gilt die Sonderregelung des § 3 HGB.',
    choices: [
      { label: 'Ja, nach Art und Umfang', next: 'landregister' },
      { label: 'Nein', next: 'landklein' },
    ],
  },
  landregister: {
    title: 'Ist die Firma im Handelsregister eingetragen?',
    body: 'Bei einem entsprechend organisierten land- oder forstwirtschaftlichen Betrieb kommt es zusätzlich auf die Eintragung an.',
    choices: [
      { label: 'Ja', next: 'landkann' },
      { label: 'Nein', next: 'landnein' },
    ],
  },
  landkann: {
    title: 'Sonderfall Land- und Forstwirtschaft',
    result: 'Kannkaufmann nach § 3 HGB',
    body: 'Die Eintragung begründet hier die Kaufmannseigenschaft. Eine spätere Löschung ist nur nach den allgemeinen Vorschriften möglich.',
    source: '§ 3 Abs. 2 HGB',
  },
  landnein: {
    title: 'Ohne Eintragung kein Kaufmann nach § 3',
    result: 'Kein Kaufmann nach diesem Prüfungspfad',
    body: 'Die Größe allein macht einen land- oder forstwirtschaftlichen Einzelbetrieb nicht zum Istkaufmann.',
    source: '§ 3 HGB',
  },
  landklein: {
    title: 'Die Voraussetzung des § 3 Abs. 2 fehlt',
    result: 'Kein Kaufmann nach diesem Prüfungspfad',
    body: 'Ein kleiner landwirtschaftlicher Einzelbetrieb kann nicht allein über § 3 Abs. 2 HGB Kaufmann werden. Eine andere Rechtsform wäre gesondert zu prüfen.',
    source: '§ 3 HGB',
  },
  frei: {
    title: 'Freier Beruf als Einzelbetrieb',
    result: 'Kein Kaufmann nach diesem Prüfungspfad',
    body: 'Eine rein freiberufliche Tätigkeit ist kein Gewerbe. Die Wahl einer Kapitalgesellschaft würde die Beurteilung verändern.',
    source: '§§ 1, 6 HGB',
  },
};
export const sources = [
  ['§ 1 HGB · Istkaufmann', 'https://www.gesetze-im-internet.de/hgb/__1.html'],
  ['§ 2 HGB · Kleingewerbe', 'https://www.gesetze-im-internet.de/hgb/__2.html'],
  ['§ 3 HGB · Land- und Forstwirtschaft', 'https://www.gesetze-im-internet.de/hgb/__3.html'],
  ['§ 6 HGB · Handelsgesellschaften', 'https://www.gesetze-im-internet.de/hgb/__6.html'],
  ['§ 13 GmbHG · Rechtsstellung', 'https://www.gesetze-im-internet.de/gmbhg/__13.html'],
  ['§ 3 AktG · Formkaufmann', 'https://www.gesetze-im-internet.de/aktg/__3.html'],
];
