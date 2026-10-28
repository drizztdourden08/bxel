/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { countMutations } from './support/count-mutations';
import { heapMb } from './support/heap-mb';
import { openSpriteRig } from './support/open-sprite-rig';
import { useRig } from './support/use-rig';

const WINDOW_MS = 3000;

const MAX_CHURN = 40;

describe('the tool surfaces stay quiet when nothing happens', () => {
  const rig = useRig(openSpriteRig);

  test('draw no DOM churn at rest and with a tool menu open', async () => {
    const { session } = rig();
    const { page } = session;
    await page.waitForTimeout(WINDOW_MS);
    expect(await countMutations(session, WINDOW_MS)).toBeLessThan(MAX_CHURN);
    await page.getByRole('toolbar', { name: 'Tools' }).getByRole('button', { name: /^Shapes/ }).click({ button: 'right' });
    await page.getByRole('menuitemradio', { name: 'Ellipse' }).waitFor();
    expect(await countMutations(session, WINDOW_MS)).toBeLessThan(MAX_CHURN);
    await page.keyboard.press('Escape');
  });

  test('keep the heap flat with the Tool options panel open on the fill tool', async () => {
    const { session } = rig();
    const { page } = session;
    await page.getByRole('application', { name: 'Sprite canvas' }).focus();
    await page.keyboard.press('g');
    await page.getByRole('toolbar', { name: 'Tool options' }).getByRole('button', { name: /^More options/ }).click();
    await page.waitForTimeout(WINDOW_MS);
    const first = await heapMb(session);
    expect(await countMutations(session, 2 * WINDOW_MS)).toBeLessThan(MAX_CHURN);
    expect((await heapMb(session)) - first).toBeLessThan(40);
  });
});
