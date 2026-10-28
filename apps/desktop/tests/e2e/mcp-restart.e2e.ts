/* @layer renderer-app @kind test */
import { access, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { connectMcp } from './support/connect-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { POLL_MS, TEMP_PREFIX } from './support/e2e.constants';
import { MCP_DRAWN } from './support/mcp.constants';
import type { ClientConfig, McpLink } from './support/mcp.type';
import { patchStep } from './support/patch-step';
import { rememberProgram } from './support/remember-program';
import { setProgramRestart } from './support/set-program-restart';
import { stopOrphan } from './support/stop-orphan';

const held: { dir?: string; userData?: string; config?: ClientConfig; link?: McpLink } = {};

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const bridgeOf = (): string => held.config?.env.BROCK_BRIDGE_FILE ?? '';

const clientOf = () => {
  if (!held.link) throw new Error('not connected');
  return held.link.client;
};

const namesOf = async (): Promise<string[]> => (await clientOf().listTools()).tools.map((tool) => tool.name);

afterAll(async () => {
  await held.link?.close().catch(() => undefined);
  if (held.config) await stopOrphan(bridgeOf());
  if (held.dir) await rm(held.dir, { recursive: true, force: true });
});

const startsWithTheRestartPermission = async (): Promise<void> => {
  const dir = await mkdtemp(join(tmpdir(), TEMP_PREFIX));
  held.dir = dir;
  held.userData = join(dir, 'profile');
  held.config = await rememberProgram(held.userData, dir);
  await setProgramRestart(held.userData, true);
  held.link = await connectMcp(held.config);
  expect((await callMcp(clientOf(), 'start_bxel', { window: 'headless' })).data).toMatchObject({ ok: true, started: true });
  expect(await namesOf()).toContain('restart_bxel');
};

const refusesWithUnsavedWorkThenRestarts = async (): Promise<void> => {
  const sprite = await createMcpSprite(clientOf());
  const drawn = await callMcp(clientOf(), 'apply_edits', { documentId: sprite.documentId, baseRevision: sprite.revision, label: 'draw', steps: [patchStep(sprite, MCP_DRAWN)] });
  expect(drawn.ok).toBe(true);
  const before = await callMcp(clientOf(), 'get_session');
  expect(before.data).toMatchObject({ ok: true, instance: { window: 'headless' } });
  const refused = await callMcp(clientOf(), 'restart_bxel');
  expect(refused.code).toBe('UNSAVED_CHANGES');
  expect((await callMcp(clientOf(), 'get_session')).data.sessionId).toBe(before.data.sessionId);
  const restarted = await callMcp(clientOf(), 'restart_bxel', { unsaved: 'recover' });
  expect(restarted.data).toMatchObject({ ok: true, restarted: true, window: 'headless' });
  expect(restarted.data.recovered).toHaveLength(1);
  expect(restarted.data.sessionId).not.toBe(before.data.sessionId);
};

const reconnectsAtTheSameGrant = async (): Promise<void> => {
  const session = await callMcp(clientOf(), 'get_session');
  expect(session.data).toMatchObject({ ok: true, mode: 'edit', trust: 'this_launch', instance: { window: 'headless' } });
  expect(await namesOf()).toContain('restart_bxel');
  const documents = await callMcp(clientOf(), 'list_documents');
  expect(documents.data.documents).toEqual([]);
};

const stopsBeforeTheNextCase = async (): Promise<void> => {
  const stopped = await callMcp(clientOf(), 'stop_bxel', { unsaved: 'recover' });
  expect(stopped.data).toMatchObject({ ok: true, stopped: true });
  await expect.poll(() => exists(bridgeOf()), { timeout: POLL_MS }).toBe(false);
};

const refusesWithThePermissionOff = async (): Promise<void> => {
  if (!held.userData || !held.config) throw new Error('no profile');
  await setProgramRestart(held.userData, false);
  expect((await callMcp(clientOf(), 'start_bxel', { window: 'headless' })).data).toMatchObject({ ok: true, started: true });
  expect(await namesOf()).not.toContain('restart_bxel');
  const refused = await callMcp(clientOf(), 'restart_bxel');
  expect(refused.code).toBe('TOOL_DISABLED');
  expect(JSON.stringify(refused.data)).toContain('May restart Bxel');
  expect((await callMcp(clientOf(), 'get_session')).ok).toBe(true);
};

describe('restart: a program with the permission restarts Bxel and reconnects at the same grant', () => {
  test('is listed with the permission on', startsWithTheRestartPermission);
  test('refuses with unsaved work, then restarts keeping the work for recovery', refusesWithUnsavedWorkThenRestarts);
  test('reconnects without a prompt at the same grant', reconnectsAtTheSameGrant);
  test('stops the restarted Bxel', stopsBeforeTheNextCase);
  test('is not listed and is refused by name with the permission off', refusesWithThePermissionOff);
});
