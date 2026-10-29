/* @layer renderer-app @kind logic */
import type { Cell, CellMapper, Session } from './e2e.type';

const clickCellWith = async (session: Session, map: CellMapper, cell: Cell, button: 'left' | 'right'): Promise<void> => {
  const at = map(cell);
  await session.page.mouse.click(at.x, at.y, { button });
};

export { clickCellWith };
