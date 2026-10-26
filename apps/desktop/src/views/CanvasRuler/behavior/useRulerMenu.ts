/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { RULER_MENU } from '../CanvasRuler.constants';
import { rulerMenuEntries } from './ruler-menu-entries';

const config = {
  label: RULER_MENU.label,
  anchor: ({ target }: { target: Element }) => {
    const rect = target.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  },
  entries: rulerMenuEntries,
};

const useRulerMenu = (): void => {
  useContextMenu(RULER_MENU.zone('x'), config);
  useContextMenu(RULER_MENU.zone('y'), config);
};

export { useRulerMenu };
