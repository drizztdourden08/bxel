/* @layer core @kind types */
import type { Draft } from '../../draft/draft.type';
import type { CelId } from '../../model/ids.type';
import type { Frame, Layer, Sprite } from '../../model/sprite.type';

type PickedSlot = {
  readonly sprite: Sprite;
  readonly layer: Layer;
  readonly frame: Frame;
  readonly celId: CelId | undefined;
};

type SlotPair = {
  readonly source: PickedSlot;
  readonly target: PickedSlot;
};

type SlotAction = (draft: Draft, pair: SlotPair) => void;

type LockRule = 'target' | 'both';

export type { LockRule, PickedSlot, SlotAction, SlotPair };
