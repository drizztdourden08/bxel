/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { addTag } from '../../src/timeline/add-tag';
import { timelineMenuEntries } from '../../src/views/TimelinePanel/behavior/timeline-menu-entries';
import { TIMELINE_PANEL_TEXT } from '../../src/views/TimelinePanel/TimelinePanel.constants';
import { TIMELINE_MENU } from '../../src/views/TimelinePanel/behavior/timeline-menu.constants';
import { animationOf, frameAt, freshAnimation, pickRange, run, withFrames } from './timeline-harness';

class FakeElement {
  readonly selectors: readonly string[];
  readonly dataset: Record<string, string>;

  constructor(selectors: readonly string[], dataset: Record<string, string> = {}) {
    this.selectors = selectors;
    this.dataset = dataset;
  }

  closest(selector: string): FakeElement | null {
    return this.selectors.includes(selector) ? this : null;
  }

  getBoundingClientRect(): { left: number } {
    return { left: 0 };
  }
}

beforeAll(() => {
  vi.stubGlobal('Element', FakeElement);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  freshAnimation();
});

const contextOf = (target: unknown, x: number): ContextMenuContext => ({ target, point: { x, y: 0 }, trigger: 'pointer', data: null }) as ContextMenuContext;

const menuFor = (target: FakeElement, x = 0): readonly ContextMenuEntry[] =>
  timelineMenuEntries(contextOf(target, x));

const topLevel = (entries: readonly ContextMenuEntry[]): ContextMenuEntry[] => entries.filter((entry) => entry !== 'separator');

const labelOf = (entry: ContextMenuEntry): string => (typeof entry === 'object' && 'label' in entry && typeof entry.label === 'string' ? entry.label : '');

const labels = (entries: readonly ContextMenuEntry[]): string[] => topLevel(entries).map(labelOf);

const submenu = (entries: readonly ContextMenuEntry[], label: string): string[] => {
  const found = entries.find((entry) => labelOf(entry) === label);
  return found && typeof found === 'object' && 'items' in found ? found.items.map(labelOf) : [];
};

const withDirections = (): void => {
  const animation = animationOf().id;
  run('Directions', [{ name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'eight' } }]);
};

const EMPTY_LABELS = [
  TIMELINE_MENU.addFrame,
  TIMELINE_MENU.addFrom,
  TIMELINE_MENU.paste,
  TIMELINE_MENU.selectAll,
  TIMELINE_MENU.onion,
  TIMELINE_MENU.timeMode,
  TIMELINE_MENU.zoom,
  TIMELINE_MENU.transform,
];

describe('S2 the menu of the ruler', { tags: ['standard'] }, () => {
  it('offers play, the loop range, units and the onion settings', () => {
    withFrames(3);
    const entries = menuFor(new FakeElement([TIMELINE_MENU.ruler]));
    expect(labels(entries)).toEqual([TIMELINE_MENU.playFrom, TIMELINE_MENU.setLoopRange, TIMELINE_MENU.clearLoopRange, TIMELINE_MENU.units, TIMELINE_MENU.onionSettings]);
    const { unitNames } = TIMELINE_PANEL_TEXT;
    expect(submenu(entries, TIMELINE_MENU.units)).toEqual([unitNames.ms, unitNames.seconds, unitNames.ticks]);
  });

  it('plays from the frame under the pointer', () => {
    withFrames(3);
    const entries = menuFor(new FakeElement([TIMELINE_MENU.ruler], { lefts: '10,20,30' }), 25);
    const play = entries.find((entry) => typeof entry === 'object' && 'command' in entry && entry.command === 'timeline.play_from');
    expect(play).toMatchObject({ args: { frameId: frameAt(1) } });
  });

  it('keeps the clear loop range entry disabled until a loop range is set', () => {
    withFrames(3);
    const clear = menuFor(new FakeElement([TIMELINE_MENU.ruler])).find((entry) => labelOf(entry) === TIMELINE_MENU.clearLoopRange);
    expect(clear).toMatchObject({ disabled: true });
  });
});

describe('S2 the menu of a tag', { tags: ['standard'] }, () => {
  it('offers the span tag entries and a delete after a separator', () => {
    withFrames(4);
    pickRange(0, 1);
    addTag();
    const tagId = animationOf().tags[0]?.id ?? '';
    const entries = menuFor(new FakeElement([TIMELINE_MENU.tag], { tagId }));
    expect(labels(entries)).toEqual([
      TIMELINE_MENU.playTag,
      TIMELINE_MENU.playOnce,
      TIMELINE_MENU.selectTagFrames,
      TIMELINE_MENU.editTag,
      TIMELINE_MENU.loopMode,
      TIMELINE_MENU.repeat,
      TIMELINE_MENU.facing,
      TIMELINE_MENU.colour,
      TIMELINE_MENU.setRange,
      TIMELINE_MENU.makeMirror,
      TIMELINE_MENU.deleteTag,
    ]);
    expect(entries.at(-2)).toBe('separator');
    expect(topLevel(entries).length).toBeLessThanOrEqual(12);
  });

  it('offers a mirror tag only what it can do', () => {
    withFrames(3);
    pickRange(0, 1);
    addTag();
    const animation = animationOf().id;
    const source = animationOf().tags[0]?.id;
    run('Mirror', [
      { name: COMMAND_NAME.animationUpdate, targets: null, options: { animation, directions: 'eight' } },
      { name: COMMAND_NAME.animationTagUpdate, targets: null, options: { animation, tag: { by: 'id', id: source }, facing: 'e' } },
      { name: COMMAND_NAME.animationTagAdd, targets: null, options: { animation, kind: 'mirror', of: { by: 'id', id: source }, flip: 'x', facing: 'w' } },
    ]);
    const mirror = animationOf().tags.find((tag) => tag.kind === 'mirror')?.id ?? '';
    const entries = menuFor(new FakeElement([TIMELINE_MENU.tag], { tagId: mirror }));
    expect(labels(entries)).toEqual([TIMELINE_MENU.playTag, TIMELINE_MENU.playOnce, TIMELINE_MENU.selectTagFrames, TIMELINE_MENU.deleteTag]);
  });

  it('disables the mirror entry when every facing has a tag or the animation has no directions', () => {
    withFrames(3);
    pickRange(0, 1);
    addTag();
    const tagId = animationOf().tags[0]?.id ?? '';
    const mirror = menuFor(new FakeElement([TIMELINE_MENU.tag], { tagId })).find((entry) => labelOf(entry) === TIMELINE_MENU.makeMirror);
    expect(mirror).toMatchObject({ disabled: true });
  });
});

describe('S2 the menu of the empty lane and the empty track', { tags: ['standard'] }, () => {
  it('adds the Add tag entry only on the lane', () => {
    withFrames(3);
    const lane = menuFor(new FakeElement([TIMELINE_MENU.lane]));
    const track = menuFor(new FakeElement([]));
    expect(labels(lane)).toEqual([TIMELINE_MENU.addTag, ...EMPTY_LABELS]);
    expect(labels(track)).toEqual(EMPTY_LABELS);
  });

  it('offers Group by facing only when the animation has directions', () => {
    withFrames(3);
    expect(labels(menuFor(new FakeElement([])))).not.toContain(TIMELINE_MENU.groupFacing);
    withDirections();
    const lane = labels(menuFor(new FakeElement([TIMELINE_MENU.lane])));
    expect(lane).toContain(TIMELINE_MENU.groupFacing);
    expect(lane.length).toBeLessThanOrEqual(12);
  });
});

