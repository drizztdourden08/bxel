/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Animation, Artwork, TagId } from '@bxel/document';
import type { ExportFrame, ExportSprite, SheetTagEntry } from '@bxel/formats';
import { animationFrameOf } from './animation-frame-of';
import { animationTagFrames } from './animation-tag-frames';
import type { AnimationWorld, TagBuild } from './animation-export.type';
import { bankRgba } from './bank-rgba';
import { EXPORT_TEXT } from './export.constants';

const labelled = (animation: Animation, frames: readonly ExportFrame[], tags: readonly SheetTagEntry[]): ExportFrame[] => {
  const labels: string[] = [];
  for (const tag of tags) {
    for (let at = tag.from; at <= tag.to; at += 1) labels[at] ??= `${tag.name}_${at - tag.from}`;
  }
  return frames.map((frame, at) => ({ ...frame, label: labels[at] ?? `${animation.name}_${at}` }));
};

const loopTag = (animation: Animation, count: number): SheetTagEntry[] =>
  animation.loop.direction === 'forward' && animation.loop.repeat === 0
    ? []
    : [{ name: animation.name, from: 0, to: count - 1, direction: animation.loop.direction, repeat: animation.loop.repeat }];

const only = (animation: Animation, build: TagBuild, frames: readonly ExportFrame[]): { frames: ExportFrame[]; tags: SheetTagEntry[]; name: string } => {
  const { entry } = build;
  const kept = frames.slice(entry.from, entry.to + 1);
  return {
    frames: kept.map((frame) => ({ layers: frame.layers, durationMs: frame.durationMs, label: frame.label ?? entry.name })),
    tags: [{ ...entry, from: 0, to: kept.length - 1 }],
    name: `${animation.name}_${entry.name}`,
  };
};

const animationExport = (artwork: Artwork, animation: Animation, tagId: TagId | null = null): ExportSprite | string => {
  const bank = findBank(artwork, animation.bankId);
  if (!bank) return EXPORT_TEXT.noAnimationPalette(animation.name);
  const world: AnimationWorld = { artwork, animation };
  const base = animation.frames.flatMap((_frame, index) => animationFrameOf(world, index, null));
  const { tags: built, extra } = animationTagFrames(world);
  const entries = built.length === 0 ? loopTag(animation, base.length) : built.map((item) => item.entry);
  const frames = labelled(animation, [...base, ...extra], entries);
  const common = {
    width: animation.width,
    height: animation.height,
    pivot: animation.anchor,
    palette: bankRgba(bank),
    slices: [],
  };
  if (tagId === null) return { name: animation.name, ...common, frames, tags: entries };
  const picked = built.find((item) => item.id === tagId);
  if (!picked) return EXPORT_TEXT.noAnimationTag(animation.name);
  const part = only(animation, picked, frames);
  return { ...common, ...part };
};

export { animationExport };
