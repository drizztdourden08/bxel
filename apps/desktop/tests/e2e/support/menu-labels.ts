/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const menuLabels = async (session: Session, path: readonly RegExp[] = []): Promise<string[]> => {
  const { page } = session;
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  for (const name of path) await page.getByRole('menuitem', { name }).first().click();
  const menu = page.getByRole('menu').last();
  await menu.waitFor();
  const labels = await menu.getByRole('menuitem').evaluateAll((nodes) => nodes.map((node) => node.textContent.trim()));
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.getByRole('menu').first().waitFor({ state: 'detached' });
  return labels;
};

const positionOf = (labels: readonly string[], prefix: string): number => labels.findIndex((label) => label.startsWith(prefix));

export { menuLabels, positionOf };
