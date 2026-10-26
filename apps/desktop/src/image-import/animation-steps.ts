/* @layer renderer-app @kind logic */
import { DEFAULT_FRAME_DURATION_MS } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { alphaThreshold } from './alpha-threshold';
import { cropRgba } from './crop-rgba';
import { frameDelay } from './frame-delay';
import { ANIMATION_REF } from './image-import.constants';
import type { BankOption, ImportRun } from './image-import.type';

const framesOf = (run: ImportRun): { rgba: Uint8Array; durationMs: number }[] => {
  if (run.form.kind === 'strip') {
    return run.rects.map((rect) => ({ rgba: cropRgba(run.image, rect), durationMs: DEFAULT_FRAME_DURATION_MS }));
  }
  return (run.image.frames ?? []).map((frame) => ({ rgba: Uint8Array.from(frame.data), durationMs: frameDelay(frame.delayMs) }));
};

const animationSteps = (run: ImportRun, bank: BankOption): CommandStep[] => {
  const cell = run.form.kind === 'strip' ? run.rects[0] : undefined;
  const { form, image } = run;
  const mapping = { dither: form.dither, originX: 0, originY: 0, alphaThreshold: alphaThreshold(form.alphaPercent) };
  return [
    {
      name: PALETTE_COMMAND_NAME.animationImport,
      targets: null,
      ref: ANIMATION_REF,
      options: { name: form.name.trim(), width: cell?.width ?? image.width, height: cell?.height ?? image.height, bank, mapping, frames: framesOf(run) },
    },
  ];
};

export { animationSteps };
