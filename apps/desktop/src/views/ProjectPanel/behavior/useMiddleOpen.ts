/* @layer renderer-app @kind hook */
import type { MouseEvent } from 'react';
import { ITEM_ATTRIBUTE, MIDDLE_BUTTON } from '../ProjectPanel.constants';
import type { MiddleOpen, ProjectPanelModel } from '../ProjectPanel.type';

const useMiddleOpen = (model: ProjectPanelModel): MiddleOpen => ({
  onMouseDown: (event: MouseEvent<HTMLElement>) => {
    if (event.button === MIDDLE_BUTTON) event.preventDefault();
  },
  onAuxClick: (event: MouseEvent<HTMLElement>) => {
    if (event.button !== MIDDLE_BUTTON || !(event.target instanceof Element)) return;
    const key = event.target.closest(`[${ITEM_ATTRIBUTE}]`)?.getAttribute(ITEM_ATTRIBUTE);
    const item = key === null || key === undefined ? undefined : model.browser.itemOf(key);
    if (item === undefined) return;
    event.preventDefault();
    model.rowActions.openBackground(item);
  },
});

export { useMiddleOpen };
