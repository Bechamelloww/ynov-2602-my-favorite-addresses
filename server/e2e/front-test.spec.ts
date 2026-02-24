import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Page d\'accueil (redirection vers login)', () => {
  test('la page d\'accueil redirige vers /login', async ({ page }) => {
    await page.goto(BASE_URL + '/');
    await expect(page).toHaveURL(/\/login/);
  });

  test('la page login affiche le bouton Se connecter et le lien S\'inscrire', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'S\'inscrire' })).toBeVisible();
  });

  test('le lien S\'inscrire redirige vers la page d\'inscription', async ({ page }) => {
    await page.goto(BASE_URL + '/login');
    await page.getByRole('link', { name: 'S\'inscrire' }).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('depuis la page d\'accueil, on voit bien Se connecter et S\'inscrire après redirection', async ({ page }) => {
    await page.goto(BASE_URL + '/');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'S\'inscrire' })).toBeVisible();
  });
});
