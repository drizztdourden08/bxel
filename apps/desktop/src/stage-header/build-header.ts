/* @layer renderer-app @kind logic */
import { animationHeader } from './animation-header';
import { mapHeader } from './map-header';
import { sheetHeader } from './sheet-header';
import { spriteHeader } from './sprite-header';
import { stateChips } from './state-chips';
import type { HeaderActions, HeaderInput, HeaderModel } from './stage-header.type';
import { tileHeader } from './tile-header';

const surfaceHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel => {
  if (input.surface === 'sheet') return sheetHeader(input);
  if (input.surface === 'map') return mapHeader(input, actions);
  if (input.surface === 'tile') return tileHeader(input, actions);
  return input.animation ? animationHeader(input, actions) : spriteHeader(input, actions);
};

const buildHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel | null => {
  if (input.surface === 'none') return null;
  const model = surfaceHeader(input, actions);
  return { ...model, chips: [...model.chips, ...stateChips(input)] };
};

export { buildHeader };
