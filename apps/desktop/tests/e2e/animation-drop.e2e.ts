/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { frameButton, openAnimationTab, timelineOf } from './support/animation-ui';
import { dragByPointer } from './support/drag-by-pointer';
import type { Session } from './support/e2e.type';
import { openAssetRow } from './support/open-asset-row';
import { openStripRig } from './support/open-strip-rig';
import { projectTree } from './support/panel-assets';
import { STRIP } from './support/strip-project.constants';
import { useRig } from './support/use-rig';

const dropsFromTheAssetsList = async (session: Session): Promise<void> => {
  await openAssetRow(session, STRIP.strip);
  await openAnimationTab(session, STRIP.animation);
  await frameButton(session, 1).waitFor();
  await session.page.getByRole('searchbox', { name: 'Search the project' }).fill(STRIP.strip);
  await dragByPointer(session.page, projectTree(session).getByRole('treeitem').filter({ hasText: /^strip\d*$/ }).first().locator('.project-thumb'), timelineOf(session).getByRole('listbox', { name: 'Frames' }));
  await frameButton(session, 2).waitFor();
  expect(await frameButton(session, 2).getAttribute('aria-label')).toMatch(/^Frame 2 of \d+, 100 milliseconds, shared sprite/);
};

describe('dropping a sprite on the frame strip', () => {
  const rig = useRig(openStripRig);
  test('a sprite dragged from the Assets list becomes the next frame, by reference', () => dropsFromTheAssetsList(rig().session));
});
