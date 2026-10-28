/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { currentTarget } from '../../src/editor/current-target';
import type { EditorTarget } from '../../src/editor/editor.type';
import { spriteLayerActions } from '../../src/editor/layer-actions';
import { layerChips } from '../../src/stage-header/layer-chips';
import { layerCrumb } from '../../src/stage-header/layer-crumb';
import { readSpriteHeader } from '../../src/stage-header/read-sprite-header';
import type { HeaderActions } from '../../src/stage-header/stage-header.type';
import { TOOL_DEFAULTS } from '../../src/stores/tool-store.constants';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useToolStore } from '../../src/stores/useToolStore';

const live = (): EditorTarget => {
  const target = currentTarget();
  if (!target) throw new Error('the store holds no document');
  return target;
};

const noActions = {} as HeaderActions;

const header = () =>
  readSpriteHeader(live(), { mode: 'sprite', isolated: false, broadcast: false, spritesScope: 'current', layerScope: 'active', selected: 1 });

beforeEach(() => {
  useToolStore.setState({ ...TOOL_DEFAULTS });
  createDefaultArtwork(useDocumentStore.getState().host);
});

describe('the layer crumb and chips of the stage header, read from the live document', () => {
  it('names the layer with no note and no chip for a normal layer', () => {
    expect(layerCrumb(header(), noActions)).toMatchObject({ label: 'Layer 1', note: undefined });
    expect(layerChips(header(), noActions, false)).toEqual([]);
  });

  it('marks a locked layer on the crumb and shows a danger chip', () => {
    spriteLayerActions.setFlag([live().layerId], 'locked', true);
    expect(layerCrumb(header(), noActions)).toMatchObject({ label: 'Layer 1', note: 'locked' });
    expect(layerChips(header(), noActions, false)[0]).toMatchObject({ text: 'Layer locked', tone: 'danger' });
  });

  it('marks a hidden layer on the crumb and shows a warning chip', () => {
    spriteLayerActions.setFlag([live().layerId], 'visible', false);
    expect(layerCrumb(header(), noActions)).toMatchObject({ label: 'Layer 1', note: 'hidden' });
    expect(layerChips(header(), noActions, false)[0]).toMatchObject({ text: 'Layer hidden', tone: 'warning' });
  });
});
