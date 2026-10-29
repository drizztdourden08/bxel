/* @layer renderer-app @kind test */
import { NO_FLAGS } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { captureSelection } from '../../src/tilemap/capture-selection';
import { decodeCellClip } from '../../src/tilemap/decode-cell-clip';
import { encodeCellClip } from '../../src/tilemap/encode-cell-clip';
import { orientStamp } from '../../src/tilemap/orient-stamp';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { selectCells } from '../../src/tilemap/select-cells';
import { cellsNow } from './map-harness';
import { freshMap, stampAt, store } from './map-selection-harness';

beforeEach(freshMap);

describe('capturing a stamp from cells', () => {
  it('takes the selected cells with their turns and places them identically', () => {
    stampAt({ columns: 2, rows: 2, keys: [1, 2, 2, 1], bits: [2, 5, 0, 4] }, { x: 0, y: 0 });
    selectCells({ by: 'rect', rect: { x: 0, y: 0, width: 2, height: 2 } }, 'replace');
    const before = cellsNow().filter((cell) => cell !== 0);
    expect(captureSelection()).toBe(true);
    expect(store().stamp).toMatchObject({ columns: 2, rows: 2, keys: [1, 2, 2, 1], bits: [2, 5, 0, 4] });
    expect(store().flags).toEqual(NO_FLAGS);
    placeStampAt([{ x: 2, y: 1 }]);
    const cells = cellsNow();
    expect([cells[4 + 2], cells[4 + 3], cells[8 + 2], cells[8 + 3]]).toEqual([cells[0], cells[1], cells[4], cells[5]]);
    expect(cells.filter((cell) => cell !== 0)).toHaveLength(before.length * 2);
  });

  it('turns the turns of a captured stamp with the stamp', () => {
    const flipped = orientStamp({ columns: 2, rows: 1, keys: [1, 2], bits: [0, 1] }, { flipX: true, flipY: false, diagonal: false });
    expect(flipped).toEqual({ columns: 2, rows: 1, keys: [2, 1], bits: [0, 1] });
    const turned = orientStamp({ columns: 2, rows: 1, keys: [1, 2], bits: [0, 0] }, { flipX: false, flipY: false, diagonal: true });
    expect(turned.columns).toBe(1);
    expect(turned.rows).toBe(2);
    expect(turned.bits).toEqual([4, 4]);
  });
});

describe('the cell clip on the system clipboard', () => {
  it('survives a round trip and refuses damaged data', () => {
    const clip = { stamp: { columns: 2, rows: 1, keys: [1, 2], bits: [0, 5] }, origin: { x: 3, y: 4 }, tilesetId: 'tls_x' as never };
    expect(decodeCellClip(encodeCellClip(clip))).toEqual(clip);
    expect(decodeCellClip(new TextEncoder().encode('{"v":1}'))).toBeNull();
    expect(decodeCellClip(new TextEncoder().encode('not json'))).toBeNull();
    expect(decodeCellClip(new TextEncoder().encode(JSON.stringify({ v: 1, tileset: 'a', columns: 2, rows: 1, x: 0, y: 0, keys: [1] })))).toBeNull();
  });
});
