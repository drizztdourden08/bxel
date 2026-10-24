/* @layer renderer-app @kind logic */
import { flattenFrame, findBank } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { AREA_CLASH_CODE, checkAreas } from '@bxel/presets';
import type { AreaClash, PlatformPreset } from '@bxel/presets';
import { framesText } from '../palette-change/frames-text';
import { listSprites } from '../sheet/list-sprites';
import type { FrameClash } from './area-findings.type';
import { AREA_TEXT } from './platform-preset.constants';
import type { AreaHighlight, FindingLine } from './platform-preset.type';

const clashesOf = (preset: PlatformPreset, sprite: Sprite, cap: number): FrameClash[] =>
  sprite.frames.flatMap((frame, at) => {
    const result = checkAreas(preset, flattenFrame(sprite, frame.id), sprite, { cap });
    return result.ok ? result.value.map((clash) => ({ frameId: frame.id, frame: at + 1, clash })) : [];
  });

const highlightOf = (sprite: Sprite, code: string, group: readonly FrameClash[]): AreaHighlight => {
  const frames: Record<string, AreaClash[]> = {};
  for (const item of group) (frames[item.frameId] ??= []).push(item.clash);
  return { key: `${sprite.id}:${code}`, spriteId: sprite.id, frames };
};

const textOf = (sprite: Sprite, group: readonly FrameClash[]): string => {
  const first = group[0]?.clash;
  const list = framesText([...new Set(group.map((item) => item.frame))]);
  const frames = sprite.frames.length > 1 ? AREA_TEXT.frames(list) : '';
  if (first?.code === AREA_CLASH_CODE.PALETTE_CLASH) return AREA_TEXT.palette(sprite.name, group.length, frames);
  return AREA_TEXT.colours(sprite.name, group.length, frames, first?.limit ?? 0);
};

const spriteLines = (preset: PlatformPreset, sprite: Sprite, cap: number): FindingLine[] => {
  const clashes = clashesOf(preset, sprite, cap);
  const codes = [...new Set(clashes.map((item) => item.clash.code))];
  return codes.map((code) => {
    const group = clashes.filter((item) => item.clash.code === code);
    return { tier: group[0]?.clash.tier ?? 'warn', text: textOf(sprite, group), area: highlightOf(sprite, code, group) };
  });
};

const artworkAreaFindings = (artwork: Artwork, preset: PlatformPreset, only?: readonly Sprite[]): FindingLine[] =>
  preset.areaRules.length === 0
    ? []
    : (only ?? listSprites(artwork)).flatMap((sprite) => {
        const bank = findBank(artwork, sprite.bankId);
        return bank ? spriteLines(preset, sprite, bank.cap) : [];
      });

export { artworkAreaFindings };
