import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('audits the sample and exports both review files', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Inspect before/);
  await page.getByRole('button', { name: 'Try a small example' }).click();
  await expect(page.getByRole('heading', { name: /review items found/i })).toBeVisible();
  await expect(page.getByText('Research — Personal')).toBeVisible();

  const htmlDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export corrected HTML' }).click();
  expect((await htmlDownload).suggestedFilename()).toBe('example-bookmarks-collision-safe.html');

  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export review CSV' }).click();
  expect((await csvDownload).suggestedFilename()).toBe('example-bookmarks-review.csv');
});

test('has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([]);
  await page.goto('/privacy');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('keeps the license restore submit control explicitly named', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Have a license? Restore it', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Verify license' })).toBeVisible();
});

test('reloads and audits while offline after first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('Offline mode: the audit still works.')).toBeVisible();
  await page.getByRole('button', { name: 'Try a small example' }).click();
  await expect(page.getByRole('heading', { name: /review items found/i })).toBeVisible();
});
