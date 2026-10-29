/* @layer renderer-app @kind logic */
import type { Cell, Session } from './e2e.type';

const dragRight = async (session: Session, from: Cell, to: Cell): Promise<void> => {
  const { mouse } = session.page;
  await mouse.move(from.x, from.y);
  await mouse.down({ button: 'right' });
  await mouse.move(to.x, to.y);
  await mouse.up({ button: 'right' });
};

export { dragRight };
