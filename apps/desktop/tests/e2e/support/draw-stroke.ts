/* @layer renderer-app @kind logic */
import type { Cell, CellMapper, Session } from './e2e.type';

const drawStroke = async (session: Session, map: CellMapper, cells: readonly Cell[]): Promise<void> => {
  const [first, ...rest] = cells.map(map);
  if (!first) return;
  const { mouse } = session.page;
  await mouse.move(first.x, first.y);
  await mouse.down();
  for (const point of rest) await mouse.move(point.x, point.y);
  await mouse.up();
};

export { drawStroke };
