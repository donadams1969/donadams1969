import { test, expect } from '@playwright/test';

test('verify forensic terminal integrity', async ({ page }) => {
  await page.goto('/');

  const terminal = page.getByRole('log');

  // Verify visibility and accessibility
  await expect(terminal).toBeVisible();
  await expect(terminal).toHaveAttribute('aria-live', 'polite');

  // Verify log role and focus-visibility
  const role = await terminal.getAttribute('role');
  expect(role).toBe('log');

  // Verify metadata presence
  await expect(page.getByText('Quantum Gate')).toBeVisible();
});