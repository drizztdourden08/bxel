/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { createSprite } from './support/create-sprite';
import type { Session } from './support/e2e.type';
import { openSession } from './support/open-session';

const FILE_TYPES = ['Sprite', 'Spritesheet', 'Palette', 'Tileset', 'Tilemap'];

const picker = (session: Session) => session.page.getByRole('region', { name: 'New file' });

const checksPicker = async (session: Session): Promise<void> => {
  await createSprite(session);
  const tabs = session.page.getByRole('tablist', { name: 'Open assets' });
  await session.page.getByRole('button', { name: 'New file', exact: true }).click();
  for (const name of FILE_TYPES) await picker(session).getByRole('button', { name, exact: true }).waitFor();
  await picker(session).getByRole('button', { name: 'Palette', exact: true }).click();
  const dialog = session.page.getByRole('dialog', { name: 'New asset' });
  await dialog.getByRole('button', { name: 'Create palette' }).waitFor();
  await dialog.getByRole('button', { name: 'Create palette' }).click();
  await dialog.waitFor({ state: 'detached' });
  await picker(session).waitFor({ state: 'detached' });
  expect(await tabs.getByRole('tab').count()).toBeGreaterThan(1);
};

describe('the new file picker of the asset tabs', () => {
  test('lists the file types and opens the matching create flow', async () => {
    const session = await openSession();
    try {
      await checksPicker(session);
    } finally {
      await session.close();
    }
  });
});
