/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import { expect } from 'vitest';
import type { Session } from './e2e.type';
import { MCP_CLIENT_NAME } from './mcp.constants';
import { runMenu } from './run-menu';

const permissions = (session: Session): Locator => session.page.getByRole('group', { name: `Permissions for ${MCP_CLIENT_NAME}` });

const openPermissions = async (session: Session): Promise<Locator> => {
  const { page } = session;
  await runMenu(session, [/^Options/]);
  await page.getByRole('navigation').getByText('Assistant programs', { exact: true }).click();
  await page.getByRole('button', { name: `Permissions for ${MCP_CLIENT_NAME}`, exact: true }).click();
  await permissions(session).waitFor();
  return permissions(session);
};

const levelGroup = (detail: Locator, name: string): Locator => detail.getByRole('radiogroup', { name, exact: true });

const setLevel = async (detail: Locator, name: string, level: 'Disabled' | 'Read' | 'Edit'): Promise<void> => {
  await levelGroup(detail, name).getByRole('radio', { name: level, exact: true }).click();
};

const levelOf = async (detail: Locator, name: string): Promise<string> => {
  const checked = levelGroup(detail, name).getByRole('radio', { checked: true });
  return (await checked.textContent())?.trim() ?? '';
};

const showTools = async (detail: Locator, group: string): Promise<void> => {
  await detail.locator('summary').filter({ hasText: new RegExp(`^\\d+ tools? in ${group}`) }).click();
};

const switchOf = (detail: Locator, name: string): Locator => detail.getByRole('switch', { name });

const flipSwitch = (detail: Locator, name: string): Promise<void> => switchOf(detail, name).dispatchEvent('click');

const switchIs = (detail: Locator, name: string, on: boolean): Promise<void> =>
  expect.poll(() => switchOf(detail, name).getAttribute('aria-checked'), { timeout: 15_000 }).toBe(String(on));

const presetIs = (detail: Locator, text: string): Promise<void> =>
  expect.poll(() => detail.getByRole('combobox', { name: `What ${MCP_CLIENT_NAME} may do` }).textContent(), { timeout: 15_000 }).toContain(text);

export { flipSwitch, levelGroup, levelOf, openPermissions, permissions, presetIs, setLevel, showTools, switchIs };
