/* @layer core @kind types */
import type { Pivot2, Point, Rect } from '../../model/geometry.type';
import type { SpriteId } from '../../model/ids.type';

type FrameFields = {
  readonly durationMs?: number | undefined;
  readonly offset?: Point | undefined;
  readonly pivot?: Pivot2 | undefined;
};

type FrameTarget = { readonly spriteId: SpriteId | null; readonly clip?: Rect | null };

export type { FrameFields, FrameTarget };
