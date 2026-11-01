/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { SpriteId } from '@bxel/document';
import { useManagerStore } from '../../../stores/useManagerStore';
import { entryId } from '../../../sheet-manager/entry-id';
import { entryPages } from '../../../sheet-manager/entry-pages';
import { entryUsedBy } from '../../../sheet-manager/entry-used-by';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import type { ListData, ManagerModel } from '../SpritesPanel.type';
import { listRows } from './list-rows';

const useListData = (model: ManagerModel): ListData => {
  const atlas = useManagerStore((state) => state.atlas);
  const { extrude, trim, powerOfTwo, rotate, pageSide } = atlas;
  const pages = useMemo(
    () => entryPages(model.sheet, model.artwork, { extrude, trim, powerOfTwo, rotate, pageSide }),
    [model.sheet, model.artwork, extrude, trim, powerOfTwo, rotate, pageSide],
  );
  const usedBy = useMemo(() => entryUsedBy(model.artwork, model.sheet?.id ?? null), [model.artwork, model.sheet]);
  const rows = useMemo(
    () => listRows(model.artwork, model.groups, model.animations, { sheet: model.sheet, extra: { pages, usedBy } }),
    [model.artwork, model.groups, model.animations, model.sheet, pages, usedBy],
  );
  const selected = useMemo(() => new Set<string>([...model.ids, ...model.picked]), [model.ids, model.picked]);
  const known = useMemo(() => new Map(model.artwork.sprites.map((sprite): [string, SpriteId] => [sprite.id, sprite.id])), [model.artwork]);
  const animationKeys = useMemo(() => new Set(model.animationFacts.map((fact) => fact.key)), [model.animationFacts]);
  const facts = useMemo(
    () => new Map<string, EntryFacts>([...model.facts, ...model.animationFacts].map((fact) => [entryId(fact), fact])),
    [model.facts, model.animationFacts],
  );
  const folders = useMemo(() => [...new Set(rows.map((row) => row.folder))].filter((folder) => folder !== FOLDER_TEXT.root), [rows]);
  return { rows, selected, known, animationKeys, facts, folders };
};

export { useListData };
