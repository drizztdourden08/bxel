/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { selectionIds } from '../../../sheet/selection-ids';
import { allFacts } from '../../../sheet-manager/all-facts';
import { folderGroups } from '../../../sheet-manager/folder-groups';
import { managerSheet } from '../../../sheet-manager/manager-sheet';
import { sizeOptions } from '../../../sheet-manager/size-options';
import { twinIds } from '../../../sheet-manager/twin-ids';
import { visibleFacts } from '../../../sheet-manager/visible-facts';
import { visibleOrder } from '../../../sheet-manager/visible-order';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { ManagerModel } from '../SpritesPanel.type';

const useManagerModel = (): ManagerModel | null => {
  const base = useSpriteScene();
  const query = useManagerStore((state) => state.query);
  const filter = useManagerStore((state) => state.filter);
  const sortKey = useManagerStore((state) => state.sortKey);
  const sortDown = useManagerStore((state) => state.sortDown);
  const sheetId = useManagerStore((state) => state.sheetId);
  const collapsed = useManagerStore((state) => state.collapsed);
  const artwork = base?.artwork ?? null;
  const activeId = base?.scene.active?.id ?? null;
  const sheet = useMemo(() => (artwork ? managerSheet(artwork, sheetId, activeId) : null), [artwork, sheetId, activeId]);
  const facts = useMemo(() => (artwork ? allFacts(artwork, sheet) : []), [artwork, sheet]);
  const twins = useMemo(() => twinIds(facts, filter.identical), [facts, filter.identical]);
  const shown = useMemo(() => visibleFacts(facts, { query, filter, sortKey, sortDown, twins }), [facts, query, filter, sortKey, sortDown, twins]);
  const groups = useMemo(() => folderGroups(shown, new Set(collapsed)), [shown, collapsed]);
  const sizes = useMemo(() => sizeOptions(facts.map((fact) => fact.sprite)), [facts]);
  return useMemo(
    () =>
      base
        ? { artwork: base.artwork, scene: base.scene, sheet, facts, shown, groups, order: visibleOrder(groups), sizes, twins, ids: selectionIds(base.scene) }
        : null,
    [base, sheet, facts, shown, groups, sizes, twins],
  );
};

export { useManagerModel };
