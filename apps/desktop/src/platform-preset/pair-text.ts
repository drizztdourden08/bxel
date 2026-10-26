/* @layer renderer-app @kind logic */
import type { SizePair } from '@bxel/presets';
import { FACT_TEXT } from './preset-facts.constants';

const pairText = ([width, height]: SizePair): string => FACT_TEXT.pair(width, height);

export { pairText };
