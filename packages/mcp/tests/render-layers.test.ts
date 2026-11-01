/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, parseToolInput } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const tools = buildTools(documentCommands);
const render = tools.find((candidate) => candidate.name === 'render_preview');

const DOCUMENT = 'doc_4k9m2q7x1v8c';
const SPRITE = 'spr_4k9m2q7x1v8c';
const LAYER = 'lay_4k9m2q7x1v8c';
const OTHER_LAYER = 'lay_5k9m2q7x1v8c';
const TILEMAP = 'tlm_4k9m2q7x1v8c';
const MAP_LAYER = 'tml_4k9m2q7x1v8c';
const ANIMATION = 'anm_4k9m2q7x1v8c';

const parse = (input: object): boolean => {
  if (!render) throw new Error('no render_preview');
  return parseToolInput(render, input).ok;
};

describe('K2 render_preview layers filter', { tags: ['critical'] }, () => {
  it('takes the sprite layers to draw with a sprite target', () => {
    expect(parse({ documentId: DOCUMENT, target: { spriteId: SPRITE }, layers: [LAYER, OTHER_LAYER] })).toBe(true);
    expect(parse({ documentId: DOCUMENT, target: { spriteId: SPRITE } })).toBe(true);
  });

  it('takes the map layers to draw with a tilemap target', () => {
    expect(parse({ documentId: DOCUMENT, target: { tilemapId: TILEMAP }, layers: [MAP_LAYER] })).toBe(true);
  });

  it('refuses an empty list, a bad id and a list with a target that has no layers to pick', () => {
    expect(parse({ documentId: DOCUMENT, target: { spriteId: SPRITE }, layers: [] })).toBe(false);
    expect(parse({ documentId: DOCUMENT, target: { spriteId: SPRITE }, layers: ['not a layer'] })).toBe(false);
    expect(parse({ documentId: DOCUMENT, target: { animationId: ANIMATION }, layers: [LAYER] })).toBe(false);
  });
});
