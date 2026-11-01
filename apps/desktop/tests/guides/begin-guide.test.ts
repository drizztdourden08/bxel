/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { beginGuide } from '../../src/guides/begin-guide';
import { useGuideStore } from '../../src/stores/useGuideStore';
import { useViewStore } from '../../src/stores/useViewStore';

vi.mock('../../src/guides/guide-scope', () => ({ guideScope: () => ({}) }));
vi.mock('../../src/guides/show-guides', () => ({ showGuides: () => undefined }));

describe('K1 lock guides', { tags: ['critical'] }, () => {
  beforeEach(() => {
    useViewStore.setState({ viewport: {} as never, lockGuides: false });
    useGuideStore.getState().setDrag(null);
  });

  it('refuses to pick up a placed guide while locked, and still lets a new one be pulled from the ruler', () => {
    useViewStore.setState({ lockGuides: true });
    expect(beginGuide('x', 4)).toBe(false);
    expect(beginGuide('x', null)).toBe(true);
  });

  it('picks up a placed guide when not locked', () => {
    expect(beginGuide('y', 2)).toBe(true);
    expect(useGuideStore.getState().drag).toEqual({ axis: 'y', from: 2, position: 2 });
  });
});
