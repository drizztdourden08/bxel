/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { PaletteBank, Swatch } from '@bxel/document';
import { decodePng } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { exportBlocker } from '../../src/export/export-blocker';
import { planExport } from '../../src/export/plan-export';
import { addFrame, artworkOf, bytesOf, frozenOf, harness, paint, settingsOf, step, withBank } from './export-harness';

const namesOf = (plan: ReturnType<typeof planExport>): string[] => plan.files.map((file) => file.name);

const colours = (count: number, seed: number): Swatch[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `sw_${seed}_${i}` as Swatch['id'],
    kind: 'color',
    rgb: `#${(seed * 65536 + i + 1).toString(16).padStart(6, '0')}`,
    name: `c${i}`,
  }));

const bankOf = (id: string, count: number, seed: number): PaletteBank => ({
  id: id as PaletteBank['id'],
  name: id,
  cap: 256,
  transparent: true,
  slots: [{ id: `${id}_t` as Swatch['id'], kind: 'transparent' }, ...colours(count, seed)],
  ramps: [],
});

describe('export file names and counts', () => {
  it('writes one PNG named after the sprite for the default settings', () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({}), selectedIds: [] });
    expect(plan.problem).toBeNull();
    expect(namesOf(plan)).toEqual(['sprite.png']);
    expect(plan.files[0]?.detail).toBe('sprite.png, 32 x 32 px');
  });

  it('uses the typed file name and removes an extension and unsafe characters', () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ fileName: 'my:hero.png' }), selectedIds: [] });
    expect(namesOf(plan)).toEqual(['my_hero.png']);
  });

  it('writes one PNG per frame for Frames and numbers them by frame position', () => {
    const h = harness();
    addFrame(h, 80);
    addFrame(h, 80);
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'frames', frames: 'all' }), selectedIds: [] });
    expect(namesOf(plan)).toEqual(['sprite_0.png', 'sprite_1.png', 'sprite_2.png']);
  });

  it('keeps Sprite PNG at one file even when the sprite has many frames', () => {
    const h = harness();
    addFrame(h, 80);
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ frames: 'all' }), selectedIds: [] });
    expect(namesOf(plan)).toEqual(['sprite.png']);
  });

  it('writes a PNG and a JSON file for a sheet and names the button count', () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'sheet', fileName: 'caps' }), selectedIds: [] });
    expect(namesOf(plan)).toEqual(['caps.png', 'caps.json']);
    expect(plan.files[1]?.detail).toBe('caps.json, 1 sprite with names, rectangles, pivots');
  });

});

describe('export targets', () => {
  it('adds the sprite name to every file when several sprites are exported', () => {
    const h = harness();
    const artwork = withBank(artworkOf(h), bankOf('bnk_two', 3, 1), 'second');
    const frozen = { revision: 1, artwork };
    const plan = planExport({ frozen, settings: settingsOf({ sprites: 'all' }), selectedIds: [] });
    expect(namesOf(plan)).toEqual(['Untitled_sprite.png', 'Untitled_second.png']);
    expect(plan.spriteCount).toBe(2);
  });

  it('uses only the selected sprites and reports a missing selection', () => {
    const h = harness();
    const artwork = withBank(artworkOf(h), bankOf('bnk_two', 3, 1), 'second');
    const second = artwork.sprites[1];
    const frozen = { revision: 1, artwork };
    const chosen = planExport({ frozen, settings: settingsOf({ sprites: 'selected' }), selectedIds: second ? [second.id] : [] });
    expect(namesOf(chosen)).toEqual(['second.png']);
    const none = planExport({ frozen, settings: settingsOf({ sprites: 'selected' }), selectedIds: [] });
    expect(none.problem).toBe('No sprites are selected. Choose the current sprite or all sprites.');
  });

  it('exports the frames of a tag and names a tag that does not exist', () => {
    const h = harness();
    addFrame(h, 80);
    addFrame(h, 80);
    step(h, COMMAND_NAME.tagAdd, { name: 'walk', from: { by: 'index', index: 1 }, to: { by: 'index', index: 2 } });
    const frozen = frozenOf(h);
    const tagged = planExport({ frozen, settings: settingsOf({ kind: 'frames', frames: 'tag', tag: 'walk' }), selectedIds: [] });
    expect(namesOf(tagged)).toEqual(['sprite_1.png', 'sprite_2.png']);
    const missing = planExport({ frozen, settings: settingsOf({ kind: 'frames', frames: 'tag', tag: 'run' }), selectedIds: [] });
    expect(missing.problem).toBe('Sprite sprite has no tag named run. Choose another tag or all frames.');
  });

  it('refuses two files with the same name', () => {
    const h = harness();
    const artwork = withBank(artworkOf(h), bankOf('bnk_two', 3, 1), 'a/b');
    const clashing = {
      ...artwork,
      sprites: [...artwork.sprites, ...artwork.sprites.slice(1).map((sprite) => ({ ...sprite, id: `${sprite.id}x` as typeof sprite.id, name: 'a:b' }))],
    };
    const plan = planExport({ frozen: { revision: 1, artwork: clashing }, settings: settingsOf({ sprites: 'all' }), selectedIds: [] });
    expect(plan.problem).toBe('Two files would be named Untitled_a_b.png. Rename a sprite or change the file name.');
  });
});

describe('export scale and limits', () => {
  it('scales by a whole number without blurring', () => {
    const h = harness();
    paint(h, 0, 0, 1);
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ scale: 3 }), selectedIds: [] });
    const file = plan.files[0];
    expect([file?.width, file?.height]).toEqual([96, 96]);
    const decoded = decodePng(file ? bytesOf(file) : new Uint8Array());
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) return;
    expect([decoded.width, decoded.height]).toEqual([96, 96]);
    const at = (x: number, y: number): number[] => Array.from(decoded.data.slice((y * 96 + x) * 4, (y * 96 + x) * 4 + 4));
    expect(at(0, 0)).toEqual([20, 11, 38, 255]);
    expect(at(2, 2)).toEqual([20, 11, 38, 255]);
    expect(at(3, 0)).toEqual([0, 0, 0, 0]);
  });

  it('clamps the scale to 1 to 8', () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ scale: 40 }), selectedIds: [] });
    expect(plan.files[0]?.width).toBe(256);
  });

  it('keeps a GIF within 4096 px', () => {
    const h = harness();
    const artwork = artworkOf(h);
    const large = artwork.sprites.map((sprite) => ({ ...sprite, width: 1024, height: 1024 }));
    const frozen = { revision: 1, artwork: { ...artwork, sprites: large } };
    const plan = planExport({ frozen, settings: settingsOf({ kind: 'animation', scale: 8 }), selectedIds: [] });
    expect(plan.problem).toContain('A GIF can be 4096 px');
  });
});

describe('export colour modes', () => {
  it('offers indexed PNG for sprites that share one palette and keeps their indices', () => {
    const h = harness();
    paint(h, 0, 0, 4);
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ colour: 'indexed' }), selectedIds: [] });
    expect(plan.indexed).toMatchObject({ state: 'available', needsApproval: false });
    expect(plan.problem).toBeNull();
    const bytes = plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array();
    expect(bytes[25]).toBe(3);
    const decoded = decodePng(bytes);
    expect(decoded.ok && Array.from(decoded.data.slice(0, 4))).toEqual([0xb0, 0x2a, 0x9c, 255]);
  });

  it('needs approval for a combined mapping of two palettes', () => {
    const h = harness();
    const artwork = withBank(artworkOf(h), bankOf('bnk_two', 5, 9), 'second');
    const frozen = { revision: 1, artwork };
    const open = settingsOf({ sprites: 'all', colour: 'indexed' });
    const waiting = planExport({ frozen, settings: open, selectedIds: [] });
    expect(waiting.indexed).toMatchObject({ state: 'available', needsApproval: true });
    expect(waiting.problem).toBe('Approve the combined palette to export an indexed PNG.');
    const approved = planExport({ frozen, settings: { ...open, approved: true }, selectedIds: [] });
    expect(approved.problem).toBeNull();
    expect(approved.files).toHaveLength(2);
    for (const file of approved.files) expect(bytesOf(file)[25]).toBe(3);
  });

  it('turns indexed off when the union of colours is over 256', () => {
    const h = harness();
    const artwork = withBank(artworkOf(h), bankOf('bnk_two', 200, 3), 'second');
    const crowded = { ...artwork, banks: artwork.banks.map((bank, i) => (i === 0 ? bankOf('bnk_one', 200, 7) : bank)) };
    const sprites = crowded.sprites.map((sprite, i) => (i === 0 ? { ...sprite, bankId: 'bnk_one' as typeof sprite.bankId } : sprite));
    const frozen = { revision: 1, artwork: { ...crowded, sprites } };
    const plan = planExport({ frozen, settings: settingsOf({ sprites: 'all', colour: 'indexed', approved: true }), selectedIds: [] });
    expect(plan.indexed.state).toBe('unavailable');
    expect(plan.problem).toContain('Indexed PNG is off: the selected sprites use 2 palettes with 401 colours together.');
  });
});

describe('export blockers', () => {
  it('asks for a folder', () => {
    const h = harness();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({ folder: '' }), selectedIds: [] });
    expect(exportBlocker(plan, settingsOf({ folder: '' }))).toBe('Choose a folder to save to.');
    expect(exportBlocker(plan, settingsOf({}))).toBeNull();
  });
});
