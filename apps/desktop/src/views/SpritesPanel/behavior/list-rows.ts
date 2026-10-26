/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import type { FolderGroup } from '../../../sheet-manager/folders.type';
import { pivotLabel } from '../../../sheet-manager/pivot-label';
import type { ListRow } from '../SpritesPanel.type';

const listRows = (artwork: Artwork, groups: readonly FolderGroup[], onSheets: boolean): ListRow[] =>
  groups.flatMap((group) =>
    group.facts.map(({ sprite, frames, tags, onSheet }) => ({
      id: sprite.id,
      name: sprite.name,
      folder: group.path === '' ? FOLDER_TEXT.root : group.path,
      width: sprite.width,
      height: sprite.height,
      pivot: pivotLabel(sprite),
      frames,
      tags,
      bank: findBank(artwork, sprite.bankId)?.name ?? '',
      loose: onSheets && !onSheet,
    })),
  );

export { listRows };
