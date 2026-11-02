/* @layer renderer-app @kind logic */
import { useViewStore } from '../stores/useViewStore';
import type { ViewToggle } from '../stores/view-store.type';
import { speakToggle } from './speak-toggle';
import { toggleBefore } from './toggle-before';

const pressToggle = (toggle: ViewToggle, label: string): void => {
  toggleBefore.set(toggle, useViewStore.getState()[toggle]);
  useViewStore.getState().toggleView(toggle);
  speakToggle(label, toggle);
};

export { pressToggle };
