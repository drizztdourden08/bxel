/* @layer renderer-app @kind test */
import { writeFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { openSession } from './support/open-session';
import { useRig } from './support/use-rig';

const OUT = 'C:/Users/drizz/AppData/Local/Temp/claude/X--Bxel/fd0643c0-1346-4d0f-b339-1b7d626ccb01/scratchpad/probe.txt';

describe('probe', () => {
  const rig = useRig(async () => ({ session: await openSession() }));
  test('dumps the hub', async () => {
    const { page } = rig().session;
    await page.keyboard.press('Control+,');
    await page.waitForTimeout(1500);
    const text = await page.locator('body').innerText();
    const tree = await page.locator('[aria-label="Switch hub"]').first().evaluate((el) => el.outerHTML).catch((e: unknown) => String(e));
    const aria = await page.locator('body').ariaSnapshot().catch((e: unknown) => String(e));
    writeFileSync(OUT, `TEXT\n${text.slice(0, 2500)}\n\nSWITCH\n${tree.slice(0, 2500)}\n\nARIA\n${aria.slice(0, 5000)}`);
    expect(true).toBe(true);
  });
});
