/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultProject } from '../../src/documents/create-default-project';
import { activeLayer } from '../../src/editor/active-layer';
import { addLayer } from '../../src/editor/add-layer';
import { allowPress } from '../../src/editor/allow-press';
import { beginStroke } from '../../src/editor/begin-stroke';
import { commitSession } from '../../src/editor/commit-session';
import { currentTarget } from '../../src/editor/current-target';
import { deleteLayer } from '../../src/editor/delete-layer';
import type { EditorTarget } from '../../src/editor/editor.type';
import { layerBlock } from '../../src/editor/layer-block';
import { layerItems } from '../../src/editor/layer-items';
import { mergeLayerDown } from '../../src/editor/merge-layer-down';
import { moveLayer } from '../../src/editor/move-layer';
import { renameLayer } from '../../src/editor/rename-layer';
import { stepHistory } from '../../src/editor/step-history';
import { stepLayer } from '../../src/editor/step-layer';
import { updateLayerFlag } from '../../src/editor/update-layer-flag';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useNoticeStore } from '../../src/stores/useNoticeStore';
import { useToolStore } from '../../src/stores/useToolStore';
import { plainOptions } from './editor-harness';

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const layerNames = (): string[] => live().sprite.layers.map((layer) => layer.name);

const drawAt = (x: number) => commitSession(beginStroke({ target: live(), tool: 'pencil', index: 3, options: plainOptions, at: { x, y: 0 } }));

const cellOf = (layerName: string) => {
  const { sprite, frameId } = live();
  const celId = sprite.layers.find((layer) => layer.name === layerName)?.cels[frameId];
  return celId === undefined ? undefined : sprite.cels[celId];
};

beforeEach(() => {
  useNoticeStore.setState({ notice: null });
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultProject(useDocumentStore.getState().host);
});

describe('the active layer', () => {
  it('is the top layer until one is picked, and falls back to it when the picked one is gone', () => {
    const { sprite } = live();
    expect(activeLayer(sprite, null)?.name).toBe('Layer 1');
    addLayer();
    expect(live().layer.name).toBe('Layer 2');
    stepHistory('undo');
    expect(useToolStore.getState().layerId).not.toBeNull();
    expect(live().layer.name).toBe('Layer 1');
  });

  it('sends a stroke to the picked layer', () => {
    addLayer();
    expect(drawAt(2)?.ok).toBe(true);
    expect(cellOf('Layer 2')?.pixels[2]).toBe(3);
    expect(cellOf('Layer 1')).toBeUndefined();
    const bottom = live().sprite.layers[0];
    useToolStore.getState().setLayer(bottom?.id ?? null);
    expect(drawAt(5)?.ok).toBe(true);
    expect(cellOf('Layer 1')?.pixels[5]).toBe(3);
  });

  it('names the cause when the layer is locked or hidden', () => {
    const id = live().layerId;
    updateLayerFlag(id, 'locked', true);
    expect(layerBlock(live().layer)).toBe('Layer Layer 1 is locked. Unlock it or choose another layer.');
    expect(drawAt(1)?.ok).toBe(false);
    updateLayerFlag(id, 'locked', false);
    updateLayerFlag(id, 'visible', false);
    expect(layerBlock(live().layer)).toBe('Layer Layer 1 is hidden. Show it to draw on it.');
    expect(drawAt(1)?.ok).toBe(false);
    updateLayerFlag(id, 'visible', true);
    expect(layerBlock(live().layer)).toBeNull();
  });

  it('refuses a press on a blocked layer with a notice, but lets the picker through', () => {
    updateLayerFlag(live().layerId, 'visible', false);
    expect(allowPress({ kind: 'stroke', tool: 'pencil', slot: 'foreground', line: false }, live())).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toBe('Layer Layer 1 is hidden. Show it to draw on it.');
    expect(allowPress({ kind: 'pick', slot: 'foreground' }, live())).toBe(true);
  });
});

describe('layer actions', () => {
  it('adds above the picked layer and picks the new one', () => {
    addLayer();
    useToolStore.getState().setLayer(live().sprite.layers[0]?.id ?? null);
    addLayer();
    expect(layerNames()).toEqual(['Layer 1', 'Layer 3', 'Layer 2']);
    expect(live().layer.name).toBe('Layer 3');
  });

  it('deletes the picked layer, picks its neighbour and keeps the last layer', () => {
    addLayer();
    deleteLayer();
    expect(layerNames()).toEqual(['Layer 1']);
    expect(live().layer.name).toBe('Layer 1');
    deleteLayer();
    expect(layerNames()).toEqual(['Layer 1']);
    expect(useNoticeStore.getState().notice?.text).toBe('A sprite keeps at least one layer.');
  });

  it('merges down, picks the lower layer and says so at the bottom', () => {
    addLayer();
    mergeLayerDown();
    expect(layerNames()).toEqual(['Layer 1']);
    mergeLayerDown();
    expect(useNoticeStore.getState().notice?.text).toBe('Cannot merge down from the bottom layer.');
  });

  it('moves a row by its place in the list, which runs top first', () => {
    addLayer();
    addLayer();
    expect(layerItems(live().sprite).map((item) => item.label)).toEqual(['Layer 3', 'Layer 2', 'Layer 1']);
    moveLayer(0, 2);
    expect(layerNames()).toEqual(['Layer 3', 'Layer 1', 'Layer 2']);
    moveLayer(2, 0);
    expect(layerNames()).toEqual(['Layer 1', 'Layer 2', 'Layer 3']);
  });

  it('renames, and reports a taken name without changing anything', () => {
    addLayer();
    const [bottom] = live().sprite.layers;
    expect(renameLayer(bottom?.id ?? live().layerId, 'Body')).toBe(true);
    expect(layerNames()).toEqual(['Body', 'Layer 2']);
    expect(renameLayer(live().layerId, 'body')).toBe(false);
    expect(useNoticeStore.getState().notice?.text).toBe('That name is already used. Choose another name.');
  });

  it('steps the picked layer up and down the stack', () => {
    addLayer();
    stepLayer(-1);
    expect(live().layer.name).toBe('Layer 1');
    stepLayer(-1);
    expect(live().layer.name).toBe('Layer 1');
    stepLayer(1);
    expect(live().layer.name).toBe('Layer 2');
  });
});
