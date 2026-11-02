/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import type { CommandHold, HoldContext } from '@drizztdourden08/brock-react';
import { useViewStore } from '../stores/useViewStore';
import type { ViewToggle } from '../stores/view-store.type';
import { HOLD_TAP_MS } from './hold-toggle.constants';

const before = new Map<ViewToggle, boolean>();

const speak = (label: string, toggle: ViewToggle): void => announce(`${label} ${useViewStore.getState()[toggle] ? 'on' : 'off'}`);

const pressToggle = (toggle: ViewToggle, label: string): void => {
  before.set(toggle, useViewStore.getState()[toggle]);
  useViewStore.getState().toggleView(toggle);
  speak(label, toggle);
};

const holdToggle = (toggle: ViewToggle, label: string): CommandHold => ({
  tapMs: HOLD_TAP_MS,
  release: (context: HoldContext) => {
    const wasOn = before.get(toggle) ?? true;
    before.delete(toggle);
    if (context.tap || wasOn) return;
    useViewStore.getState().setToggles({ [toggle]: false });
    speak(label, toggle);
  },
});

export { holdToggle, pressToggle };
