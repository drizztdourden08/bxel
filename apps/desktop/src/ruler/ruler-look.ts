/* @layer renderer-app @kind logic */
import { FALLBACK_FONT, RULER_SIZES, RULER_TOKENS } from './ruler.constants';
import type { RulerLook } from './ruler.type';

const rulerLook = (canvas: HTMLCanvasElement): RulerLook => {
  const style = canvas.ownerDocument.defaultView?.getComputedStyle(canvas);
  const read = (token: string): string => style?.getPropertyValue(token).trim() ?? '';
  return {
    ground: read(RULER_TOKENS.ground),
    line: read(RULER_TOKENS.line),
    text: read(RULER_TOKENS.text),
    cursor: read(RULER_TOKENS.cursor),
    axis: read(RULER_TOKENS.axis),
    font: `${RULER_SIZES.font}px ${style?.fontFamily ?? FALLBACK_FONT}`,
  };
};

export { rulerLook };
