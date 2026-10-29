/* @layer renderer-app @kind logic */
import type { AlignBox, AlignMove } from './align.type';

const rowsPlan = (boxes: readonly AlignBox[], gap: number): AlignMove[] => {
  if (boxes.length < 2) return [];
  const columns = Math.max(1, Math.ceil(Math.sqrt(boxes.length)));
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const moves: AlignMove[] = [];
  let x = left;
  let y = top;
  let tallest = 0;
  boxes.forEach((box, index) => {
    if (index > 0 && index % columns === 0) {
      x = left;
      y += tallest + gap;
      tallest = 0;
    }
    moves.push({ id: box.id, at: { x, y } });
    x += box.width + gap;
    tallest = Math.max(tallest, box.height);
  });
  return moves.filter((move) => {
    const box = boxes.find((each) => each.id === move.id);
    return box !== undefined && (box.x !== move.at.x || box.y !== move.at.y);
  });
};

export { rowsPlan };
