/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork, Point, Sheet } from '@bxel/document';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { folderPath } from '../../../sheet-manager/folder-path';
import type { FolderGroup } from '../../../sheet-manager/folders.type';
import type { AnimationFacts } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { pivotLabel } from '../../../sheet-manager/pivot-label';
import type { ListRow } from '../SpritesPanel.type';

const placeOf = (sheet: Sheet | null, at: Point | undefined): string => (sheet && at ? `${at.x}, ${at.y}` : '');

const animationRow = (fact: AnimationFacts, sheet: Sheet | null): ListRow => ({
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
  loose: false,
});

const listRows = (artwork: Artwork, groups: readonly FolderGroup[], animations: readonly AnimationFacts[], sheet: Sheet | null): ListRow[] => [
  ...groups.flatMap((group) =>
    group.facts.map(({ sprite, onSheet }): ListRow => {
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
        loose: sheet !== null && !onSheet,
      };
    }),
  ),
  ...animations.map((fact) => animationRow(fact, sheet)),
];

export { listRows };
