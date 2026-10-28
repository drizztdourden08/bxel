/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { evaluate } from '../../src/ui-context/evaluate';
import { COLUMN_NAMES, columnContext } from './columns';

const MATRIX: readonly (readonly [string, string])[] = [
  ['widget.layers', 'HSSSHSSSSSSH'],
  ['widget.palette', 'HSSSHHSSHSSH'],
  ['widget.timeline', 'HSSSHHSSHSSH'],
  ['widget.options', 'HSSSHHSSSSSH'],
  ['widget.tools', 'HSSSHSSSSSSH'],
  ['widget.canvas', 'HSSSHSSSSSSS'],
  ['widget.sheet', 'HHHHHSHHHHHH'],
  ['widget.tileset', 'HHHHHHHSSSHH'],
  ['widget.project', 'SSSSSSSSSSSS'],
  ['toolbar.tools', 'SSSSHSSSSSSS'],
  ['toolbar.canvas', 'HSSSHSSSSSSS'],
  ['toolbar.options', 'HSSSHHSSSSSH'],
  ['tool.select_pencil', 'DSSSHHSSSSDH'],
  ['tool.select_eraser', 'DSSSHHSSSSDH'],
  ['tool.select_fill', 'DSSSHHSSSSDH'],
  ['tool.select_shape', 'DSSSHHSSSSDH'],
  ['tool.select_picker', 'DSSSHHSSSSSH'],
  ['tool.select_select', 'DSSSHHSSSSSH'],
  ['tool.select_move', 'DSSSHHSSHSDH'],
  ['tool.select_zoom', 'DSSSHSSSSSSS'],
  ['tool.select_hand', 'DSSSHSSSSSSS'],
  ['tool.previous', 'DSSSHHSSSSSH'],
  ['brush.cycle_tip', 'HSSSHHSSHSSH'],
  ['options.open', 'HSSSHHSSSSSH'],
  ['item.back', 'HHHHHHSHHHHH'],
  ['item.mirror-x', 'HSSSHHSSHSSH'],
  ['item.mirror-y', 'HSSSHHSSHSSH'],
  ['item.grid', 'HSSSHHSSSSSS'],
  ['item.gridMajor', 'HSSSHHSSSSSH'],
  ['item.gridTile', 'HSSSHHSSSSSH'],
  ['item.rulers', 'HSSSHHSSSSSH'],
  ['item.guides', 'HSSSHHSSHSSH'],
  ['item.tiled', 'HSSSHHSSHSSH'],
  ['item.onion', 'HHHSHHHHHHHH'],
  ['item.play', 'HHHSHHHHHHHH'],
  ['item.zoom-fit', 'HSSSHSSSSSSS'],
  ['item.zoom-actual', 'HSSSHSSSSSSS'],
  ['item.transform', 'HSSSHHSSHSDH'],
  ['item.tile-mode', 'HHHHHHHHSSHH'],
  ['item.map-collision', 'HHHHHHHSSSHH'],
  ['item.map-terrain', 'HHHHHHHHSHHH'],
  ['item.map-animate', 'HHHHHHHHSHHH'],
  ['file.save', 'DSSSSSSSSSDD'],
  ['file.save_as', 'DSSSSSSSSSSD'],
  ['export.open', 'DSSSSSSSSSSH'],
  ['asset.settings', 'HSSSSSSSSSSH'],
  ['image.import', 'HHHHHHHHHHHS'],
  ['project.settings', 'DDDDDDDDDDDD'],
  ['history.undo', 'DDDDDDDDDDDD'],
  ['selection.select_all', 'DSSSHHSSSSSH'],
  ['selection.copy', 'DDSDHHDDHDDH'],
  ['selection.cut', 'DDSDHHDDHDDH'],
  ['selection.paste', 'DDDDHHDDHDDH'],
  ['selection.delete', 'DDSDHHDDDDDH'],
  ['selection.invert', 'HDSDHHDDHDDH'],
  ['transform.flip_horizontal', 'HSSSHHSSSSDH'],
  ['transform.rotate', 'HSSSHHSSHSDH'],
  ['canvas.size', 'HSSSHHSHHHDH'],
  ['canvas.trim', 'HSSSHHSHHHDH'],
  ['view.zoom_in', 'DSSSHSSSSSSS'],
  ['view.toggle_pixel_grid', 'HSSSHHSSSSSS'],
  ['view.toggle_guides', 'HSSSHHSSHSSH'],
  ['symmetry.toggle_x', 'HSSSHHSSHSSH'],
  ['timeline.add_frame', 'HHHSHHHSHSHH'],
  ['timeline.toggle_onion', 'HHHSHHHHHHHH'],
  ['frame.duplicate', 'HHHHHHHHHHHH'],
  ['sprite.rename', 'HHHHHSHHHHHH'],
  ['sprite.back', 'HHHHHHSHHHHH'],
  ['tilemap.place_tiles', 'HHHHHHHHSSHH'],
  ['tilemap.new_tileset', 'HHHHHHHSSSHH'],
  ['tilemap.flip_x', 'HHHHHHHHSHHH'],
  ['layer.add', 'HSSSHHSSSSDH'],
  ['layer.merge', 'HSSSHHSSSSDH'],
  ['status.cursor', 'HSSSHSSSSSSH'],
  ['status.zoom', 'HSSSHSSSSSSH'],
  ['status.colour-1', 'HSSSHHSSHSSH'],
  ['status.tile', 'HHHHHHHHSHHH'],
  ['status.saved', 'HSSSSSSSSSSH'],
  ['status.help', 'SSSSSSSSSSSS'],
  ['menu.kind.sprite', 'HSSHHHHHHHSH'],
  ['menu.kind.animation', 'HHHSHHHHHHHH'],
  ['menu.kind.palette', 'HHHHSHHHHHHH'],
  ['menu.kind.sheet', 'HHHHHSSHHHHH'],
  ['menu.kind.tileset', 'HHHHHHHSHHHH'],
  ['menu.kind.tilemap', 'HHHHHHHHSSHH'],
  ['menu.kind.image', 'HHHHHHHHHHHS'],
  ['menu.edit.transform', 'HSSSHHSSHSSH'],
  ['menu.layer', 'HSSSHHSSSSSH'],
  ['menu.palette', 'HSSSHHSSHSSH'],
  ['menu.view.zoom', 'DSSSHSSSSSSS'],
  ['menu.view.grid', 'HSSSHHSSSSSS'],
  ['menu.view.symmetry', 'HSSSHHSSHSSH'],
  ['menu.view.tiled', 'HSSSHHSSHSSH'],
];

const MARK = { shown: 'S', disabled: 'D', hidden: 'H' } as const;

describe('the corrected matrix, one column per context', () => {
  it.each(MATRIX)('%s', (id, expected) => {
    const actual = COLUMN_NAMES.map((column) => MARK[evaluate(id, columnContext(column)).state]).join('');
    expect(actual).toBe(expected);
  });

  it('gives every disabled cell a reason and no other cell one', () => {
    for (const [id] of MATRIX) {
      for (const column of COLUMN_NAMES) {
        const ui = evaluate(id, columnContext(column));
        expect(ui.state === 'disabled' ? typeof ui.reason : ui.reason).toBe(ui.state === 'disabled' ? 'string' : null);
      }
    }
  });
});
