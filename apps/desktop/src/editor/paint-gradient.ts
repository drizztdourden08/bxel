/* @layer renderer-app @kind logic */
import { gradientFill } from '@bxel/raster';
import type { GradientSession } from './editor.type';
import { refreshRect } from './refresh-rect';

const wholeOf = (session: GradientSession) => ({ x: 0, y: 0, width: session.width, height: session.height });

const paintGradient = (session: GradientSession): void => {
  const { spec } = session;
  session.indices.set(session.base);
  const flat = spec.line.from.x === spec.line.to.x && spec.line.from.y === spec.line.to.y;
  if (!flat) {
    gradientFill({
      target: { pixels: session.indices, width: session.width, height: session.height },
      mask: session.mask,
      colors: spec.colors,
      line: spec.line,
      bayer: spec.bayer,
      origin: { x: 0, y: 0 },
      kind: spec.kind,
      reflect: spec.reflect,
      pattern: spec.pattern,
      ...(spec.stencil ? { stencil: spec.stencil } : {}),
      wrap: spec.wrap,
    });
  }
  session.dirty = wholeOf(session);
  refreshRect(session, wholeOf(session));
};

export { paintGradient };
