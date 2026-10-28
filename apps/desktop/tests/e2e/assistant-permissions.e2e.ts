/* @layer renderer-app @kind test */
import { ToolListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Locator } from 'playwright-core';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { expectAccessible } from './support/expect-accessible';
import { createMcpSprite } from './support/create-mcp-sprite';
import { MCP_CLIENT_NAME, MCP_DRAWN, MCP_TOOL_COUNT } from './support/mcp.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { openMcpRig } from './support/open-mcp-rig';
import { flipSwitch, levelOf, openPermissions, presetIs, setLevel, showTools, switchIs } from './support/open-permissions';
import { decideRecoveryLater } from './support/decide-recovery-later';
import { patchStep } from './support/patch-step';
import { useRig } from './support/use-rig';

const FILES = 'Files and saving permission';
const BUNDLES = 11;

const RESTART_ROW = 1;
const RESTART = 'May restart Bxel';

const held: { sprite?: DrawnSprite; detail?: Locator; changes: number } = { changes: 0 };

const sprite = (): DrawnSprite => {
  if (!held.sprite) throw new Error('no sprite yet');
  return held.sprite;
};

const detail = (): Locator => {
  if (!held.detail) throw new Error('the page is not open');
  return held.detail;
};

const namesOf = async ({ link }: McpRig): Promise<string[]> => (await link.client.listTools()).tools.map((tool) => tool.name);

const waitForTool = (rig: McpRig, name: string, listed: boolean): Promise<void> =>
  expect.poll(async () => (await namesOf(rig)).includes(name), { timeout: 15_000 }).toBe(listed);

const groupCount = (): Promise<number> => detail().getByRole('radiogroup', { includeHidden: true }).count();

const choosePreset = async ({ session }: McpRig, name: string): Promise<void> => {
  await detail().getByRole('combobox', { name: `What ${MCP_CLIENT_NAME} may do` }).click();
  await session.page.getByRole('option', { name: new RegExp(`^${name}`) }).click();
};

const freshBatch = async (rig: McpRig, steps: readonly unknown[]) => {
  const current = await callMcp(rig.link.client, 'get_document', { documentId: sprite().documentId });
  return { documentId: sprite().documentId, baseRevision: Number(current.data.revision), label: 'permissions', steps };
};

const saveCall = (rig: McpRig) => callMcp(rig.link.client, 'save_document', { documentId: sprite().documentId, target: { fileName: 'p.bxsprite' } });

const countChanges = ({ link }: McpRig): void => {
  link.client.setNotificationHandler(ToolListChangedNotificationSchema, () => {
    held.changes += 1;
  });
};

const setsUp = async (rig: McpRig): Promise<void> => {
  held.detail = await openPermissions(rig.session);
  countChanges(rig);
  held.sprite = await createMcpSprite(rig.link.client);
  expect(await namesOf(rig)).toHaveLength(MCP_TOOL_COUNT);
  await presetIs(detail(), 'Edit documents');
};

const listsEverything = async (): Promise<void> => {
  expect(await groupCount()).toBe(BUNDLES + MCP_TOOL_COUNT + RESTART_ROW);
  expect(await levelOf(detail(), 'Edit pixels permission')).toBe('Edit');
  expect(await levelOf(detail(), 'Read documents permission')).toBe('Read');
  expect(await levelOf(detail(), 'Settings permission')).toBe('Read');
  expect(await levelOf(detail(), 'App control permission')).toBe('Read');
};

const specialIsOffByDefault = async (): Promise<void> => {
  await switchIs(detail(), RESTART, false);
  expect(await detail().getByRole('note').filter({ hasText: 'trust with your whole session' }).isVisible()).toBe(true);
};

const disablingABundleHidesItsTools = async (rig: McpRig): Promise<void> => {
  const before = held.changes;
  await setLevel(detail(), FILES, 'Disabled');
  await waitForTool(rig, 'save_document', false);
  const names = await namesOf(rig);
  for (const gone of ['export_document', 'create_document', 'split_legacy_file']) expect(names).not.toContain(gone);
  expect(names).toContain('get_document');
  expect(held.changes).toBeGreaterThan(before);
  expect((await saveCall(rig)).code).toBe('TOOL_DISABLED');
};

const readRefusesWritesAndAnOverrideWins = async (rig: McpRig): Promise<void> => {
  await setLevel(detail(), FILES, 'Read');
  await waitForTool(rig, 'save_document', true);
  expect((await saveCall(rig)).code).toBe('READ_LEVEL');
  await showTools(detail(), 'Files and saving');
  await setLevel(detail(), 'save_document permission', 'Edit');
  await detail().getByRole('radiogroup', { name: 'save_document permission, overrides Files and saving' }).waitFor();
  const overridden = await saveCall(rig);
  expect(overridden.ok, JSON.stringify(overridden.data)).toBe(true);
  const exported = await callMcp(rig.link.client, 'export_document', { documentId: sprite().documentId, format: 'png', source: { spriteId: sprite().spriteId }, fileName: 'p.png' });
  expect(exported.code).toBe('READ_LEVEL');
};

const isAccessible = async (rig: McpRig): Promise<void> => {
  await rig.session.page.emulateMedia({ reducedMotion: 'reduce' });
  await showTools(detail(), 'Session');
  await expectAccessible(rig.session, 'Assistant programs, program permissions with an override and tools open');
};

const followBundleClearsTheOverride = async (rig: McpRig): Promise<void> => {
  await detail().getByRole('button', { name: 'Follow bundle for save_document' }).click();
  await detail().getByRole('radiogroup', { name: 'save_document permission', exact: true }).waitFor();
  expect(await detail().getByRole('button', { name: 'Follow bundle for save_document' }).count()).toBe(0);
  expect((await saveCall(rig)).code).toBe('READ_LEVEL');
};

const searchFilters = async (): Promise<void> => {
  const search = detail().getByRole('searchbox', { name: 'Search tools' });
  await search.fill('save_document');
  await expect.poll(groupCount).toBe(2);
  await search.press('Escape');
  expect(await search.inputValue()).toBe('');
  await expect.poll(groupCount).toBe(BUNDLES + MCP_TOOL_COUNT + RESTART_ROW);
};

const presetsSetTheLevels = async (rig: McpRig): Promise<void> => {
  await choosePreset(rig, 'Read only');
  await expect.poll(() => levelOf(detail(), 'Edit pixels permission')).toBe('Read');
  const batch = await callMcp(rig.link.client, 'apply_edits', await freshBatch(rig, [patchStep(sprite(), MCP_DRAWN)]));
  expect(batch.code).toBe('READ_LEVEL');
  await choosePreset(rig, 'Full control');
  await expect.poll(() => levelOf(detail(), 'Settings permission')).toBe('Edit');
  await presetIs(detail(), 'Full control');
  const applied = await callMcp(rig.link.client, 'apply_edits', await freshBatch(rig, [patchStep(sprite(), MCP_DRAWN)]));
  expect(applied.ok, JSON.stringify(applied.data)).toBe(true);
};

const valuesPersistAfterReload = async (rig: McpRig): Promise<void> => {
  await setLevel(detail(), 'Animation permission', 'Read');
  await showTools(detail(), 'Browse files');
  await setLevel(detail(), 'close_document permission', 'Read');
  await flipSwitch(detail(), RESTART);
  await switchIs(detail(), RESTART, true);
  await rig.session.page.waitForTimeout(1500);
  await rig.session.page.reload();
  await decideRecoveryLater(rig.session);
  held.detail = await openPermissions(rig.session);
  expect(await levelOf(detail(), 'Animation permission')).toBe('Read');
  await showTools(detail(), 'Browse files');
  expect(await levelOf(detail(), 'close_document permission, overrides Browse files')).toBe('Read');
  await switchIs(detail(), RESTART, true);
  await presetIs(detail(), 'Custom');
  await choosePreset(rig, 'Edit documents');
  await switchIs(detail(), RESTART, false);
  await expect.poll(() => levelOf(detail(), 'Animation permission')).toBe('Edit');
};

describe('the Assistant programs page sets the permissions of a connected program', () => {
  const rig = useRig(openMcpRig);
  test('opens the permissions of the paired program at the Edit documents preset', () => setsUp(rig()));
  test('lists every bundle and every tool with its level', () => listsEverything());
  test('the special permission is off and carries a warning', () => specialIsOffByDefault());
  test('Disabled on a bundle hides its tools from the connected program', () => disablingABundleHidesItsTools(rig()));
  test('Read refuses writes and a tool override wins over its bundle', () => readRefusesWritesAndAnOverrideWins(rig()));
  test('the page passes the accessibility audit with an override and tools open', () => isAccessible(rig()));
  test('Follow bundle clears the override', () => followBundleClearsTheOverride(rig()));
  test('search filters the tools and Escape clears it', () => searchFilters());
  test('presets set the levels for the connected program', () => presetsSetTheLevels(rig()));
  test('levels and the special permission persist after a reload', () => valuesPersistAfterReload(rig()));
});
