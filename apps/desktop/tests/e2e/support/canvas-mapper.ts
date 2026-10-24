/* @layer renderer-app @kind logic */
import { CANVAS_LABEL } from './e2e.constants';
import type { CellMapper, Session, SpriteSize } from './e2e.type';
import { zoomOf } from './zoom-of';

const canvasMapper = async (session: Session, size: SpriteSize): Promise<CellMapper> => {
  const box = await session.page.getByRole('application', { name: CANVAS_LABEL }).boundingBox();
  if (!box) throw new Error('the sprite canvas has no box');
  const zoom = await zoomOf(session);
  return (cell) => ({
    x: box.x + box.width / 2 + (cell.x + 0.5 - size.width / 2) * zoom,
    y: box.y + box.height / 2 + (cell.y + 0.5 - size.height / 2) * zoom,
  });
};

export { canvasMapper };
