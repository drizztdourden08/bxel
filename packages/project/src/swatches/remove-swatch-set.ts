/* @layer core @kind logic */
import type { SwatchSetId } from '../ids/id.type';
import type { SwatchSet } from './swatch.type';

const removeSwatchSet = (sets: readonly SwatchSet[], setId: SwatchSetId): readonly SwatchSet[] =>
  sets.filter((each) => each.setId !== setId);

export { removeSwatchSet };
