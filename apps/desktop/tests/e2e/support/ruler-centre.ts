/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

type RulerName = 'Horizontal ruler' | 'Vertical ruler';

const centreOf = async (session: Session, name: RulerName) => {
  const box = await session.page.getByRole('button', { name }).boundingBox();
  if (!box) throw new Error(`the ${name} has no box`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

export type { RulerName };
export { centreOf };
