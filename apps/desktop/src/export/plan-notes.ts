/* @layer renderer-app @kind logic */
import { gifDelayCs } from '@bxel/formats';
import type { ExportSprite } from '@bxel/formats';
import { animationClips } from './animation-clips';
import { EXPORT_TEXT } from './export.constants';
import type { ExportSettings, Target } from './export.type';
import { playOrder } from './play-order';

const gifNotes = (durations: readonly number[], largest: number): string[] => {
  const changed = durations.filter((ms) => gifDelayCs(ms) * 10 !== ms).length;
  return [EXPORT_TEXT.gifColours(largest), EXPORT_TEXT.gifRounding(changed, durations.length)];
};

const loopNote = (targets: readonly Target[]): string[] => {
  const tag = targets[0]?.tag;
  return tag ? [EXPORT_TEXT.loops(tag.name, tag.repeat)] : [];
};

const spriteNotes = (targets: readonly Target[], settings: ExportSettings): string[] => {
  const durations = targets.flatMap((target) => playOrder(target).map((frame) => frame.durationMs));
  const largest = Math.max(...targets.map((target) => target.bank.slots.length));
  const format = settings.animation === 'gif' ? gifNotes(durations, largest) : [EXPORT_TEXT.apngNote];
  return [...format, ...loopNote(targets)];
};

const clipNotes = (extra: readonly ExportSprite[], settings: ExportSettings): string[] => {
  const clips = extra.flatMap(animationClips);
  const durations = clips.flatMap((clip) => clip.frames.map((frame) => frame.durationMs));
  const largest = Math.max(...extra.map((sprite) => sprite.palette.length / 4));
  const format = settings.animation === 'gif' ? gifNotes(durations, largest) : [EXPORT_TEXT.apngNote];
  return [...format, EXPORT_TEXT.clipNote(clips.length)];
};

const planNotes = (targets: readonly Target[], settings: ExportSettings, extra: readonly ExportSprite[] = []): string[] => {
  if (settings.kind === 'sheet') return settings.flavour === 'tiled' ? [EXPORT_TEXT.tiledSheetNote] : [];
  if (settings.kind !== 'animation') return [];
  return extra.length > 0 ? clipNotes(extra, settings) : spriteNotes(targets, settings);
};

export { planNotes };
