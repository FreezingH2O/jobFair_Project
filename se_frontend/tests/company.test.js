import { test, expect } from '@playwright/test';

test.use({
  viewport: {
    height: 551,
    width: 744
  }
});

// test.beforeAll(async () => {
//   test.setTimeout(30000);
// });

test('test', async ({ page }) => {
  await page.goto('https://se-frontend-pi-nine.vercel.app/');
  await page.getByRole('link', { name: 'Sign-In' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
  await page.getByRole('textbox', { name: 'password' }).click();
  await page.getByRole('textbox', { name: 'password' }).fill('12345678');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'Company List' }).click();
  await expect(page.getByRole('button', { name: 'Add New Company' })).toBeVisible();
  await page.getByRole('button', { name: 'Add New Company' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).click();
  await page.getByRole('textbox', { name: 'Company Name' }).fill('TestCase');
  await page.getByRole('textbox', { name: 'Address' }).click();
  await page.getByRole('textbox', { name: 'Address' }).fill('123 TestCase');
  await page.getByRole('textbox', { name: 'Website' }).click();
  await page.getByRole('textbox', { name: 'Website' }).fill('https://testcase.com/');
  await page.getByRole('textbox', { name: 'description' }).click();
  await page.getByRole('textbox', { name: 'description' }).fill('testing example');
  await page.getByRole('button', { name: 'Create Company' }).click();
  await page.getByRole('combobox', { name: 'Company Size' }).click();
  await page.getByRole('option', { name: '-200 employees' }).click();
  await page.getByRole('button', { name: 'Create Company' }).click();
  await page.getByRole('button', { name: 'Refresh positions' }).click();
  await expect(page.getByRole('link', { name: 'TestCase 123 TestCase https' })).toBeVisible();
  await page.getByRole('link', { name: 'TestCase 123 TestCase https' }).click();
  await expect(page.getByRole('button', { name: 'Edit Company' })).toBeVisible();
  await page.getByRole('button', { name: 'Edit Company' }).click();
  await page.getByRole('combobox', { name: 'Company Size 51-200 employees' }).click();
  await page.getByRole('option', { name: '-1000 employees' }).click();
  await page.getByRole('button', { name: 'Update Company' }).click();
  await page.getByRole('link', { name: 'TestCase 123 TestCase https' }).click();
  await expect(page.getByRole('main')).toContainText('501-1000 employees');
  await expect(page.getByRole('button', { name: 'Delete Company' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete Company' }).click();
  await expect(page.locator('div').filter({ hasText: 'Confirm Company DeletionAre' }).nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Refresh positions' }).click();
});