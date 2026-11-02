/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TransactionRequest } from '@bxel/document';
import type { MaskView, Point } from '@bxel/raster';
import { celsPaintScope } from './cels-paint-scope';
import { commitRequest } from './commit-request';
import type { EditorTarget, FillChoice } from './editor.type';
import { fillMask } from './fill-mask';
import { FILL_LABEL } from './stroke.constants';

const maskPart = (target: EditorTarget, at: Point, choice: FillChoice): { mask?: MaskView } => {
  const mask = fillMask(target, at, choice);
  return mask ? { mask } : {};
};

const extras = (choice: FillChoice) => ({
  ...(choice.ink ? { ink: choice.ink } : {}),
  ...(choice.symmetry && Object.keys(choice.symmetry).length > 0 ? { symmetry: choice.symmetry } : {}),
  ...(choice.sample === 'visible' ? { sample: choice.sample } : {}),
  ...(choice.match === 'ramp' ? { match: choice.match } : {}),
});

const fillRequest = (target: EditorTarget, at: Point, choice: FillChoice): TransactionRequest =>
  commitRequest(
    target,
    FILL_LABEL,
    {
      name: COMMAND_NAME.pixelsFill,
      options: {
        x: at.x,
        y: at.y,
        index: choice.index,
        mode: choice.mode,
        connectivity: choice.connectivity,
        wrap: choice.wrap,
        ...extras(choice),
        ...maskPart(target, at, choice),
      },
    },
    celsPaintScope(target),
  );

export { fillRequest };
