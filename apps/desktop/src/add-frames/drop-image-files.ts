/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import { currentFocus } from '../timeline/current-focus';
import { useAddFramesStore } from '../stores/useAddFramesStore';
import { DURATION_START } from './add-frames.constants';
import { classifyDropFile } from './classify-drop-file';
import { DROP_TEXT } from './image-drop.constants';
import type { DropOutcome } from './image-drop.type';
import { runAddFrames } from './run-add-frames';

const reasonsOf = (outcomes: readonly DropOutcome[]): string[] => outcomes.flatMap((each) => (each.kind === 'refuse' ? [each.reason] : []));

const dropImageFiles = async (files: readonly File[], at: number): Promise<readonly string[]> => {
  const focus = currentFocus();
  if (!focus || files.length === 0) return [];
  if (focus.readOnly) return [DROP_TEXT.readOnly];
  const target = { focus, bank: findBank(focus.artwork, focus.animation.bankId), at };
  const outcomes = await Promise.all(files.map((file) => classifyDropFile(file, target)));
  const frames = outcomes.flatMap((each) => (each.kind === 'frame' ? [each.pixels] : []));
  const strips = outcomes.flatMap((each) => (each.kind === 'strip' ? [each.strip] : []));
  const alone = strips.length === 1 && frames.length === 0 ? strips[0] : undefined;
  const reasons = reasonsOf(outcomes);
  if (alone) useAddFramesStore.getState().show('strip', alone);
  else reasons.push(...strips.map((strip) => DROP_TEXT.stripAlone(strip.name)));
  if (frames.length > 0) runAddFrames({ kind: 'images', frames, at, durationMs: DURATION_START });
  return reasons;
};

export { dropImageFiles };
