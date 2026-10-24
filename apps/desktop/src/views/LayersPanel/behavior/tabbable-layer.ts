/* @layer renderer-app @kind logic */
import type { LayerId } from '@bxel/document';
import type { LayerItem } from '../LayersPanel.type';

const tabbableLayer = (items: readonly LayerItem[], focusedId: string | null, selectedId: LayerId): string | undefined => {
  const known = (id: string | null): id is string => id !== null && items.some((item) => item.id === id);
  if (known(focusedId)) return focusedId;
  return known(selectedId) ? selectedId : items[0]?.id;
};

export { tabbableLayer };
