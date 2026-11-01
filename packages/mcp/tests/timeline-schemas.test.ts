/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, checkGrant, MCP_ERROR_CODE, parseToolInput, PRESETS } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { APP_OUTPUT_EXAMPLES } from './app-examples';
import { ASSET_OUTPUT_EXAMPLES } from './asset-examples';

const tools = buildTools(documentCommands);
const tool = (name: string) => {
  const found = tools.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`no tool ${name}`);
  return found;
};

const FRAME = 'afr_4k9m2q7x1v8c';
const OTHER = 'afr_5k9m2q7x1v8c';
const TAG = 'tag_4k9m2q7x1v8c';
const DOCUMENT = 'doc_4k9m2q7x1v8c';
const ANIMATION = 'anm_4k9m2q7x1v8c';

const setView = (timeline: unknown) => parseToolInput(tool('set_view'), { timeline }).ok;

describe('K2 set_view timeline', { tags: ['critical'] }, () => {
  it('accepts the playhead, the pick, every kind of range and the play settings', () => {
    expect(setView({ frameId: FRAME, pickedFrameIds: [FRAME, OTHER], playing: false, playMode: 'pingpong', speed: 0.5, zoom: 'fit', timeMode: true, units: 'ticks' })).toBe(true);
    for (const range of [{ kind: 'whole' }, { kind: 'picked' }, { kind: 'tag', tagId: TAG }, { kind: 'loop', from: FRAME, to: OTHER }]) expect(setView({ range }), range.kind).toBe(true);
  });

  it('accepts the onion fields and nothing outside their limits', () => {
    const onion = { on: true, before: 2, after: 2, wrap: true, opacity: 40, tint: 'grey', beforeColour: '#e04848', style: 'outline', position: 'front' };
    expect(setView({ onion })).toBe(true);
    for (const bad of [{ before: 9 }, { after: -1 }, { opacity: 4 }, { tint: 'red' }, { beforeColour: 'red' }, { extra: true }]) expect(setView({ onion: bad }), JSON.stringify(bad)).toBe(false);
  });

  it('refuses unknown fields, bad ranges, speeds and zoom', () => {
    expect(setView({ playMode: 'bounce' })).toBe(false);
    expect(setView({ speed: 3 })).toBe(false);
    expect(setView({ zoom: 8 })).toBe(false);
    expect(setView({ range: { kind: 'tag' } })).toBe(false);
    expect(setView({ range: { kind: 'loop', from: FRAME } })).toBe(false);
    expect(setView({ unknown: 1 })).toBe(false);
    expect(setView({ frameId: 'nope' })).toBe(false);
  });

  it('is a show effect: allowed at Read level, while the state fields still are not', () => {
    const grant = PRESETS.edit_documents.grant;
    expect(checkGrant('set_view', { timeline: { frameId: FRAME, onion: { on: true, before: 2, after: 2 } } }, grant)).toBeNull();
    expect(checkGrant('set_view', { timeline: { playing: true }, tool: { id: 'pencil' } }, grant)?.error.code).toBe(MCP_ERROR_CODE.READ_LEVEL);
  });
});

describe('K2 get_view timeline', { tags: ['critical'] }, () => {
  it('has the timeline block in its output and requires it', () => {
    const view = tool('get_view');
    const example = APP_OUTPUT_EXAMPLES.get_view as Record<string, unknown>;
    expect(view.output.safeParse(example).success).toBe(true);
    const without = Object.fromEntries(Object.entries(example).filter(([key]) => key !== 'timeline'));
    expect(view.output.safeParse(without).success).toBe(false);
  });

  it('refuses a timeline with a bad play mode or onion count', () => {
    const view = tool('get_view');
    const example = APP_OUTPUT_EXAMPLES.get_view as { timeline: Record<string, unknown> };
    expect(view.output.safeParse({ ...example, timeline: { ...example.timeline, playMode: 'bounce' } }).success).toBe(false);
    expect(view.output.safeParse({ ...example, timeline: { ...example.timeline, animationId: null, frameId: null } }).success).toBe(true);
  });
});

describe('K2 get_animation and render_preview additions', { tags: ['critical'] }, () => {
  it('lists the play order, the totals and the facing map in the get_animation output', () => {
    const animation = tool('get_animation');
    const example = ASSET_OUTPUT_EXAMPLES.get_animation as { plays: object[]; facings: object };
    expect(animation.output.safeParse(example).success).toBe(true);
    expect(animation.output.safeParse({ ...example, plays: [{ tagId: null }] }).success).toBe(false);
  });

  it('takes a facing, allFacings, onion and animated on render_preview', () => {
    const render = (extra: object, target: object = {}) => parseToolInput(tool('render_preview'), { documentId: DOCUMENT, target: { animationId: ANIMATION, ...target }, ...extra }).ok;
    expect(render({}, { facing: 'e' })).toBe(true);
    expect(render({}, { allFacings: true })).toBe(true);
    expect(render({ onion: true }, { frameId: FRAME })).toBe(true);
    expect(render({ animated: 'gif' }, { tagId: TAG })).toBe(true);
    expect(render({ animated: 'apng' })).toBe(true);
    expect(render({ animated: 'webp' })).toBe(false);
    expect(render({}, { facing: 'x' })).toBe(false);
    expect(render({}, { facing: 'e', tagId: TAG })).toBe(false);
    expect(render({}, { allFacings: true, frameId: FRAME })).toBe(false);
  });
});
