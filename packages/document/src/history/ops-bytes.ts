/* @layer core @kind logic */
import { ENTITY_OP_BYTES, REMAP_OP_BYTES } from './history-limits.constants';
import type { UndoOp } from './history.type';

const payloadBytes = (value: unknown): number => {
  if (typeof value !== 'object' || value === null) return 0;
  if ('pixels' in value && value.pixels instanceof Uint8Array) return value.pixels.length;
  if ('cels' in value && typeof value.cels === 'object' && value.cels !== null) {
    return Object.values(value.cels).reduce((sum: number, cel: unknown) => sum + payloadBytes(cel), 0);
  }
  return 0;
};

const opBytes = (op: UndoOp): number => {
  switch (op.kind) {
    case 'cel-rect':
      return op.before.length + op.after.length;
    case 'cel-remap':
      return REMAP_OP_BYTES;
    case 'entity':
      return ENTITY_OP_BYTES + payloadBytes(op.before) + payloadBytes(op.after);
  }
};

const opsBytes = (ops: readonly UndoOp[]): number => ops.reduce((sum, op) => sum + opBytes(op), 0);

export { opsBytes };
