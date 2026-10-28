/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { COLUMN_NAMES, columnContext } from './columns';

describe('the context derived from the stores', () => {
  it('names the file type from the active tab, not from the sprite mode', () => {
    expect(columnContext('N').fileType).toBe('none');
    expect(columnContext('Sp').fileType).toBe('sprite');
    expect(columnContext('An').fileType).toBe('animation');
    expect(columnContext('Pa').fileType).toBe('palette');
    expect(columnContext('Sh').fileType).toBe('sheet');
    expect(columnContext('Ts').fileType).toBe('tileset');
    expect(columnContext('Tm').fileType).toBe('tilemap');
    expect(columnContext('Im').fileType).toBe('image');
  });

  it('puts every file type on the stage it draws', () => {
    const surfaces = COLUMN_NAMES.map((column) => columnContext(column).surface);
    expect(surfaces).toEqual(['none', 'pixel', 'pixel', 'pixel', 'palette', 'sheet', 'pixel', 'pixel', 'map', 'pixel', 'pixel', 'preview']);
  });

  it('sets the edit target from what the stage edits', () => {
    expect(columnContext('Sp').editTarget).toBe('sprite');
    expect(columnContext('An').editTarget).toBe('frame');
    expect(columnContext('Si').editTarget).toBe('sheetSprite');
    expect(columnContext('Ts').editTarget).toBe('tile');
    expect(columnContext('Te').editTarget).toBe('tile');
    expect(columnContext('Tm').editTarget).toBe('none');
    expect(columnContext('Pa').editTarget).toBe('none');
  });

  it('opens a tileset in Edit Tile whatever the tile store says and keeps Place for a tilemap', () => {
    expect(columnContext('Ts', { tileEdit: 'place' }).tileMode).toBe('edit');
    expect(columnContext('Ts', { tileEdit: 'place' }).surface).toBe('pixel');
    expect(columnContext('Tm').tileMode).toBe('place');
    expect(columnContext('Te').tileMode).toBe('edit');
    expect(columnContext('Sp').tileMode).toBeNull();
  });

  it('reads the selection that the stage can hold', () => {
    expect(columnContext('Sp').selection).toBe('none');
    expect(columnContext('Se').selection).toBe('pixels');
    expect(columnContext('An').selection).toBe('frames');
    expect(columnContext('Tm', { cellSelection: true }).selection).toBe('cells');
    expect(columnContext('Sh', { spriteSelection: 2 }).selection).toBe('sprites');
    expect(columnContext('Pa', { pixelSelection: true }).selection).toBe('none');
  });

  it('treats an image preview as read only and with nothing to undo', () => {
    const image = columnContext('Im', { canUndo: true, pixelSelection: true, readOnly: false });
    expect(image.readOnly).toBe(true);
    expect(image.canUndo).toBe(false);
    expect(image.selection).toBe('none');
  });

  it('ignores a document that is not in front when an image tab is', () => {
    const context = columnContext('Im', { tabKind: 'sprite', clipboard: 'pixels', pending: true });
    expect(context.fileType).toBe('image');
    expect(context.clipboard).toBe('none');
    expect(context.pending).toBe(false);
  });

  it('is frozen so a consumer cannot change it', () => {
    expect(Object.isFrozen(columnContext('Sp'))).toBe(true);
  });

  it('carries animated tiles only for the tile files', () => {
    expect(columnContext('Ts', { animatedTile: true }).animatedTile).toBe(true);
    expect(columnContext('Sp', { animatedTile: true }).animatedTile).toBe(false);
  });
});
