/* @layer renderer-app @kind logic */
import { CURSOR_PARK } from './e2e.constants';
import type { Cell, CellMapper, Session, SpriteSize, Swatches } from './e2e.type';
import { sampleCanvas } from './sample-canvas';

const cellsOf = (size: SpriteSize): Cell[] =>
  Array.from({ length: size.width * size.height }, (_, at) => ({ x: at % size.width, y: Math.floor(at / size.width) }));

const readDisplayed = async (session: Session, map: CellMapper, size: SpriteSize, swatches: Swatches): Promise<Uint8Array> => {
  await session.page.mouse.move(CURSOR_PARK.x, CURSOR_PARK.y);
  const hex = await sampleCanvas(session, cellsOf(size).map(map));
  return Uint8Array.from(hex, (color) => Math.max(0, swatches.indexOf(color)));
};

export { readDisplayed };
