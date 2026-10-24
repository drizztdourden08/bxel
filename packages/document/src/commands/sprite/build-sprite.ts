/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { Pivot2 } from '../../model/geometry.type';
import type { BankId, FrameId, LayerId, SpriteId } from '../../model/ids.type';
import { DEFAULT_FRAME_DURATION_MS, DEFAULT_LAYER_NAME } from '../../model/limits.constants';
import type { Sprite } from '../../model/sprite.type';

const buildSprite = ({
  ids,
  name,
  width,
  height,
  bankId,
  pivot,
  created,
}: {
  ids: IdSource;
  name: string;
  width: number;
  height: number;
  bankId: BankId;
  pivot: Pivot2 | null;
  created: number | undefined;
}): Sprite => ({
  id: ids.next('spr') as SpriteId,
  name,
  created,
  role: 'sprite',
  bankId,
  width,
  height,
  pivot: pivot ?? { x2: width, y2: height },
  layers: [{ id: ids.next('lay') as LayerId, name: DEFAULT_LAYER_NAME, visible: true, locked: false, cels: {} }],
  frames: [{ id: ids.next('frm') as FrameId, durationMs: DEFAULT_FRAME_DURATION_MS }],
  tags: [],
  slices: [],
  cels: {},
});

export { buildSprite };
