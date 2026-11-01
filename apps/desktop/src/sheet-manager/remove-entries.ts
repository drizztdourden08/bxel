/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, SheetId, SpriteId } from '@bxel/document';
import { currentArtwork } from '../sheet/current-artwork';
import { runDocument } from '../sheet/run-document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { animationKey } from './animation-key';
import { LABEL } from './manager-text.constants';
import { SHEET_TEXT } from './sheet-text.constants';
import { spriteSteps } from './sprite-steps';

const removeEntries = (ids: readonly SpriteId[], keys: readonly string[], sheetId: SheetId | null): boolean => {
  const sheet = currentArtwork()?.sheets.find((each) => each.id === sheetId);
  if (!sheet) return false;
  const onSheet = new Set(sheet.entries.map((entry) => entry.spriteId));
  const held = ids.filter((id) => onSheet.has(id));
  const strips = (sheet.animationEntries ?? []).filter((entry) => keys.includes(animationKey(entry.animationId, entry.tagId)));
  const steps: CommandStep[] = [
    ...(held.length > 0 ? spriteSteps(COMMAND_NAME.sheetRemove, held, { sheet: sheet.id }) : []),
    ...strips.map((entry) => ({
      name: COMMAND_NAME.sheetAnimationRemove,
      targets: null,
      options: { sheet: sheet.id, animation: entry.animationId, tag: entry.tagId ? { by: 'id', id: entry.tagId } : null },
    })),
  ];
  if (steps.length === 0) return false;
  const count = held.length + strips.length;
  const done = runDocument(LABEL.removeEntries(count), steps) !== null;
  if (done) useNoticeStore.getState().post(SHEET_TEXT.live.removed(count));
  return done;
};

export { removeEntries };
