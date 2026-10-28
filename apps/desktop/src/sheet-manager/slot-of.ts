/* @layer renderer-app @kind logic */
import type { DropSide } from './drag-payload.type';

const slotOf = (rest: readonly string[], anchor: string | null, side: DropSide): number => {
  const at = anchor === null ? -1 : rest.indexOf(anchor);
  if (at < 0) return anchor === null && side === 'before' ? 0 : rest.length;
  return at + (side === 'after' ? 1 : 0);
};

export { slotOf };
