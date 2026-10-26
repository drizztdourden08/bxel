/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { Sprite, SpriteId } from '@bxel/document';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import type { ListData, ManagerModel } from '../SpritesPanel.type';
import { listRows } from './list-rows';

const useListData = (model: ManagerModel): ListData => {
  const rows = useMemo(() => listRows(model.artwork, model.groups, model.sheet !== null), [model.artwork, model.groups, model.sheet]);
  const selected = useMemo(() => new Set<string>(model.ids), [model.ids]);
  const known = useMemo(() => new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id])), [model.artwork]);
  const sprites = useMemo(() => new Map(model.artwork.sprites.map((sprite): [string, Sprite] => [sprite.id, sprite])), [model.artwork]);
  const folders = useMemo(() => [...new Set(rows.map((row) => row.folder))].filter((folder) => folder !== FOLDER_TEXT.root), [rows]);
  return { rows, selected, known, sprites, folders };
};

export { useListData };
