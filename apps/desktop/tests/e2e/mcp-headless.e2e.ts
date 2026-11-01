/* @layer renderer-app @kind test */
import { access, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { afterAll, describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { connectMcp } from './support/connect-mcp';
import { drawMcpSprite } from './support/draw-mcp-sprite';
import { POLL_MS } from './support/e2e.constants';
import { makeTempDir } from './support/make-temp-dir';
import { rememberProgram } from './support/remember-program';
import { readOrphanPid } from './support/read-orphan-pid';
import { stopOrphan } from './support/stop-orphan';
import { waitProcessGone } from './support/wait-process-gone';

const held: { bridgeFile: string | null; dir: string | null } = { bridgeFile: null, dir: null };

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

afterAll(async () => {
  if (held.bridgeFile) await stopOrphan(held.bridgeFile);
  if (held.dir) await rm(held.dir, { recursive: true, force: true, maxRetries: 20, retryDelay: 500 });
});

describe('E1 headless helper', { tags: ['e2e'] }, () => {
  test('a helper starts a headless Bxel, edits through it and stops it with the work kept for recovery', async () => {
    const dir = await makeTempDir();
    held.dir = dir;
    const userData = join(dir, 'profile');
    const config = await rememberProgram(userData, dir);
    const bridgeFile = config.env.BROCK_BRIDGE_FILE ?? '';
    held.bridgeFile = bridgeFile;
    const link = await connectMcp(config);
    expect((await callMcp(link.client, 'get_session')).code).toBe('BXEL_NOT_RUNNING');
    const started = await callMcp(link.client, 'start_bxel', { window: 'headless' });
    expect(started.data).toMatchObject({ ok: true, started: true, window: 'headless', launchedBy: 'this_helper' });
    const pid = await readOrphanPid(bridgeFile);
    expect(pid).not.toBeNull();
    const session = await callMcp(link.client, 'get_session');
    expect(session.data).toMatchObject({ ok: true, mode: 'edit', trust: 'remembered', instance: { window: 'headless', launchedBy: 'this_helper', canStop: true } });
    expect((await callMcp(link.client, 'start_bxel', { window: 'headless' })).data).toMatchObject({ ok: true, started: false });
    const { applied } = await drawMcpSprite(link.client);
    expect(applied.ok).toBe(true);
    expect((await callMcp(link.client, 'stop_bxel')).code).toBe('UNSAVED_CHANGES');
    const stopped = await callMcp(link.client, 'stop_bxel', { unsaved: 'recover' });
    expect(stopped.data).toMatchObject({ ok: true, stopped: true });
    await expect.poll(() => exists(bridgeFile), { timeout: POLL_MS }).toBe(false);
    expect(await waitProcessGone(pid ?? 0, POLL_MS)).toBe(true);
    await link.close();
  });
});
