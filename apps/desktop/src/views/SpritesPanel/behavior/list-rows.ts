/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Point, Sheet } from '@bxel/document';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { folderPath } from '../../../sheet-manager/folder-path';
import type { FolderGroup } from '../../../sheet-manager/folders.type';
import type { AnimationFacts, SpriteFacts } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { pivotLabel } from '../../../sheet-manager/pivot-label';
import type { ListExtra, ListRow, ListScope } from '../SpritesPanel.type';
import { NO_EXTRA } from './list-rows.constants';

const placeOf = (sheet: Sheet | null, at: Point | undefined): string => (sheet && at ? `${at.x}, ${at.y}` : '');

const pageOf = (extra: ListExtra, id: string, placed: boolean): string => {
  const page = extra.pages.get(id);
  return placed && page !== undefined ? String(page) : '';
};

const animationRow = (fact: AnimationFacts, sheet: Sheet | null, extra: ListExtra): ListRow => ({
  id: fact.key,
  kind: 'animation',
  name: fact.name,
  folder: FOLDER_TEXT.root,
  width: fact.animation.width,
  height: fact.animation.height,
  pivot: '',
  bank: fact.bank,
  at: placeOf(sheet, fact.at),
  frames: MANAGER_TEXT.frameCount(fact.frames),
  entry: MANAGER_TEXT.entryKind.animation,
  page: pageOf(extra, fact.key, fact.onSheet),
  usedBy: extra.usedBy.get(fact.animation.id) ?? '',
  loose: false,
});

const spriteRow = (artwork: Artwork, { sprite, onSheet }: SpriteFacts, sheet: Sheet | null, extra: ListExtra): ListRow => {
  const folder = folderPath(sprite.name);
  return {
    id: sprite.id,
    kind: 'sprite',
    name: sprite.name,
    folder: folder === '' ? FOLDER_TEXT.root : folder,
    width: sprite.width,
    height: sprite.height,
    pivot: pivotLabel(sprite),
    bank: findBank(artwork, sprite.bankId)?.name ?? '',
    at: placeOf(sheet, sheet?.entries.find((entry) => entry.spriteId === sprite.id)?.at),
    frames: '',
    entry: MANAGER_TEXT.entryKind.sprite,
    page: pageOf(extra, sprite.id, onSheet),
    usedBy: extra.usedBy.get(sprite.id) ?? '',
    loose: sheet !== null && !onSheet,
  };
};

const listRows = (artwork: Artwork, groups: readonly FolderGroup[], animations: readonly AnimationFacts[], scope: ListScope): ListRow[] => {
  const { sheet, extra = NO_EXTRA } = scope;
  return [
    ...groups.flatMap((group) => group.facts.map((fact) => spriteRow(artwork, fact, sheet, extra))),
    ...animations.map((fact) => animationRow(fact, sheet, extra)),
  ];
};

export { listRows };
