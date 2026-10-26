/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { frameButton, openAnimationTab, timelineOf } from './support/animation-ui';
import { dragBetween } from './support/drag-between';
import type { Session } from './support/e2e.type';
import { openAssetRow } from './support/open-asset-row';
import { openStripRig } from './support/open-strip-rig';
import { assetRow } from './support/panel-assets';
import { STRIP } from './support/strip-project.constants';
import { useRig } from './support/use-rig';

const dropsFromTheAssetsList = async (session: Session): Promise<void> => {
  await openAssetRow(session, STRIP.strip);
  await openAnimationTab(session, STRIP.animation);
  await frameButton(session, 1).waitFor();
  await session.page.getByRole('searchbox', { name: 'Search the project' }).fill(STRIP.strip);
  await dragBetween(session.page, assetRow(session, STRIP.strip), timelineOf(session).getByRole('group', { name: 'Frames' }));
  await frameButton(session, 2).waitFor();
  expect(await frameButton(session, 2).getAttribute('aria-label')).toBe('Frame 2, 100 milliseconds, shared');
};

describe('dropping a sprite on the frame strip', () => {
  const rig = useRig(openStripRig);
  test('a sprite dragged from the Assets list becomes the next frame, by reference', () => dropsFromTheAssetsList(rig().session));
});
