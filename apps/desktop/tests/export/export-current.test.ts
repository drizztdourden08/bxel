/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { decodePng, readBxelSheetJson } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import { NO_CURRENT } from '../../src/editor/current-pick.constants';
import { planExport } from '../../src/export/plan-export';
import { previewPng } from '../../src/files/preview-png';
import { artworkOf, bytesOf, frozenOf, harness, settingsOf, step, textOf, threeFrames, withBank } from './export-harness';
import type { ExportHarness } from './export-harness';

const frameId = (h: ExportHarness, index: number) => {
  const frame = artworkOf(h).sprites[0]?.frames[index];
  if (!frame) throw new Error('the frame is missing');
  return frame.id;
};

const opaqueColumns = (bytes: Uint8Array): number[] => {
  const decoded = decodePng(bytes);
  if (!decoded.ok) throw new Error('the image cannot be read');
  return Array.from({ length: 8 }, (_, x) => x).filter((x) => (decoded.data[x * 4 + 3] ?? 0) > 0);
};

describe('export of the current frame', () => {
  it('writes frame 1 when no frame is passed', () => {
    const h = threeFrames();
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({}), selectedIds: [] });
    expect(opaqueColumns(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array())).toEqual([1]);
  });

  it('writes the frame the timeline is on for a sprite export', () => {
    const h = threeFrames();
    const current = { spriteId: null, frameId: frameId(h, 2) };
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({}), selectedIds: [], current });
    expect(opaqueColumns(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array())).toEqual([3]);
  });

  it('writes the frame the timeline is on for the Frames choice Current', () => {
    const h = threeFrames();
    const current = { spriteId: null, frameId: frameId(h, 1) };
    const settings = settingsOf({ kind: 'frames', frames: 'current' });
    const plan = planExport({ frozen: frozenOf(h), settings, selectedIds: [], current });
    expect(plan.files).toHaveLength(1);
    expect(opaqueColumns(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array())).toEqual([2]);
  });

  it('still writes every frame for All and falls back to frame 1 for a frame of another sprite', () => {
    const h = threeFrames();
    const all = planExport({ frozen: frozenOf(h), settings: settingsOf({ kind: 'frames', frames: 'all' }), selectedIds: [] });
    expect(all.files).toHaveLength(3);
    const stray = { spriteId: null, frameId: 'frm_999999' as ReturnType<typeof frameId> };
    const plan = planExport({ frozen: frozenOf(h), settings: settingsOf({}), selectedIds: [], current: stray });
    expect(opaqueColumns(plan.files[0] ? bytesOf(plan.files[0]) : new Uint8Array())).toEqual([1]);
  });

  it('exports the sprite the timeline is on for the choice Current sprite', () => {
    const h = harness();
    const bank = artworkOf(h).banks[0];
    if (!bank) throw new Error('the document has no bank');
    const second = withBank(artworkOf(h), bank, 'second');
    const picked = second.sprites[1]?.id ?? null;
    const frozen = { revision: 1, artwork: second };
    const fallback = planExport({ frozen, settings: settingsOf({}), selectedIds: [] });
    const plan = planExport({ frozen, settings: settingsOf({}), selectedIds: [], current: { spriteId: picked, frameId: null } });
    expect(fallback.files.map((file) => file.name)).toEqual(['sprite.png']);
    expect(plan.files.map((file) => file.name)).toEqual(['second.png']);
  });
});

describe('the file preview of the current frame', () => {
  it('uses frame 1 without a current frame and the timeline frame with one', () => {
    const h = threeFrames();
    const artwork = artworkOf(h);
    const first = previewPng(artwork);
    expect(first).not.toBeNull();
    expect(previewPng(artwork, NO_CURRENT)).toEqual(first);
    expect(previewPng(artwork, { spriteId: null, frameId: frameId(h, 0) })).toEqual(first);
    const third = previewPng(artwork, { spriteId: null, frameId: frameId(h, 2) });
    expect(third).not.toBeNull();
    expect(third).not.toEqual(first);
  });
});

describe('tag colour in the sheet export', () => {
  const tagged = (colour: string | undefined): ExportHarness => {
    const h = threeFrames();
    const options = { name: 'run', from: { by: 'index', index: 0 }, to: { by: 'index', index: 2 }, ...(colour ? { colour } : {}) };
    step(h, COMMAND_NAME.tagAdd, options);
    return h;
  };

  it('carries the colour in the Bxel sheet JSON', () => {
    const plan = planExport({ frozen: frozenOf(tagged('#3b82f6')), settings: settingsOf({ kind: 'sheet', frames: 'all', flavour: 'bxel' }), selectedIds: [] });
    const json = plan.files[1];
    const read = readBxelSheetJson(json ? textOf(json) : '');
    expect(read.ok && read.metadata.sprites[0]?.tags[0]?.colour).toBe('#3b82f6');
  });

  it('carries the colour in the frameTags of the hash sheet JSON', () => {
    const plan = planExport({ frozen: frozenOf(tagged('#3b82f6')), settings: settingsOf({ kind: 'sheet', frames: 'all', flavour: 'hash' }), selectedIds: [] });
    const json = plan.files[1];
    expect(json ? textOf(json) : '').toContain('"color": "#3b82f6ff"');
  });

  it('keeps the old default colour for a tag with none', () => {
    const plan = planExport({ frozen: frozenOf(tagged(undefined)), settings: settingsOf({ kind: 'sheet', frames: 'all', flavour: 'hash' }), selectedIds: [] });
    const json = plan.files[1];
    expect(json ? textOf(json) : '').toContain('"color": "#000000ff"');
  });
});
