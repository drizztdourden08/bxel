/* @layer renderer-app @kind logic */
import { ITEM_SELECTOR } from '../ProjectPanel.constants';

const focusRow = (key: string): void => {
  const row = [...document.querySelectorAll<HTMLElement>(ITEM_SELECTOR)].find((each) => each.dataset.treeKey === key);
  row?.focus({ preventScroll: true });
};

export { focusRow };
