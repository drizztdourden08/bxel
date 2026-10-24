/* @layer core @kind constants */
import type { ColourModel } from '../model/preset.type';

const COLOUR_555: ColourModel = { kind: 'channelBits', bits: [5, 5, 5] };

const COLOUR_333: ColourModel = { kind: 'channelBits', bits: [3, 3, 3] };

const COLOUR_222: ColourModel = { kind: 'channelBits', bits: [2, 2, 2] };

const COLOUR_888: ColourModel = { kind: 'channelBits', bits: [8, 8, 8] };

export { COLOUR_222, COLOUR_333, COLOUR_555, COLOUR_888 };
