/* @layer renderer-app @kind hook */
import { useEffect, useRef } from 'react';
import { useContextMenu } from '@drizztdourden08/brock-react';
import type { ContextMenuContext } from '@drizztdourden08/brock-react';
import { ruledEntries } from '../../../context-menu/ruled-entries';
import { menuTarget } from '../../../context-menu/menu-target';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { LAYER_MENU_TEXT } from '../LayerStack.constants';
import type { LayerStackModel } from '../LayerStack.type';
import type { PickHow } from './pick-layer.type';
import { layerMenuEntries } from './layer-menu-entries';

const rowIdOf = (context: Pick<ContextMenuContext, 'target'>): string | undefined => menuTarget(context, LAYER_MENU_TEXT.row)?.dataset.treeKey;

const useLayerMenu = (model: LayerStackModel, picked: readonly string[], pick: (id: string, how: PickHow) => void): void => {
  const latest = useRef({ model, picked, pick });
  useEffect(() => {
    latest.current = { model, picked, pick };
  });
  useContextMenu(COMMAND_ZONE.layers, {
    label: LAYER_MENU_TEXT.label,
    beforeOpen: (context) => {
      const id = rowIdOf(context);
      const now = latest.current;
      if (id !== undefined && !now.picked.includes(id)) now.pick(id, 'replace');
      else if (id !== undefined && id !== now.model.activeId) now.model.actions.activate(id);
    },
    selection: ({ target }) => {
      const id = rowIdOf({ target });
      const { picked: now } = latest.current;
      return id === undefined || now.includes(id) ? now : [id];
    },
    entries: ruledEntries((context) => layerMenuEntries(latest.current.model, rowIdOf(context), [...(context.selection ?? latest.current.picked)])),
  });
};

export { useLayerMenu };
