/* @layer renderer-app @kind test */
import type { SheetId, SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { MANIFEST } from '../../src/assistant/command-manifest/manifest.constants';
import { ANIMATION_ENTRY_COMMANDS } from '../../src/keymap/animation-entry-commands.constants';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { entryUsedBy } from '../../src/sheet-manager/entry-used-by';
import { removeEntries } from '../../src/sheet-manager/remove-entries';
import { SHEET_TEXT } from '../../src/sheet-manager/sheet-text.constants';
import type { UsageSource } from '../../src/sheet-manager/usage-source.type';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { artwork, idOf, openFile } from '../sheet/sheet-harness';

describe('K1 the sheet entry columns', { tags: ['critical'] }, () => {
  it('names the animations, tilesets and other sheets that use an asset', () => {
    const s1 = 's1' as SpriteId;
    const s2 = 's2' as SpriteId;
    const art: UsageSource = {
      animations: [{ name: 'Walk', frames: [{ spriteId: s1 }, { spriteId: null }] }],
      tilesets: [{ name: 'Ground', tiles: [{ spriteId: s1 }] }],
      sheets: [
        { id: 'a' as SheetId, name: 'Main', entries: [{ spriteId: s1 }] },
        { id: 'b' as SheetId, name: 'Other', entries: [{ spriteId: s1 }, { spriteId: s2 }] },
      ],
    };
    const used = entryUsedBy(art, 'a');
    expect(used.get('s1')).toBe('Walk, Ground, Other');
    expect(used.get('s2')).toBe('Other');
    expect(used.has('s3')).toBe(false);
  });
});

describe('K2 the animation entry actions', { tags: ['standard'] }, () => {
  it('registers every action as a command and in the assistant manifest', () => {
    const ids = ANIMATION_ENTRY_COMMANDS.map((command) => command.id);
    expect(ids).toEqual(['sprite.open_in_timeline', 'sprite.copy_animation_for_sheet', 'sprite.place_animation_frames', 'sprite.rows_per_tag']);
    const listed = new Set(Object.keys(MANIFEST));
    for (const id of ids) expect(listed.has(id)).toBe(true);
  });
});

describe('K3 the sheet live notices', { tags: ['standard'] }, () => {
  beforeEach(() => {
    openFile(['walk_1', 'walk_2'], 8);
  });

  it('announces what was added and what was removed', () => {
    const ids = [idOf('walk_1'), idOf('walk_2')];
    expect(addToSheet(ids, null)).toBe(true);
    expect(useNoticeStore.getState().notice?.text).toBe(SHEET_TEXT.live.added(2));
    const sheetId = artwork().sheets[0]?.id ?? null;
    expect(removeEntries(ids, [], sheetId)).toBe(true);
    expect(useNoticeStore.getState().notice?.text).toBe(SHEET_TEXT.live.removed(2));
  });
});
