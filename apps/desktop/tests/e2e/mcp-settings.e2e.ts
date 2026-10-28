/* @layer renderer-app @kind test */
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { createProjectInUi } from './support/create-project-in-ui';
import { APP_DIR, POLL_MS, PROJECT_PARENT, TEMP_PREFIX } from './support/e2e.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { openFullRig } from './support/open-full-rig';
import { projectOnDisk } from './support/project-on-disk';
import { useRig } from './support/use-rig';

type Item = { key: string; value?: unknown; settable: boolean; locked: boolean; why: string | null; control?: { kind: string } };

type Page = { id: string; sections: { items: Item[] }[] };

const held: { sprite?: DrawnSprite; projectDir?: string } = {};

const itemsOf = async ({ link }: McpRig, args: Record<string, unknown>): Promise<Item[]> => {
  const seen = await callMcp(link.client, 'get_settings', { schema: true, ...args });
  expect(seen.ok, JSON.stringify(seen.data)).toBe(true);
  return (seen.data.pages as Page[]).flatMap((page) => page.sections.flatMap((section) => section.items));
};

const changesAnAppSetting = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const items = await itemsOf(rig, { scope: 'app' });
  const toggle = items.find((item) => item.settable && typeof item.value === 'boolean' && item.control?.kind === 'toggle' && !/^(assistant|keymap)/i.test(item.key));
  if (!toggle) throw new Error('no app toggle to change');
  const flipped = !(toggle.value as boolean);
  const done = await callMcp(link.client, 'set_setting', { scope: 'app', key: toggle.key, value: flipped, show: true });
  expect(done.data).toMatchObject({ ok: true, key: toggle.key, shown: true });
  const again = (await itemsOf(rig, { scope: 'app', keys: [toggle.key] }))[0];
  expect(again?.value).toBe(flipped);
  const view = await callMcp(link.client, 'get_view');
  expect(view.data.page).not.toBeNull();
  await callMcp(link.client, 'set_setting', { scope: 'app', key: toggle.key, value: toggle.value });
};

const refusesTheProtectedKeys = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  for (const key of ['assistantAccess', 'assistantPrograms', 'assistantLevel', 'keymap']) {
    const refused = await callMcp(link.client, 'set_setting', { scope: 'app', key, value: key === 'assistantAccess' ? false : [] });
    expect(refused.code, key).toBe('SETTING_PROTECTED');
  }
  const items = await itemsOf(rig, { scope: 'app' });
  for (const item of items.filter((each) => /^assistant/i.test(each.key))) {
    expect(item).toMatchObject({ locked: true });
    expect(item).not.toHaveProperty('value');
  }
};

const changesAnAssetSetting = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  held.sprite = await createMcpSprite(link.client);
  const tabs = ((await callMcp(link.client, 'get_view')).data.tabs as { tabId: string; documentId: string }[]).filter((tab) => tab.documentId === held.sprite?.documentId);
  const tabId = tabs[0]?.tabId;
  const items = await itemsOf(rig, { scope: 'asset', target: tabId });
  const name = items.find((item) => item.key === 'sprite.name');
  expect(name, JSON.stringify(items.map((item) => item.key))).toBeDefined();
  const done = await callMcp(link.client, 'set_setting', { scope: 'asset', target: tabId, key: 'sprite.name', value: 'knight' });
  expect(done.data).toMatchObject({ ok: true, value: 'knight' });
  await expect
    .poll(async () => ((await callMcp(link.client, 'get_document', { documentId: held.sprite?.documentId })).data.sprites as { name: string }[])[0]?.name, { timeout: POLL_MS })
    .toBe('knight');
};

const changesAProjectSetting = async (rig: McpRig): Promise<void> => {
  const { link, session } = rig;
  const parent = join(APP_DIR, PROJECT_PARENT);
  await mkdir(parent, { recursive: true });
  const projectDir = await mkdtemp(join(parent, TEMP_PREFIX));
  held.projectDir = projectDir;
  await createProjectInUi(session, projectDir, 'Dungeon');
  const items = await itemsOf(rig, { scope: 'project' });
  expect(items.some((item) => item.key === 'project.name')).toBe(true);
  const done = await callMcp(link.client, 'set_setting', { scope: 'project', key: 'project.name', value: 'Crypt' });
  expect(done.data).toMatchObject({ ok: true, value: 'Crypt' });
  await expect.poll(async () => (await projectOnDisk(projectDir, 'Dungeon')).name, { timeout: POLL_MS }).toBe('Crypt');
};

describe('settings: a program reads and changes app, asset and project settings', () => {
  const rig = useRig(openFullRig);
  test('changes an app setting, shown on its page', () => changesAnAppSetting(rig()));
  test('refuses every assistant and keymap key and hides their values', () => refusesTheProtectedKeys(rig()));
  test('changes an asset setting and sees it in the document', () => changesAnAssetSetting(rig()));
  test('changes a project setting that lands in the project file', async () => {
    try {
      await changesAProjectSetting(rig());
    } finally {
      if (held.projectDir) await rm(held.projectDir, { recursive: true, force: true });
    }
  });
});
