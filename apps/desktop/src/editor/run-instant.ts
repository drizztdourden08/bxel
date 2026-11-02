/* @layer renderer-app @kind logic */
import { rampsOfSlot } from '@bxel/palette';
import type { Point } from '@bxel/raster';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import type { EditorTarget } from './editor.type';
import { fillRequest } from './fill-request';
import { returnAfterPick } from './return-after-pick';
import { inkOf } from './ink-of';
import type { ColourSlot } from './press-plan.type';
import type { InstantKind } from './run-instant.type';
import { samplePixel } from './sample-pixel';
import { symmetryOf } from './symmetry-of';
import { tileSizeOfTarget } from './tile-size-of-target';
import { wrapOf } from './wrap-of';

const pickColour = (target: EditorTarget, at: Point, slot: ColourSlot, ramp: boolean): void => {
  const index = samplePixel(target, at);
  if (index === null) return;
  const tools = useToolStore.getState();
  tools.setColour(slot, index);
  const found = ramp ? rampsOfSlot(target.bank, index)[0] : undefined;
  if (found) useDrawingStore.getState().patch({ shadeRamp: found.name });
};

const tileLimit = (target: EditorTarget): { tile?: { width: number; height: number } } => {
  const tile = useDrawingStore.getState().fillStopAtTiles && useToolStore.getState().fillMode === 'contiguous' ? tileSizeOfTarget(target) : null;
  return tile === null ? {} : { tile };
};

const runInstant = (kind: InstantKind, target: EditorTarget, at: Point, slot: ColourSlot): void => {
  if (kind !== 'fill') {
    pickColour(target, at, slot, kind === 'pick-ramp');
    returnAfterPick();
    return;
  }
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  const ink = inkOf(slot, tools, drawing);
  const choice = {
    index: ink.index,
    mode: tools.fillMode,
    connectivity: tools.connectivity,
    wrap: wrapOf(),
    ink: ink.ink,
    symmetry: symmetryOf(tools, target.sprite, at),
    sample: drawing.fillSample,
    match: drawing.fillMatch,
    ...tileLimit(target),
  };
  useDocumentStore.getState().host.execute(fillRequest(target, at, choice));
};

export { runInstant };
