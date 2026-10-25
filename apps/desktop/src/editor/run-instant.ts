/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useToolStore } from '../stores/useToolStore';
import type { EditorTarget } from './editor.type';
import { fillRequest } from './fill-request';
import type { ColourSlot } from './press-plan.type';
import { samplePixel } from './sample-pixel';
import { wrapOf } from './wrap-of';

const pickColour = (target: EditorTarget, at: Point, slot: ColourSlot): void => {
  const index = samplePixel(target, at);
  if (index === null) return;
  const tools = useToolStore.getState();
  tools.setColour(slot, index);
};

const runInstant = (kind: 'pick' | 'fill', target: EditorTarget, at: Point, slot: ColourSlot): void => {
  if (kind === 'pick') {
    pickColour(target, at, slot);
    return;
  }
  const tools = useToolStore.getState();
  const choice = { index: tools[slot], mode: tools.fillMode, connectivity: tools.connectivity, wrap: wrapOf() };
  useDocumentStore.getState().host.execute(fillRequest(target, at, choice));
};

export { runInstant };
