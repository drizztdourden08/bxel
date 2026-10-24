/* @layer core @kind types */
import type { Pivot2 } from '../model/geometry.type';
import type { CelId } from '../model/ids.type';
import type { Slice } from '../model/sprite.type';

type SpriteGeometry = {
  readonly width: number;
  readonly height: number;
  readonly pivot: Pivot2;
  readonly slices?: readonly Slice[];
  readonly cels: Readonly<Record<CelId, Uint8Array>>;
};

export type { SpriteGeometry };
