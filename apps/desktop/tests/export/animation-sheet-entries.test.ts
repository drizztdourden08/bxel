/* @layer renderer-app @kind test */
import { readBxelSheetJson } from '@bxel/formats';
import type { Artwork, Sheet, SheetId } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { planExport } from '../../src/export/plan-export';
import { walkWorld } from './animation-harness';
import { artworkOf, settingsOf, textOf } from './export-harness';

const withSheet = (artwork: Artwork, entries: Sheet['animationEntries']): Artwork => {
  const sheet: Sheet = {
    id: 'sht_000900' as SheetId,
    name: 'Characters',
    layout: { kind: 'packed', maxWidth: 64 },
    spacing: { x: 1, y: 1 },
    margin: 0,
    entries: [],
    ...(entries ? { animationEntries: entries } : {}),
  };
  return { ...artwork, sheets: [...artwork.sheets, sheet] };
};

describe('sheets that hold animation entries', () => {
  it('exports the whole animation and one tag of it', () => {
    const world = walkWorld();
    const artwork = artworkOf(world);
    const animation = artwork.animations[0];
    const east = animation?.tags.find((tag) => tag.kind === 'span' && tag.facing === 'e');
    const west = animation?.tags.find((tag) => tag.kind === 'mirror' && tag.facing === 'w');
    if (!animation || !east || !west) throw new Error('the walk is missing');
    const held = withSheet(artwork, [
      { animationId: animation.id, tagId: null, at: { x: 0, y: 0 } },
      { animationId: animation.id, tagId: west.id, at: { x: 0, y: 0 } },
    ]);
    const plan = planExport({
      frozen: { revision: 1, artwork: held },
      settings: settingsOf({ kind: 'sheet', sprites: 'sheet', sheetId: 'sht_000900', flavour: 'bxel', layout: 'packed' }),
      selectedIds: [],
    });
    expect(plan.problem).toBeNull();
    expect(plan.files.map((file) => file.name)).toEqual(['Characters.png', 'Characters.json']);
    const json = plan.files[1];
    const metadata = json ? readBxelSheetJson(textOf(json)) : null;
    if (!metadata?.ok) throw new Error('the sheet cannot be read');
    expect(metadata.metadata.sprites.map((sprite) => [sprite.name, sprite.frames.length])).toEqual([
      ['walk', 16],
      ['walk_walk_w', 2],
    ]);
    expect(metadata.metadata.sprites[1]?.tags[0]).toMatchObject({ name: 'walk_w', from: 0, to: 1, facing: 'w', mirrorOf: 'walk_e', flip: 'x' });
  });

  it('refuses indexed PNG for a sheet that holds animations', () => {
    const world = walkWorld();
    const artwork = artworkOf(world);
    const animation = artwork.animations[0];
    if (!animation) throw new Error('the walk is missing');
    const held = withSheet(artwork, [{ animationId: animation.id, tagId: null, at: { x: 0, y: 0 } }]);
    const plan = planExport({
      frozen: { revision: 1, artwork: held },
      settings: settingsOf({ kind: 'sheet', sprites: 'sheet', sheetId: 'sht_000900', colour: 'indexed' }),
      selectedIds: [],
    });
    expect(plan.problem).toMatch(/holds animations/u);
  });
});
