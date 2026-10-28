/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SheetId, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';
import { parseAnimationKey } from './parse-animation-key';

const copyToSheet = (ids: readonly SpriteId[], keys: readonly string[], target: SheetId): boolean => {
  const sheet = currentArtwork()?.sheets.find((each) => each.id === target);
  if (!sheet) return false;
  const held = new Set(sheet.entries.map((entry) => entry.spriteId));
  const placed = new Set((sheet.animationEntries ?? []).map((entry) => `${entry.animationId}:${entry.tagId ?? ''}`));
  const loose = ids.filter((id) => !held.has(id));
  const strips = keys.flatMap((key) => {
    const parsed = parseAnimationKey(key);
    return parsed && !placed.has(`${parsed.animationId}:${parsed.tagId ?? ''}`) ? [parsed] : [];
  });
  const steps: CommandStep[] = [
    ...(loose.length > 0 ? spriteSteps(COMMAND_NAME.sheetAdd, loose, { sheet: target }) : []),
    ...strips.map((strip) => ({
      name: COMMAND_NAME.sheetAnimationAdd,
      targets: null,
      options: { sheet: target, animation: strip.animationId, tag: strip.tagId ? { by: 'id', id: strip.tagId } : null },
    })),
  ];
  return steps.length > 0 && runDocument(LABEL.copyToSheet(loose.length + strips.length, sheet.name), steps) !== null;
};

export { copyToSheet };
