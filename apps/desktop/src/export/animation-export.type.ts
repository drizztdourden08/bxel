/* @layer renderer-app @kind types */
import type { Animation, Artwork, TagId } from '@bxel/document';
import type { ExportFrame, SheetTagEntry } from '@bxel/formats';

type SpanRange = { readonly first: number; readonly last: number };

type TagBuild = { readonly id: TagId; readonly entry: SheetTagEntry };

type TagFrames = {
  readonly tags: readonly TagBuild[];
  readonly extra: readonly ExportFrame[];
};

type AnimationWorld = {
  readonly artwork: Artwork;
  readonly animation: Animation;
};

export type { AnimationWorld, SpanRange, TagBuild, TagFrames };
