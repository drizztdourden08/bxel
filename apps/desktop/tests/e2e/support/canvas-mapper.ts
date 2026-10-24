/* @layer renderer-app @kind logic */
import { CANVAS_LABEL, LAYOUT_SETTLE } from './e2e.constants';
import type { CanvasLayout, CellMapper, Session, SpriteSize } from './e2e.type';
import { zoomOf } from './zoom-of';

const measure = async (session: Session): Promise<CanvasLayout> => {
  const box = await session.page.getByRole('application', { name: CANVAS_LABEL }).boundingBox();
  if (!box) throw new Error('the sprite canvas has no box');
  const zoom = await zoomOf(session);
  return { ...box, zoom, key: [box.x, box.y, box.width, box.height, zoom].join(',') };
};

const settled = async (session: Session): Promise<CanvasLayout> => {
  let last = await measure(session);
  let steady = 0;
  for (let attempt = 0; attempt < LAYOUT_SETTLE.attempts && steady < LAYOUT_SETTLE.steady; attempt += 1) {
    await session.page.waitForTimeout(LAYOUT_SETTLE.gapMs);
    const next = await measure(session);
    steady = next.key === last.key ? steady + 1 : 0;
    last = next;
  }
  return last;
};

const canvasMapper = async (session: Session, size: SpriteSize): Promise<CellMapper> => {
  const box = await settled(session);
  return (cell) => ({
    x: box.x + box.width / 2 + (cell.x + 0.5 - size.width / 2) * box.zoom,
    y: box.y + box.height / 2 + (cell.y + 0.5 - size.height / 2) * box.zoom,
  });
};

export { canvasMapper };
