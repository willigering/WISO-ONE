import { test, expect, type Page } from '@playwright/test';
import { questions } from '../../src/content/questions';
import { demoExam } from '../../src/content/exams';

async function navigate(page: Page, name: string) {
  const menu = page.getByRole('button', { name: 'Navigation öffnen' });
  if (await menu.isVisible()) await menu.click();
  await page
    .getByRole('navigation', { name: 'Hauptnavigation' })
    .getByRole('button', { name, exact: false })
    .click();
}
test('learning, local progress, training and responsive layout', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Verstehen. Anwenden. Sicher bestehen.' }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/dashboard-${info.project.name}.png`,
    fullPage: true,
  });
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('body').evaluate((el) => el.clientWidth),
  );
  await navigate(page, 'Lernen');
  await page.getByRole('button', { name: 'Angebotsoligopol', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Angebotsoligopol' })).toBeVisible();
  await page.getByRole('button', { name: 'wenige / viele', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Richtig');
  await page.screenshot({ path: `test-results/matrix-${info.project.name}.png`, fullPage: true });
  await expect(page.locator('body')).toHaveJSProperty(
    'scrollWidth',
    await page.locator('body').evaluate((el) => el.clientWidth),
  );
  await page.getByRole('button', { name: 'Lektion abschließen', exact: true }).click();
  await page.getByRole('button', { name: 'Kaufmannseigenschaft', exact: true }).click();
  await page.getByRole('button', { name: 'Land- oder Forstwirtschaft', exact: true }).click();
  await page.getByRole('button', { name: 'Ja, nach Art und Umfang', exact: true }).click();
  await page.getByRole('button', { name: 'Ja', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Kannkaufmann nach § 3 HGB' })).toBeVisible();
  await page.screenshot({ path: `test-results/decision-${info.project.name}.png`, fullPage: true });
  await page.reload();
  await navigate(page, 'Trainieren');
  await page.getByLabel('Angebotsoligopol', { exact: false }).check();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.getByRole('status')).toContainText('5 / 5 PUNKTE');
  await page.reload();
  await expect(page.getByRole('img', { name: '100 Prozent Trainingsquote' })).toBeVisible();
  await expect(page.getByText('Lektion abgeschlossen', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});
test('exam resumes, hides solutions, submits, exports and retains history', async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await navigate(page, 'Prüfung');
  await page.getByRole('button', { name: 'Prüfung jetzt starten' }).click();
  await page.getByLabel('Angebotsoligopol', { exact: false }).check();
  await page.getByRole('button', { name: 'Für später markieren' }).click();
  await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: questions[1].question })).toBeVisible();
  await page.getByRole('button', { name: 'Aufgabe 1, markiert', exact: true }).click();
  await expect(page.getByLabel('Angebotsoligopol', { exact: false })).toBeChecked();
  await expect(page.getByText('Musterlösung', { exact: true })).toHaveCount(0);
  await page.screenshot({ path: `test-results/exam-${info.project.name}.png`, fullPage: true });
  await page.getByRole('button', { name: 'Prüfung abgeben', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('1 von 20');
  await page.getByRole('button', { name: 'Verbindlich abgeben' }).click();
  await expect(page.getByRole('heading', { name: 'Wissen, wo du stehst.' })).toBeVisible();
  await expect(
    page.getByText('5.0 % gesichert · 15 Punkte noch offen', { exact: true }),
  ).toBeVisible();
  for (const [label, file] of [
    ['PDF ohne Musterlösung', 'answers.pdf'],
    ['PDF mit Auswertung', 'solutions.pdf'],
    ['Für KI-Auswertung exportieren', 'ai.json'],
  ]) {
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: label, exact: true }).click();
    const download = await downloadEvent;
    await download.saveAs(`test-results/${info.project.name}-${file}`);
    expect(await download.failure()).toBeNull();
  }
  await page.screenshot({ path: `test-results/results-${info.project.name}.png`, fullPage: true });
  await page.reload();
  await navigate(page, 'Prüfung');
  await expect(page.getByRole('button', { name: /5 \/ 100 gesichert/ })).toBeVisible();
  expect(errors).toEqual([]);
});

test('all ten question types accept and retain complete exam answers', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Prüfung');
  await page.getByRole('button', { name: 'Prüfung jetzt starten' }).click();
  for (const [index, q] of questions.entries()) {
    await expect(page.getByRole('heading', { name: q.question })).toBeVisible();
    if (['shortText', 'longText', 'caseStudy'].includes(q.type)) {
      await page.getByLabel('Deine Begründung', { exact: true }).fill(q.solution as string);
    } else if (['matching', 'table', 'dragDrop'].includes(q.type)) {
      for (const [row, choice] of Object.entries(q.solution))
        await page.getByLabel(row, { exact: true }).selectOption(choice as string);
    } else if (q.type === 'ordering') {
      const current = [...q.options].reverse();
      for (const [target, label] of (q.solution as string[]).entries()) {
        let from = current.indexOf(label);
        while (from > target) {
          await page.getByRole('button', { name: `${label} nach oben`, exact: true }).click();
          [current[from - 1], current[from]] = [current[from], current[from - 1]];
          from--;
        }
      }
    } else if (q.type === 'multipleChoice') {
      for (const choice of q.solution as string[])
        await page
          .getByRole('checkbox', {
            name: new RegExp(choice.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
          })
          .check();
    } else {
      await page
        .getByRole('radio', {
          name: new RegExp((q.solution as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
        })
        .check();
    }
    if (index < questions.length - 1)
      await page.getByRole('button', { name: 'Weiter', exact: true }).click();
  }
  await page.reload();
  await expect(page.getByText('20 von 20 beantwortet · 0 markiert')).toBeVisible();
  await page.getByRole('button', { name: 'Prüfung abgeben', exact: true }).click();
  await page.getByRole('button', { name: 'Verbindlich abgeben' }).click();
  await expect(
    page.getByText('85.0 % gesichert · 15 Punkte noch offen', { exact: true }),
  ).toBeVisible();
});

test('a corrupt saved answer is reported without destroying saved data', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Verstehen. Anwenden. Sicher bestehen.' }),
  ).toBeVisible();
  const broken = JSON.stringify({
    version: 1,
    lessons: {},
    attempts: [],
    exams: [],
    lastActivity: null,
    activeExam: {
      id: 'broken',
      examId: demoExam.id,
      startedAt: 1,
      deadline: 2,
      answers: { m01: [{}] },
      flagged: [],
      current: 0,
    },
  });
  await page.evaluate((raw) => localStorage.setItem('wiso-one.progress.v1', raw), broken);
  await page.reload();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('nicht gelesen');
  expect(await page.evaluate(() => localStorage.getItem('wiso-one.progress.v1'))).toBe(broken);
});
test('deadline expires exactly once and remains effective after reload', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Verstehen. Anwenden. Sicher bestehen.' }),
  ).toBeVisible();
  await page.evaluate(
    ({ examId }) => {
      const now = Date.now();
      localStorage.setItem(
        'wiso-one.progress.v1',
        JSON.stringify({
          version: 1,
          lessons: {},
          attempts: [],
          exams: [],
          lastActivity: now,
          activeExam: {
            id: 'expired-test',
            examId,
            startedAt: now - 1801000,
            deadline: now - 1000,
            answers: { m01: 'Angebotsoligopol' },
            flagged: [],
            current: 0,
          },
        }),
      );
    },
    { examId: demoExam.id },
  );
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Wissen, wo du stehst.' })).toBeVisible();
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('wiso-one.progress.v1')!),
  );
  expect(saved.activeExam).toBeNull();
  expect(saved.exams).toHaveLength(1);
  expect(saved.attempts).toHaveLength(17);
});
