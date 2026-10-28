/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const drag = async (session: Session, from: { x: number; y: number }, to: { x: number; y: number }): Promise<void> => {
  const { mouse } = session.page;
  await mouse.move(from.x, from.y);
  await mouse.down();
  await mouse.move((from.x + to.x) / 2, (from.y + to.y) / 2, { steps: 4 });
  await mouse.move(to.x, to.y, { steps: 4 });
  await mouse.up();
};

export { drag };
