/* @layer renderer-app @kind logic */
import type { ExportSprite } from '@bxel/formats';
import { animationClips } from './animation-clips';
import { EXPORT_TEXT } from './export.constants';
import type { PlanParts, PlannedFile } from './export.type';
import type { Clip } from './export-parts.type';
import { makeClipApng } from './make-clip-apng';
import { makeClipGif } from './make-clip-gif';
import { safeName } from './safe-name';

const wanted = (clips: readonly Clip[], parts: PlanParts): Clip[] => {
  const { settings } = parts;
  if (settings.frames !== 'tag' || settings.tag === '') return [...clips];
  return clips.filter((clip) => clip.name === settings.tag);
};

const clipStem = (base: string, tag: string): string => {
  if (tag === '') return base;
  return tag.startsWith(base) ? tag : `${base}_${tag}`;
};

const clipFile =(parts: PlanParts, sprite: ExportSprite, clip: Clip, index: number): PlannedFile => {
  const { settings, base } = parts;
  const { scale, animation } = settings;
  const stem = clipStem(base, safeName(clip.name));
  const name = `${stem}.${animation === 'gif' ? 'gif' : 'png'}`;
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  return {
    name,
    detail: EXPORT_TEXT.animationDetail(name, width, height, clip.frames.length),
    spriteIndex: index,
    width,
    height,
    make: () => (animation === 'gif' ? makeClipGif(sprite, clip, scale) : makeClipApng(sprite, clip, scale, settings.colour === 'indexed')),
  };
};

const planClips = (parts: PlanParts): PlannedFile[] | string => {
  const sprite = parts.extra[0];
  if (!sprite) return EXPORT_TEXT.noAnimation;
  const clips = wanted(animationClips(sprite), parts);
  if (clips.length === 0) return EXPORT_TEXT.noClip(sprite.name, parts.settings.tag);
  return clips.map((clip, index) => clipFile(parts, sprite, clip, index));
};

export { planClips };
