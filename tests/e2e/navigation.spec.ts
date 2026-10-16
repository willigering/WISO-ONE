import { expect, test } from '@playwright/test';

test('a clear first action leads into a lesson and browser navigation preserves orientation', async ({
  page,
}, info) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Starte deine WISO-Vorbereitung.' }),
  ).toBeVisible();
  await page.screenshot({
    path: `test-results/navigation-${info.project.name}.png`,
    fullPage: false,
  });
  await page.getByRole('button', { name: 'Jetzt mit dem Lernen beginnen', exact: true }).click();
  await expect(page).toHaveURL(/#\/lernen\/marktformen$/);
  await expect(
    page.getByText('Klicke eine Marktform in der Tabelle an.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Kaufmannseigenschaft', exact: true }).click();
  await expect(page).toHaveURL(/#\/lernen\/kaufmann$/);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Kaufmannseigenschaft', exact: true }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Marktformen', exact: true })).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole('heading', { name: 'Starte deine WISO-Vorbereitung.' }),
  ).toBeVisible();
  if (info.project.name === 'mobile') {
    const bottomNav = page.getByRole('navigation', { name: 'Schnellnavigation' });
    await expect(bottomNav).toBeVisible();
    await bottomNav.getByRole('button', { name: 'Üben', exact: true }).click();
  } else {
    await page.getByRole('button', { name: 'Aufgaben üben', exact: false }).first().click();
  }
  await expect(page.getByRole('heading', { name: 'Üben mit direktem Feedback.' })).toBeVisible();
});

test('lesson-to-practice has an explicit next step and reading does not discard the current exercise', async ({
  page,
}) => {
  await page.goto('/#/lernen/marktformen');
  await page.getByRole('button', { name: 'Lektion abschließen', exact: true }).click();
  await expect(
    page.getByText('Gespeichert. Übe jetzt mit Aufgaben zu diesem Thema.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Aufgaben zu diesem Thema üben', exact: true }).click();
  await expect(page.getByText('Wähle genau eine Antwort.', { exact: true })).toBeVisible();
  await page.getByLabel('Angebotsoligopol', { exact: false }).check();
  await page.getByRole('button', { name: 'Thema noch einmal nachlesen', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Dein Lernablauf' })
    .getByRole('button', { name: /Üben/ })
    .click();
  await expect(page.getByLabel('Angebotsoligopol', { exact: false })).toBeChecked();
  await page.getByRole('button', { name: 'Antwort prüfen', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('5 / 5 PUNKTE');
});
