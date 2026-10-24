/* @layer renderer-app @kind logic */
import { ALIGN_AT, MIN_DISTRIBUTE } from './align.constants';
import type { AlignBounds, AlignBox, AlignEdge, AlignMode, AlignMove } from './align.type';

const boundsOf = (boxes: readonly AlignBox[]): AlignBounds => ({
  left: Math.min(...boxes.map((box) => box.x)),
  top: Math.min(...boxes.map((box) => box.y)),
  right: Math.max(...boxes.map((box) => box.x + box.width)),
  bottom: Math.max(...boxes.map((box) => box.y + box.height)),
});

const alignEdge = (boxes: readonly AlignBox[], edge: AlignEdge): AlignMove[] => {
  const bounds = boundsOf(boxes);
  return boxes.map((box) => ({ id: box.id, at: ALIGN_AT[edge](box, bounds) }));
};

const distribute = (boxes: readonly AlignBox[], horizontal: boolean): AlignMove[] => {
  if (boxes.length < MIN_DISTRIBUTE) return [];
  const start = (box: AlignBox): number => (horizontal ? box.x : box.y);
  const size = (box: AlignBox): number => (horizontal ? box.width : box.height);
  const sorted = [...boxes].sort((a, b) => start(a) - start(b));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) return [];
  const free = start(last) + size(last) - start(first) - sorted.reduce((sum, box) => sum + size(box), 0);
  const gap = free / (sorted.length - 1);
  let cursor = start(first);
  return sorted.map((box) => {
    const at = Math.max(0, Math.round(cursor));
    cursor += size(box) + gap;
    return { id: box.id, at: horizontal ? { x: at, y: box.y } : { x: box.x, y: at } };
  });
};

const alignPlan = (boxes: readonly AlignBox[], mode: AlignMode): AlignMove[] => {
  if (boxes.length < 2) return [];
  const moves = mode === 'horizontal' || mode === 'vertical' ? distribute(boxes, mode === 'horizontal') : alignEdge(boxes, mode);
  return moves.filter((move) => {
    const box = boxes.find((each) => each.id === move.id);
    return box !== undefined && (box.x !== move.at.x || box.y !== move.at.y);
  });
};

export { alignPlan };
