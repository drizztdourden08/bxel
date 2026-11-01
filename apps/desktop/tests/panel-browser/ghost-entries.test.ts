/* @layer renderer-app @kind test */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { describe, expect, it, vi } from 'vitest';
import { ghostItem } from '../../src/panel-browser/ghost-item';
import { EMPTY_STATUS } from '../../src/panel-browser/project-browser.constants';
import { ghostEntries } from '../../src/views/ProjectPanel/behavior/ghost-entries';
import { ROOT, row } from './browser-fixture';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const commandOf = (entry: ContextMenuEntry): string | undefined => ('command' in entry ? entry.command : undefined);

describe('S2 the menu of a missing link', { tags: ['standard'] }, () => {
  const item = ghostItem(row('sprite', `${ROOT}/sprites/gone.bxsprite`), ROOT, ROOT);

  it('offers locate and remove link beside show users and copy path', () => {
    const commands = ghostEntries(item, { ...EMPTY_STATUS, usedBy: 1 }).map(commandOf);
    expect(commands).toEqual(['asset.locate', 'asset.remove_link', 'asset.show_users', 'asset.copy_path', 'asset.copy_relative_path']);
  });

  it('targets the missing path for the commands', () => {
    const [locate] = ghostEntries(item, EMPTY_STATUS);
    expect(locate && 'args' in locate ? locate.args : undefined).toEqual({ key: item.key, path: item.path });
  });
});
