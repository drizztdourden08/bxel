/* @layer renderer-app @kind logic */
import { pickTile } from '../../../tilemap/pick-tile';
import type { GridPressInput, PressKeys } from './grid-press.type';

const isPlain = (event: PressKeys): boolean => !event.ctrlKey && !event.metaKey && !event.shiftKey;

const pickPlain = (index: number, input: GridPressInput): void => {
  input.anchor.current = index;
  const key = input.keyOf(index);
  if (key !== null) pickTile(key);
};

const pressSelect = (index: number, event: PressKeys, input: GridPressInput): void => {
  if (isPlain(event) && input.model.slots[index]?.picked) {
    input.anchor.current = index;
    input.held.current = index;
  } else if (event.ctrlKey || event.metaKey) input.toggle(index);
  else if (event.shiftKey && input.anchor.current !== null) input.span(index);
  else pickPlain(index, input);
};

const gridPress = (index: number, event: PressKeys, input: GridPressInput): void => {
  const key = input.keyOf(index);
  if (input.paint.active) input.paint.add(key);
  else if (event.altKey && key !== null) input.moving.current = key;
  else pressSelect(index, event, input);
};

export { gridPress };
