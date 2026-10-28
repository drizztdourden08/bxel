/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { answerDialogs } from './support/answer-dialogs';
import { inFreshPlace } from './support/in-place';
import { openAssetTab } from './support/open-asset-tab';
import { openDemo } from './support/open-demo';
import { openSession } from './support/open-session';
import { assetRow } from './support/panel-assets';
import { useRig } from './support/use-rig';
import type { Session } from './support/e2e.type';
import { writeBlocksPng } from './support/write-blocks-png';

const tools = (session: Session) => session.page.getByRole('toolbar', { name: 'Tools' });

const canvasBar = (session: Session) => session.page.getByRole('toolbar', { name: 'Canvas' });

describe('the contextual chrome of each file type', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('shows the right stage, rail and bars for every asset of the demo project and for an image', async () => {
    const { session } = rig();
    await inFreshPlace(async (place) => {
      await openDemo(session, place);

      await assetRow(session, 'slime').click();
      await openAssetTab(session, /slime/).waitFor();
      await tools(session).getByRole('button', { name: 'Pencil' }).first().waitFor();
      expect(await canvasBar(session).getByRole('button', { name: 'Onion skin' }).count()).toBe(0);
      expect(await canvasBar(session).getByRole('button', { name: 'Mirror X' }).count()).toBeGreaterThan(0);

      await assetRow(session, 'hero').click();
      await openAssetTab(session, /hero/).waitFor();
      await canvasBar(session).getByRole('button', { name: 'Onion skin' }).first().waitFor();
      await session.page.getByRole('region', { name: 'Timeline' }).waitFor();

      await assetRow(session, 'Demo 16').click();
      await openAssetTab(session, /Demo 16/).waitFor();
      await session.page.getByRole('region', { name: 'Palette' }).waitFor();
      expect(await session.page.getByRole('application', { name: 'Sprite canvas' }).count()).toBe(0);
      expect(await session.page.getByRole('region', { name: 'Timeline' }).count()).toBe(0);
      expect(await tools(session).count()).toBe(0);
      expect(await canvasBar(session).count()).toBe(0);

      await assetRow(session, 'party').click();
      await openAssetTab(session, /party/).waitFor();
      await tools(session).getByRole('button', { name: 'Zoom' }).first().waitFor();
      expect(await tools(session).getByRole('button', { name: 'Pencil' }).count()).toBe(0);
      expect(await session.page.getByRole('region', { name: 'Timeline' }).count()).toBe(0);

      await assetRow(session, 'ground').click();
      await openAssetTab(session, /ground/).waitFor();
      await session.page.getByRole('application', { name: 'Sprite canvas' }).waitFor();
      expect(await session.page.getByRole('radio', { name: /^Place/ }).count()).toBe(0);

      await assetRow(session, 'meadow').click();
      await openAssetTab(session, /meadow/).waitFor();
      expect(await session.page.getByRole('application', { name: 'Sprite canvas' }).count()).toBe(0);
      expect(await canvasBar(session).getByRole('button', { name: 'Mirror X' }).count()).toBe(0);
    });
  });

  test('opens a PNG as a read only preview tab with Import as its action', async () => {
    const { session } = rig();
    const png = await writeBlocksPng(session.dir);
    await answerDialogs(session, { open: png, save: null });
    await session.page.keyboard.press('Control+o');
    const tab = openAssetTab(session, /blocks/);
    await tab.waitFor();
    const preview = session.page.getByRole('region', { name: 'Image preview' });
    await preview.waitFor();
    await preview.getByRole('button', { name: 'Import...' }).waitFor();
    expect(await tools(session).getByRole('button', { name: 'Pencil' }).count()).toBe(0);
    expect(await session.page.getByRole('application', { name: 'Sprite canvas' }).count()).toBe(0);
    await session.page.getByText(/blocks.png - Bxel/).first().waitFor();
  });
});

describe('the start state after the last tab closes', () => {
  const rig = useRig(async () => ({ session: await openSession() }));

  test('shows the start card with its actions and dims the tool rail with a hint', async () => {
    const { session } = rig();
    await session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab').first().click({ button: 'middle' });
    const start = session.page.getByRole('region', { name: 'Start' });
    await start.waitFor();
    await start.getByRole('button', { name: 'New asset' }).waitFor();
    await start.getByRole('button', { name: 'Open', exact: true }).waitFor();
    expect(await tools(session).getByRole('button', { name: 'Pencil' }).isDisabled()).toBe(true);
    expect(await session.page.getByRole('region', { name: 'Timeline' }).count()).toBe(0);
    expect(await session.page.getByRole('region', { name: 'Layers' }).count()).toBe(0);
  });
});
