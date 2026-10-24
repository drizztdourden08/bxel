/* @layer renderer-app @kind test */
import type { RecentDocument } from '@drizztdourden08/brock-core';
import type { MenuItem } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { fileMenu } from '../../src/files/file-menu';
import type { FileAction, FileOutcome } from '../../src/files/files.type';
import { isArtworkPath } from '../../src/files/is-artwork-path';
import { recentMenuItem } from '../../src/files/recent-menu-item';
import { recordsRecent } from '../../src/files/records-recent';

const entry = (path: string, name: string): RecentDocument => ({ path, name, lastOpened: 1 });

const actions = () => {
  const opened: string[] = [];
  let cleared = 0;
  return {
    opened,
    cleared: () => cleared,
    handlers: {
      open: (path: string) => {
        opened.push(path);
      },
      clear: () => {
        cleared += 1;
      },
    },
  };
};

const childrenOf = (item: MenuItem): readonly (MenuItem | 'separator')[] => item.children ?? [];

describe('open recent menu', () => {
  it('lists the recent files, newest first, with the path as the description', () => {
    const { handlers } = actions();
    const item = recentMenuItem([entry('C:\\art\\b.bxel', 'b.bxel'), entry('C:\\art\\a.bxel', 'a.bxel')], handlers);
    expect(item.label).toBe('Open recent');
    const rows = childrenOf(item).filter((child): child is MenuItem => child !== 'separator');
    expect(rows.map((row) => row.label)).toEqual(['b.bxel', 'a.bxel', 'Clear recent files']);
    expect(rows[0]?.description).toBe('C:\\art\\b.bxel');
  });

  it('opens the chosen path and clears the list on request', () => {
    const { handlers, opened, cleared } = actions();
    const item = recentMenuItem([entry('C:\\art\\a.bxel', 'a.bxel')], handlers);
    const rows = childrenOf(item).filter((child): child is MenuItem => child !== 'separator');
    rows[0]?.onClick?.();
    rows[1]?.onClick?.();
    expect(opened).toEqual(['C:\\art\\a.bxel']);
    expect(cleared()).toBe(1);
  });

  it('shows a disabled line when there is nothing recent', () => {
    const { handlers } = actions();
    const [only] = childrenOf(recentMenuItem([], handlers));
    expect(only).toMatchObject({ label: 'No recent files', disabled: true });
  });

  it('leaves out files that are not Bxel files, such as exported images', () => {
    const { handlers } = actions();
    const item = recentMenuItem([entry('C:\\art\\hero.png', 'hero.png'), entry('C:\\art\\HERO.BXEL', 'HERO.BXEL')], handlers);
    const labels = childrenOf(item).flatMap((child) => (child === 'separator' ? [] : [child.label]));
    expect(labels).toEqual(['HERO.BXEL', 'Clear recent files']);
    expect(isArtworkPath('C:\\art\\hero.png')).toBe(false);
  });

  it('sits under File right after Open', () => {
    const { handlers } = actions();
    const [file] = fileMenu(recentMenuItem([], handlers), 'Asset settings...');
    const keys = file !== undefined && file !== 'separator' ? (file.children ?? []).map((child) => (child === 'separator' ? child : child.key)) : [];
    expect(keys.slice(1, 4)).toEqual(['file-open', 'file-open-recent', 'file-save']);
  });
});

describe('recent list updates', () => {
  const done: FileOutcome = { kind: 'done', path: 'C:\\art\\a.bxel', notice: null };
  const kinds: readonly FileAction[] = [{ kind: 'open' }, { kind: 'openPath', path: 'C:\\art\\a.bxel' }, { kind: 'save' }, { kind: 'saveAs' }];

  it('refreshes after every successful open and save', () => {
    for (const action of kinds) expect(recordsRecent(action, done)).toBe(true);
  });

  it('does not refresh after a cancel or a failure', () => {
    for (const action of kinds) {
      expect(recordsRecent(action, { kind: 'cancelled' })).toBe(false);
      expect(recordsRecent(action, { kind: 'failed', message: 'No' })).toBe(false);
    }
  });
});
