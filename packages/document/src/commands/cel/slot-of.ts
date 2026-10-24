/* @layer core @kind logic */
import type { CelSlot } from '../../draft/cel-slot.type';
import type { PickedSlot } from './cel.type';

const slotOf = (picked: PickedSlot): CelSlot => ({
  spriteId: picked.sprite.id,
  layerId: picked.layer.id,
  frameId: picked.frame.id,
});

export { slotOf };
