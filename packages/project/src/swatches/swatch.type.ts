/* @layer core @kind types */
import type { SwatchSetId } from '../ids/id.type';

type SwatchColor = {
  readonly rgb: string;
  readonly alpha?: number;
  readonly name: string;
};

type SwatchSet = {
  readonly setId: SwatchSetId;
  readonly name: string;
  readonly colors: readonly SwatchColor[];
};

export type { SwatchColor, SwatchSet };
