/* @layer core @kind logic */
import { COMMAND_NAME, ERROR_CODE } from '@bxel/document';
import { z } from 'zod';
import type { Failure } from '../errors/error.type';
import { mcpFailure } from '../errors/mcp-failure';
import { BATCH_PATCH_PIXELS_MAX, PATCH_PIXELS_MAX } from './limits.constants';

const patchStepSchema = z.object({
  name: z.literal(COMMAND_NAME.pixelsPatch),
  options: z.object({ rect: z.object({ width: z.number(), height: z.number() }) }),
});

const patchPixelsOf = (step: unknown): number | null => {
  const parsed = patchStepSchema.safeParse(step);
  return parsed.success ? parsed.data.options.rect.width * parsed.data.options.rect.height : null;
};

const tooLarge = (message: string, step: number, path: string): Failure =>
  mcpFailure(ERROR_CODE.BATCH_TOO_LARGE, message, { step, path });

const checkPatchPixels = (steps: readonly unknown[]): Failure | null => {
  let total = 0;
  for (const [index, step] of steps.entries()) {
    const pixels = patchPixelsOf(step);
    if (pixels === null) continue;
    if (pixels > PATCH_PIXELS_MAX) {
      return tooLarge(`A patch holds at most ${PATCH_PIXELS_MAX} pixels.`, index, `steps.${index}.options.rect`);
    }
    total += pixels;
    if (total > BATCH_PATCH_PIXELS_MAX) {
      return tooLarge(`A batch carries at most ${BATCH_PATCH_PIXELS_MAX} patch pixels in all. Split the batch.`, index, `steps.${index}`);
    }
  }
  return null;
};

export { checkPatchPixels };
