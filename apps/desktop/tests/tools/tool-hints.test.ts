/* @layer renderer-app @kind test */
import { announce, toast } from '@drizztdourden08/brock-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BRUSH_SIZE_ANNOUNCE } from '../../src/editor/brush-resize.constants';
import { memberById } from '../../src/editor/tool-catalogue/member-by-id';
import { noteToolPick } from '../../src/editor/tool-pick/note-tool-pick';
import { pointerPick } from '../../src/editor/tool-pick/pointer-pick';
import { SKILLOMETER_PICKS } from '../../src/editor/tool-pick/skillometer.constants';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { OPTION_COMMAND } from '../../src/keymap/option-command-id.constants';
import { useSkillometerStore } from '../../src/stores/useSkillometerStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { railDoubleClick } from '../../src/views/ToolRail/behavior/rail-double-click';
import { resetEditor } from '../editor/option-harness';
import { findCommand } from '../keymap/find-command';

const viewport = {
  screenToPixel: vi.fn(),
  pixelToScreen: vi.fn(),
  fit: vi.fn(),
  setZoom: vi.fn(),
  zoomIn: vi.fn(),
  zoomOut: vi.fn(),
  redraw: vi.fn(),
  reveal: vi.fn(),
  panTo: vi.fn(),
  zoomToRect: vi.fn(),
  view: () => ({ zoom: 4, pan: { x: 8, y: 8 }, originX: 0, originY: 0, width: 128, height: 128, dpr: 1, imageWidth: 16, imageHeight: 16 }),
};

vi.mock('@drizztdourden08/brock-react', async () => ({
  ...(await import('./tools-harness')).toolsBrockMock(),
  dismissToast: vi.fn(),
}));

beforeEach(() => {
  resetEditor();
  useSkillometerStore.getState().reset();
  vi.mocked(toast).mockClear();
  vi.mocked(announce).mockClear();
  viewport.fit.mockClear();
  viewport.setZoom.mockClear();
});

describe('S2 double click on the Hand and Zoom tool icons', { tags: ['standard'] }, () => {
  beforeEach(() => useViewStore.getState().setViewport(viewport));

  it('fits the view on the Hand icon', () => {
    expect(railDoubleClick('hand')).toBe(true);
    expect(viewport.fit).toHaveBeenCalledTimes(1);
  });

  it('goes to 100 percent on the Zoom icon', () => {
    expect(railDoubleClick('zoom')).toBe(true);
    expect(viewport.setZoom).toHaveBeenCalledWith(1);
  });

  it('leaves every other tool icon alone', () => {
    expect(railDoubleClick('pencil')).toBe(false);
    expect(railDoubleClick(null)).toBe(false);
    expect(viewport.fit).not.toHaveBeenCalled();
    expect(viewport.setZoom).not.toHaveBeenCalled();
  });
});

describe('S2 the skillometer hint', { tags: ['standard'] }, () => {
  it('stays quiet for the first picks of a tool', () => {
    for (let pick = 1; pick < SKILLOMETER_PICKS; pick += 1) noteToolPick('pencil');
    expect(toast).not.toHaveBeenCalled();
  });

  it('names the key once, on the fifth pick of the same tool', () => {
    for (let pick = 1; pick <= SKILLOMETER_PICKS + 3; pick += 1) noteToolPick('pencil');
    expect(toast).toHaveBeenCalledTimes(1);
    expect(vi.mocked(toast).mock.calls[0]?.[0]).toBe('Pencil: press B');
  });

  it('counts each tool on its own and tells each one once', () => {
    for (let pick = 1; pick <= SKILLOMETER_PICKS; pick += 1) {
      noteToolPick('pencil');
      noteToolPick('eraser');
    }
    expect(toast).toHaveBeenCalledTimes(2);
    expect(vi.mocked(toast).mock.calls[1]?.[0]).toBe('Eraser: press E');
  });

  it('counts the picks made with the pointer from a flyout, a row or a recent button', () => {
    const found = memberById('pencil');
    expect(found).toBeDefined();
    if (!found) return;
    for (let pick = 1; pick <= SKILLOMETER_PICKS; pick += 1) pointerPick(found.member);
    expect(useToolStore.getState().tool).toBe('pencil');
    expect(toast).toHaveBeenCalledTimes(1);
  });

  it('does not count a pick made with the key', async () => {
    for (let pick = 1; pick <= SKILLOMETER_PICKS; pick += 1) await findCommand(COMMAND_ID.tool('pencil')).run();
    expect(toast).not.toHaveBeenCalled();
  });
});

describe('S2 the brush size is spoken when a key changes it', { tags: ['standard'] }, () => {
  it('announces the new size after the bracket keys', async () => {
    await findCommand(COMMAND_ID.brushLarger).run();
    expect(announce).toHaveBeenLastCalledWith(BRUSH_SIZE_ANNOUNCE(2));
    await findCommand(COMMAND_ID.brushSmaller).run();
    expect(announce).toHaveBeenLastCalledWith('Brush size 1');
  });

  it('announces the size after the big steps too', async () => {
    await findCommand(OPTION_COMMAND.sizeUpBy).run();
    expect(announce).toHaveBeenLastCalledWith('Brush size 5');
    await findCommand(OPTION_COMMAND.sizeDownBy).run();
    expect(announce).toHaveBeenLastCalledWith('Brush size 1');
  });
});
