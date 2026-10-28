/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useBoundSheetId } from '../../../hooks/useBoundSheetId';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { selectionIds } from '../../../sheet/selection-ids';
import { managerLists } from '../../../sheet-manager/manager-lists';
import { sizeOptions } from '../../../sheet-manager/size-options';
import { tagOptions } from '../../../sheet-manager/tag-options';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { ManagerModel } from '../SpritesPanel.type';

const useManagerModel = (): ManagerModel | null => {
  const base = useSpriteScene();
  const query = useManagerStore((state) => state.query);
  const filter = useManagerStore((state) => state.filter);
  const sortKey = useManagerStore((state) => state.sortKey);
  const sortDown = useManagerStore((state) => state.sortDown);
  const collapsed = useManagerStore((state) => state.collapsed);
  const picked = useManagerStore((state) => state.picked);
  const sheetId = useBoundSheetId();
  const artwork = base?.artwork ?? null;
  const sheet = useMemo(() => artwork?.sheets.find((each) => each.id === sheetId) ?? null, [artwork, sheetId]);
  const lists = useMemo(
    () => (artwork ? managerLists(artwork, sheet, { query, filter, sortKey, sortDown }, new Set(collapsed)) : null),
    [artwork, sheet, query, filter, sortKey, sortDown, collapsed],
  );
  const sizes = useMemo(() => sizeOptions([...(lists?.facts.map((fact) => fact.sprite) ?? []), ...(lists?.animationFacts.map((fact) => fact.animation) ?? [])]), [lists]);
  const tags = useMemo(() => tagOptions(lists?.facts.map((fact) => fact.sprite) ?? []), [lists]);
  return useMemo(
    () =>
      base && lists
        ? { artwork: base.artwork, scene: base.scene, sheet, ...lists, picked, sizes, tags, ids: selectionIds(base.scene) }
        : null,
    [base, sheet, lists, picked, sizes, tags],
  );
};

export { useManagerModel };
