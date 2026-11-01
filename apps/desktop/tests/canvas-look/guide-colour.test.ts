/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { useViewStore } from '../../src/stores/useViewStore';

describe('S2 guide colours', { tags: ['standard'] }, () => {
  it('colours both kinds of guide the same until a second colour is given', () => {
    useViewStore.getState().setGuideColour('#112233');
    expect(useViewStore.getState().guideColour).toBe('#112233');
    expect(useViewStore.getState().guideColourY).toBe('#112233');
  });

  it('keeps a separate colour for the guides that run across', () => {
    useViewStore.getState().setGuideColour('#112233', '#445566');
    expect(useViewStore.getState().guideColour).toBe('#112233');
    expect(useViewStore.getState().guideColourY).toBe('#445566');
  });
});
