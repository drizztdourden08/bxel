/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { describeTools, parseToolInput } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { INPUT_EXAMPLES } from './examples';
import { toolOf } from './support/tool-of';

const TILEMAP = 'tlm_4k9m2q7x1v8c';
const LAYER = 'tml_4k9m2q7x1v8c';
const BASE = { documentId: 'doc_4k9m2q7x1v8c', tilemapId: TILEMAP, layerId: LAYER };

const copy = (from: unknown, extra: Record<string, unknown> = {}) => ({
  ...(INPUT_EXAMPLES.apply_edits as object),
  steps: [{ name: 'map.copy', targets: null, options: { tilemap: TILEMAP, layer: { by: 'name', name: 'Ground' }, from, to: { x: 2, y: 1 }, ...extra } }],
});

describe('map cell mask descriptors', () => {
  it('map.copy and map.move take every descriptor of the pixel masks, for cells', () => {
    const descriptors = [
      { by: 'rect', rect: { x: 0, y: 0, width: 3, height: 2 } },
      { by: 'cells', cells: [{ x: 1, y: 1 }] },
      { by: 'wand', x: 2, y: 2 },
      { by: 'wand', x: 2, y: 2, connectivity: 8 },
      { by: 'same', x: 0, y: 0 },
      { by: 'tile', key: 3 },
      { by: 'combine', op: 'subtract', of: [{ by: 'tile', key: 3 }, { by: 'rect', rect: { x: 0, y: 0, width: 1, height: 1 } }] },
    ];
    for (const from of descriptors) expect(parseToolInput(toolOf('apply_edits'), copy(from)).ok).toBe(true);
    const move = { ...copy(descriptors[0]), steps: [{ name: 'map.move', targets: null, options: { tilemap: TILEMAP, layer: { by: 'name', name: 'Ground' }, from: descriptors[5], to: { x: 0, y: 0 } } }] };
    expect(parseToolInput(toolOf('apply_edits'), move).ok).toBe(true);
  });

  it('refuses a pixel style mask, an unknown descriptor and a negative cell', () => {
    const apply = toolOf('apply_edits');
    expect(parseToolInput(apply, copy({ width: 2, height: 2, bits: 'AAAAAA==' })).ok).toBe(false);
    expect(parseToolInput(apply, copy({ by: 'colour', index: 1 })).ok).toBe(false);
    expect(parseToolInput(apply, copy({ by: 'wand', x: -1, y: 0 })).ok).toBe(false);
    expect(parseToolInput(apply, copy({ by: 'combine', op: 'add', of: [{ by: 'tile', key: 1 }] })).ok).toBe(false);
    expect(parseToolInput(apply, copy({ by: 'tile', key: 1 }, { empty: 'erase' })).ok).toBe(false);
  });

  it('read_map_cells takes a rect, a mask or both, and refuses neither', () => {
    const read = toolOf('read_map_cells');
    expect(parseToolInput(read, { ...BASE, rect: { x: 0, y: 0, width: 2, height: 2 } }).ok).toBe(true);
    expect(parseToolInput(read, { ...BASE, mask: { by: 'same', x: 0, y: 0 } }).ok).toBe(true);
    expect(parseToolInput(read, { ...BASE, rect: { x: 0, y: 0, width: 1, height: 1 }, mask: { by: 'tile', key: 2 } }).ok).toBe(true);
    expect(parseToolInput(read, BASE).ok).toBe(false);
  });

  it('shows the descriptor in the tool schema and keeps the read reply optional fields', () => {
    const text = JSON.stringify(describeTools(documentCommands).find((descriptor) => descriptor.name === 'read_map_cells'));
    expect(text).toContain('CellMask');
    expect(text).toContain('"const":"wand"');
    const output = toolOf('read_map_cells').output;
    expect(output.safeParse({ ok: true, revision: 3, selected: { count: 1, bounds: { x: 1, y: 1, width: 1, height: 1 }, cells: [[1, 1, 2, 0]], truncated: false } }).success).toBe(true);
  });
});
