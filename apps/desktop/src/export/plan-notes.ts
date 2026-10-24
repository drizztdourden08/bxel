/* @layer renderer-app @kind logic */
import { gifDelayCs } from '@bxel/formats';
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings, Target } from './export.type';
import { playOrder } from './play-order';

const gifNotes = (targets: readonly Target[]): string[] => {
  const durations = targets.flatMap((target) => playOrder(target).map((frame) => frame.durationMs));
  const changed = durations.filter((ms) => gifDelayCs(ms) * 10 !== ms).length;
  const largest = Math.max(...targets.map((target) => target.bank.slots.length));
  return [EXPORT_TEXT.gifColours(largest), EXPORT_TEXT.gifRounding(changed, durations.length)];
};

const loopNote = (targets: readonly Target[]): string[] => {
  const tag = targets[0]?.tag;
  return tag ? [EXPORT_TEXT.loops(tag.name, tag.repeat)] : [];
};

const planNotes = (targets: readonly Target[], settings: ExportSettings): string[] => {
  if (settings.kind !== 'animation') return [];
  const format = settings.animation === 'gif' ? gifNotes(targets) : [EXPORT_TEXT.apngNote];
  return [...format, ...loopNote(targets)];
};

export { planNotes };
