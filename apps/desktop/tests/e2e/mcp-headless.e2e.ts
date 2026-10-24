/* @layer renderer-app @kind test */
import { access, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { connectMcp } from './support/connect-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { APP_DIR, POLL_MS, TEMP_PREFIX } from './support/e2e.constants';
import { MCP_DRAWN } from './support/mcp.constants';
import { patchStep } from './support/patch-step';
import { rememberProgram } from './support/remember-program';
import { stopOrphan } from './support/stop-orphan';

const held: { bridgeFile: string | null; dir: string | null } = { bridgeFile: null, dir: null };

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

afterAll(async () => {
  if (held.bridgeFile) await stopOrphan(held.bridgeFile);
  if (held.dir) await rm(held.dir, { recursive: true, force: true });
});

test('check 7: a helper starts a headless Bxel, edits through it and stops it with the work kept for recovery', async () => {
  const dir = await mkdtemp(join(tmpdir(), TEMP_PREFIX));
  held.dir = dir;
  const userData = join(dir, 'profile');
  const config = await rememberProgram(userData, dir);
  const bridgeFile = config.env.BROCK_BRIDGE_FILE ?? '';
  held.bridgeFile = bridgeFile;
  const appLaunch = JSON.stringify({ command: config.command, args: [join(APP_DIR, 'dist', 'electron', 'main.js'), `--user-data=${userData}`] });
  const link = await connectMcp(config, { BXEL_APP_LAUNCH: appLaunch });
  expect((await callMcp(link.client, 'get_session')).code).toBe('BXEL_NOT_RUNNING');
  const started = await callMcp(link.client, 'start_bxel', { window: 'headless' });
  expect(started.data).toMatchObject({ ok: true, started: true, window: 'headless', launchedBy: 'this_helper' });
  const session = await callMcp(link.client, 'get_session');
  expect(session.data).toMatchObject({ ok: true, mode: 'edit', trust: 'remembered', instance: { window: 'headless', launchedBy: 'this_helper', canStop: true } });
  expect((await callMcp(link.client, 'start_bxel', { window: 'headless' })).data).toMatchObject({ ok: true, started: false });
  const sprite = await createMcpSprite(link.client);
  const applied = await callMcp(link.client, 'apply_edits', { documentId: sprite.documentId, baseRevision: sprite.revision, label: 'draw', steps: [patchStep(sprite, MCP_DRAWN)] });
  expect(applied.ok).toBe(true);
  expect((await callMcp(link.client, 'stop_bxel')).code).toBe('UNSAVED_CHANGES');
  const stopped = await callMcp(link.client, 'stop_bxel', { unsaved: 'recover' });
  expect(stopped.data).toMatchObject({ ok: true, stopped: true });
  await expect.poll(() => exists(bridgeFile), { timeout: POLL_MS }).toBe(false);
  await link.close();
});
