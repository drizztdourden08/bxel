/* @layer renderer-app @kind logic */
import type { Cell, CellMapper, Session } from './e2e.type';

const clickCells = async (session: Session, map: CellMapper, cells: readonly Cell[]): Promise<void> => {
  for (const cell of cells) {
    const at = map(cell);
    await session.page.mouse.click(at.x, at.y);
  }
};

export { clickCells };
