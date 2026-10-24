/* @layer core @kind types */
import type { CelId, LayerId } from '../model/ids.type';
import type { Cel } from '../model/sprite.type';

type FrameCopy = {
  readonly links: ReadonlyMap<LayerId, CelId>;
  readonly cels: Readonly<Record<CelId, Cel>>;
};

export type { FrameCopy };
