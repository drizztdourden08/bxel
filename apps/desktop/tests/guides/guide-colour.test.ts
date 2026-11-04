/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearGuideColours } from '../../src/guides/clear-guide-colours';
import { currentGuideColours } from '../../src/guides/current-guide-colours';
import { moveGuideColour } from '../../src/guides/move-guide-colour';
import { setGuideColour } from '../../src/guides/set-guide-colour';

const state = vi.hoisted((): { views: Record<string, { guideColours: Record<string, string> }> } => ({ views: {} }));

vi.mock('../../src/reference-image/current-view-key', () => ({ currentViewKey: () => 'view' }));
vi.mock('../../src/stores/useAssetViewStore', async () => (await import('./guide-views-mock')).guideViewsMock(state));

describe('W8b guide colours', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.views = { view: { guideColours: {} } };
  });

  it('sets and clears the colour of one guide', () => {
    setGuideColour('x', 4, '#ff0000');
    expect(currentGuideColours()).toEqual({ 'x:4': '#ff0000' });
    setGuideColour('x', 4, null);
    expect(currentGuideColours()).toEqual({});
  });

  it('carries the colour when a guide moves', () => {
    setGuideColour('y', 2, '#00ff00');
    moveGuideColour('y', 2, 9);
    expect(currentGuideColours()).toEqual({ 'y:9': '#00ff00' });
  });

  it('leaves other guides alone when one is cleared, and clears all on request', () => {
    setGuideColour('x', 1, '#111111');
    setGuideColour('y', 1, '#222222');
    setGuideColour('x', 1, null);
    expect(currentGuideColours()).toEqual({ 'y:1': '#222222' });
    clearGuideColours();
    expect(currentGuideColours()).toEqual({});
  });
});
