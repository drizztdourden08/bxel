/* @layer renderer-app @kind test */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { beforeEach, describe, expect, it } from 'vitest';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { moreGroups } from '../../src/views/TimelinePanel/behavior/more-groups';
import { freshAnimation, live } from './timeline-harness';

const ids = (groups: readonly MenuGroup[]): string[] => groups.map((group) => group.id);

const folded = (groups: readonly MenuGroup[]): string[] => (groups.find((group) => group.id === 'folded')?.items ?? []).map((item) => ('id' in item ? item.id : ''));

describe('S2 the timeline header controls in the widget title bar', { tags: ['standard'] }, () => {
  beforeEach(() => {
    freshAnimation();
  });

  it('remembers how narrow the panel is when the open animation changes', () => {
    useTimelineStore.getState().setCompact(true);
    useTimelineStore.getState().reset();
    expect(useTimelineStore.getState().compact).toBe(true);
    useTimelineStore.getState().setCompact(false);
  });

  it('folds onion skin into the menu only when the panel is narrow, and keeps zoom out of it', () => {
    const focus = live();
    expect(ids(moreGroups(focus, false))).not.toContain('folded');
    const narrow = moreGroups(focus, true);
    expect(ids(narrow)).toContain('folded');
    expect(folded(narrow)).toContain('onion');
    expect(folded(narrow)).not.toContain('zoom');
  });
});
