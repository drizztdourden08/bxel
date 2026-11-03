/* @layer renderer-app @kind test */
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { revealSwatch } from '../../src/editor/reveal-swatch';
import { useSwatchGridStore } from '../../src/stores/useSwatchGridStore';

const cell = { focus: vi.fn(), scrollIntoView: vi.fn() };
const handle: VirtualGridHandle = { scrollToIndex: vi.fn(), getRects: () => [] };

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (run: () => void) => {
    run();
    return 0;
  });
  vi.stubGlobal('document', { querySelector: vi.fn(() => cell) });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  useSwatchGridStore.setState({ handle: null });
});

describe('reveal a swatch', { tags: ['critical'] }, () => {
  it('scrolls the grid to the index, then focuses the rendered cell', () => {
    useSwatchGridStore.getState().attach(handle);
    revealSwatch({ index: 40 });
    expect(handle.scrollToIndex).toHaveBeenCalledWith(40);
    expect(cell.focus).toHaveBeenCalledTimes(1);
    expect(cell.scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not focus a cell that is not rendered', () => {
    useSwatchGridStore.getState().attach(handle);
    vi.stubGlobal('document', { querySelector: vi.fn(() => null) });
    revealSwatch({ index: 40 });
    expect(handle.scrollToIndex).toHaveBeenCalledWith(40);
    expect(cell.focus).not.toHaveBeenCalled();
  });

  it('falls back to the page when no grid is mounted', () => {
    revealSwatch({ index: 3 });
    expect(handle.scrollToIndex).not.toHaveBeenCalled();
    expect(cell.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    expect(cell.focus).toHaveBeenCalledTimes(1);
  });

  it('does nothing without a swatch to show', () => {
    useSwatchGridStore.getState().attach(handle);
    revealSwatch({});
    expect(handle.scrollToIndex).not.toHaveBeenCalled();
    expect(cell.focus).not.toHaveBeenCalled();
  });

  it('forgets a grid that was detached', () => {
    useSwatchGridStore.getState().attach(handle);
    useSwatchGridStore.getState().detach(handle);
    expect(useSwatchGridStore.getState().handle).toBeNull();
  });
});
