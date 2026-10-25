/* @layer renderer-app @kind test */
import { spawnSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { launchAppForTest } from '@drizztdourden08/brock-build/testing';
import { afterAll, describe, expect, test } from 'vitest';
import { canvasMapper } from './support/canvas-mapper';
import { createSprite } from './support/create-sprite';
import { drawStroke } from './support/draw-stroke';
import { APP_DIR, CANVAS_LABEL, TEMP_PREFIX } from './support/e2e.constants';
import type { Session } from './support/e2e.type';
import { MARKS, MARKS_SIDE } from './support/marks.constants';
import { pickSwatch } from './support/pick-swatch';
import { readDisplayed } from './support/read-displayed';
import { readSwatches } from './support/read-swatches';

const SIZE = { width: MARKS_SIDE, height: MARKS_SIDE };

const SNAPSHOT_WAIT_MS = 9000;

const held: { dir?: string } = {};

const launch = async (userData: string): Promise<Session> => {
  const launched = await launchAppForTest({ appDir: APP_DIR, userData });
  await launched.page.getByRole('application', { name: CANVAS_LABEL }).waitFor();
  return { app: launched.app, page: launched.page, dir: userData, close: launched.close };
};

const shownNow = async (session: Session): Promise<number[]> =>
  [...await readDisplayed(session, await canvasMapper(session, SIZE), SIZE, await readSwatches(session))];

afterAll(async () => {
  if (held.dir) await rm(held.dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }).catch(() => undefined);
});

describe('release blocker: a crash loses at most the last few seconds of work', () => {
  test('the app is killed with unsaved strokes and the next start offers them back, pixel for pixel', async () => {
    const dir = await mkdtemp(join(tmpdir(), TEMP_PREFIX));
    held.dir = dir;
    const first = await launch(join(dir, 'profile'));
    await createSprite(first);
    const map = await canvasMapper(first, SIZE);
    for (const [swatch, cells] of MARKS) {
      await pickSwatch(first, swatch);
      await drawStroke(first, map, [...cells]);
    }
    const drawn = await shownNow(first);
    expect(drawn.some((index) => index !== 0)).toBe(true);
    await first.page.waitForTimeout(SNAPSHOT_WAIT_MS);
    const pid = first.app.process().pid ?? 0;
    spawnSync('taskkill', ['/F', '/T', '/PID', String(pid)]);
    await new Promise((done) => setTimeout(done, 1500));
    const second = await launch(join(dir, 'profile'));
    try {
      const dialog = second.page.getByRole('dialog', { name: 'Recover unsaved work' });
      await dialog.waitFor();
      await dialog.getByRole('button', { name: 'Restore' }).click();
      await dialog.waitFor({ state: 'detached' });
      expect(await shownNow(second)).toEqual(drawn);
    } finally {
      await second.close();
    }
  });
});
