/* @layer renderer-app @kind test */
import type { BankId, SpriteId } from '@bxel/document';
import type { AssetDefaults } from '@bxel/project';
import type { DroppedFile, DroppedFiles } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DragAsset } from '../../src/asset-drag/asset-drag.type';
import { CANVAS_DROP_TEXT } from '../../src/canvas-drop/canvas-drop.constants';
import { canDropOnCanvas } from '../../src/canvas-drop/can-drop-on-canvas';
import { dropOnSprite } from '../../src/canvas-drop/drop-on-sprite';
import { useNoticeStore } from '../../src/stores/useNoticeStore';

const held = vi.hoisted(() => ({ image: vi.fn(), palette: vi.fn(), swap: vi.fn() }));

vi.mock('../../src/image-import/drop-image', () => ({ dropImage: held.image }));
vi.mock('../../src/file-ops/drop-palette', () => ({ dropPalette: held.palette }));
vi.mock('../../src/palette-change/start-switch', () => ({ startSwitch: held.swap }));

const defaults: AssetDefaults = {
  size: { width: 16, height: 16 },
  colorLimit: 16,
  palette: { kind: 'preset', presetId: 'pico-8' },
  platformId: null,
  platformStrict: false,
  transparent: true,
  frameDurationMs: 100,
  pixelGrid: { width: 1, height: 1 },
};

const dropped = (name: string, type = ''): DroppedFile => ({ file: new File([], name, { type }), name, path: null, kind: 'file' });

const files = (...each: DroppedFile[]): DroppedFiles => ({ files: each, rejected: [] });

const palette = (assetId: string | null): DragAsset => ({ id: 'a', kind: 'palette', assetId, path: 'p.bxpalette' });

const sprite = 'spr-1' as SpriteId;

describe('K1 the sprite canvas as a drop target', { tags: ['critical'] }, () => {
  beforeEach(() => {
    held.image.mockClear();
    held.palette.mockClear();
    held.swap.mockClear();
    useNoticeStore.setState({ notice: null });
  });

  it('accepts a picture or a palette file and refuses other files', () => {
    expect(canDropOnCanvas(files(dropped('hero.png', 'image/png')), () => false)).toBe(true);
    expect(canDropOnCanvas(files(dropped('warm.gpl')), () => false)).toBe(true);
    expect(canDropOnCanvas(files(dropped('notes.txt')), () => false)).toBe(false);
  });

  it('accepts a palette from the project browser only when the file uses it', () => {
    expect(canDropOnCanvas([palette('bank-1')], (id) => id === 'bank-1')).toBe(true);
    expect(canDropOnCanvas([palette('bank-2')], (id) => id === 'bank-1')).toBe(false);
    expect(canDropOnCanvas([palette(null)], () => true)).toBe(false);
  });

  it('opens the import wizard for a dropped picture', () => {
    dropOnSprite(files(dropped('hero.png', 'image/png')), { spriteId: sprite, readOnly: false }, defaults);
    expect(held.image).toHaveBeenCalledTimes(1);
    expect(held.palette).not.toHaveBeenCalled();
  });

  it('adds a dropped palette file to the project', () => {
    dropOnSprite(files(dropped('warm.gpl')), { spriteId: sprite, readOnly: false }, defaults);
    expect(held.palette).toHaveBeenCalledTimes(1);
    expect(held.image).not.toHaveBeenCalled();
  });

  it('starts the palette change for a palette dragged from the project browser', () => {
    dropOnSprite([palette('bank-1')], { spriteId: sprite, readOnly: false }, defaults);
    expect(held.swap).toHaveBeenCalledWith(sprite, 'bank-1' as BankId);
  });

  it('says why a palette cannot change a file that is open for viewing', () => {
    dropOnSprite([palette('bank-1')], { spriteId: sprite, readOnly: true }, defaults);
    expect(held.swap).not.toHaveBeenCalled();
    expect(useNoticeStore.getState().notice?.text).toBe(CANVAS_DROP_TEXT.readOnly);
  });
});
