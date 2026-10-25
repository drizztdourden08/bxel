/* @layer renderer-app @kind logic */
import type { Cell, Session } from './e2e.type';

const sampleCanvas = (session: Session, points: readonly Cell[]): Promise<string[]> =>
  session.page.evaluate(async (list) => {
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
  }, [...points]);

export { sampleCanvas };
