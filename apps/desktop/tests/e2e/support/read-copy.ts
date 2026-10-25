/* @layer renderer-app @kind logic */
import { CURSOR_PARK } from './e2e.constants';
import type { Cell, CellMapper, Session, SpriteSize, Swatches } from './e2e.type';
import { sampleCanvas } from './sample-canvas';

type Box = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };

const canvasBox = (session: Session): Promise<Box> =>
  session.page.evaluate(() => {
    const rect = (document.querySelector('[role="application"] canvas') as HTMLCanvasElement).getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  });

const readCopy = async (session: Session, map: CellMapper, size: SpriteSize, swatches: Swatches): Promise<ReadonlyMap<number, number>> => {
  await session.page.mouse.move(CURSOR_PARK.x, CURSOR_PARK.y);
  const box = await canvasBox(session);
  const cells: Cell[] = Array.from({ length: size.width * size.height }, (_unused, at) => ({ x: at % size.width, y: Math.floor(at / size.width) }));
  const seen = cells.map((cell, at) => ({ at, point: map(cell) })).filter(({ point }) => point.x > box.x + 1 && point.y > box.y + 1 && point.x < box.x + box.width - 1 && point.y < box.y + box.height - 1);
  const colours = await sampleCanvas(session, seen.map(({ point }) => point));
  return new Map(seen.map(({ at }, order) => [at, Math.max(0, swatches.indexOf(colours[order] ?? ''))] as const));
};

export { readCopy };
