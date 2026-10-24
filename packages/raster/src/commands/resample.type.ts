/* @layer core @kind types */
import type { Pivot2, SpriteId } from '@bxel/document';
import type { MaskView } from '../buffer.type';
import type { Rect, Size } from '../geometry.type';
import type { BoundsPolicy, Mover, MoverView } from '../region/region.type';

type ResampleSpec = {
  readonly mover: Mover;
  readonly mask: MaskView | undefined;
  readonly pivot: Pivot2 | undefined;
  readonly bounds: BoundsPolicy;
  readonly skipZero: boolean;
};

type SpritePlan = {
  readonly spriteId: SpriteId;
  readonly size: Size;
  readonly view: MoverView;
  readonly area: Rect | null;
};

export type { ResampleSpec, SpritePlan };
