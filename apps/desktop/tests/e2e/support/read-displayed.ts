/* @layer renderer-app @kind logic */
import { CURSOR_PARK } from './e2e.constants';
import type { Cell, CellMapper, Session, SpriteSize, Swatches } from './e2e.type';

const cellsOf = (size: SpriteSize): Cell[] =>
  Array.from({ length: size.width * size.height }, (_, at) => ({ x: at % size.width, y: Math.floor(at / size.width) }));

const readDisplayed = async (session: Session, map: CellMapper, size: SpriteSize, swatches: Swatches): Promise<Uint8Array> => {
  await session.page.mouse.move(CURSOR_PARK.x, CURSOR_PARK.y);
  const points = cellsOf(size).map(map);
  const hex = await session.page.evaluate(async (list) => {
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
    const canvas = document.querySelector<HTMLCanvasElement>('[role="application"] canvas');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return list.map(() => '');
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    return list.map((point) => {
      const [red = 0, green = 0, blue = 0] = context.getImageData(Math.floor((point.x - rect.left) * scale), Math.floor((point.y - rect.top) * scale), 1, 1).data;
      return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
    });
  }, points);
  return Uint8Array.from(hex, (color) => Math.max(0, swatches.indexOf(color)));
};

export { readDisplayed };
