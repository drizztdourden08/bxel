/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { currentTarget } from '../../src/editor/current-target';
import { COMMAND_ID } from '../../src/keymap/keymap.constants';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useDrawingStore } from '../../src/stores/useDrawingStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { useViewStore } from '../../src/stores/useViewStore';
import { VIEW_DEFAULTS } from '../../src/stores/view-store.constants';
import { findCommand } from './find-command';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./brock-react-mock')).brockReactMock());

const find = findCommand;

const run = (id: string): void => void find(id).run();

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  useViewStore.setState({ ...VIEW_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
});

describe('S2 the keymap table', { tags: ['standard'] }, () => {
  it('gates the editor commands on an open document', () => {
    expect(find(COMMAND_ID.tool('pencil')).when?.()).toBe(true);
    useDocumentStore.getState().setActive(null);
    expect(find(COMMAND_ID.tool('pencil')).when?.()).toBe(false);
  });
});

describe('S2 the tool, brush and colour commands', { tags: ['standard'] }, () => {
  it('select a tool, and toggle filled on a second press of the rectangle key', () => {
    run(COMMAND_ID.tool('rect'));
    run(COMMAND_ID.tool('rect'));
    expect(useToolStore.getState().tool).toBe('rect');
    expect(useDrawingStore.getState().filled.rect).toBe(true);
    run(COMMAND_ID.tool('eraser'));
    expect(useToolStore.getState().tool).toBe('eraser');
  });

  it('change the brush size with the bracket commands', () => {
    run(COMMAND_ID.brushLarger);
    run(COMMAND_ID.brushLarger);
    expect(useToolStore.getState().brushSize).toBe(3);
    run(COMMAND_ID.brushSmaller);
    expect(useToolStore.getState().brushSize).toBe(2);
  });

  it('toggle symmetry and swap or step the colours', () => {
    run(COMMAND_ID.symmetryX);
    run(COMMAND_ID.symmetryY);
    run(COMMAND_ID.symmetryY);
    expect(useToolStore.getState()).toMatchObject({ symmetryX: true, symmetryY: false });
    useToolStore.getState().setForeground(4);
    useToolStore.getState().setBackground(7);
    run(COMMAND_ID.swapColours);
    expect(useToolStore.getState()).toMatchObject({ foreground: 7, background: 4 });
    useToolStore.getState().setColour('third', 2);
    useToolStore.getState().setColour('fourth', 3);
    run(COMMAND_ID.swapColourPairs);
    expect(useToolStore.getState()).toMatchObject({ foreground: 2, background: 3, third: 7, fourth: 4 });
    run(COMMAND_ID.swapColourPairs);
    run(COMMAND_ID.colourForward);
    run(COMMAND_ID.colourBack);
    run(COMMAND_ID.colourBack);
    expect(useToolStore.getState().foreground).toBe(6);
  });
});

describe('S2 the view, layer and help commands', { tags: ['standard'] }, () => {
  it('toggle the pixel grid and set the tiled preview', () => {
    run(COMMAND_ID.pixelGrid);
    expect(useViewStore.getState().grid).toBe(false);
    run(COMMAND_ID.tiledBoth);
    expect(useViewStore.getState().tiled).toBe('both');
    run(COMMAND_ID.tiledX);
    expect(useViewStore.getState().tiled).toBe('x');
    run(COMMAND_ID.tiledOff);
    expect(useViewStore.getState().tiled).toBe('off');
  });

  it('add a layer and step to the one below', () => {
    run(COMMAND_ID.layerAdd);
    expect(currentTarget()?.layer.name).toBe('Layer 2');
    run(COMMAND_ID.layerBelow);
    expect(currentTarget()?.layer.name).toBe('Layer 1');
    run(COMMAND_ID.layerAbove);
    expect(currentTarget()?.layer.name).toBe('Layer 2');
  });
});
