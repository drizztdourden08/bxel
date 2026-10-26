/* @layer renderer-app @kind logic */
import type { ColourModel } from '@bxel/presets';
import { FACT_TEXT } from './preset-facts.constants';

const colourText = (model: ColourModel): string => {
  if (model.kind === 'fixedSet') return FACT_TEXT.fixedColours(model.colours.length);
  const total = 2 ** model.bits.reduce((sum, bits) => sum + bits, 0);
  if (model.kind === 'channelBits') return FACT_TEXT.channelColours(total, model.bits.join(', '));
  return FACT_TEXT.subsetColours(model.subset, total);
};

export { colourText };
