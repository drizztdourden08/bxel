/* @layer renderer-app @kind logic */
import type { CommandHold, HoldContext } from '@drizztdourden08/brock-react';
import { useViewStore } from '../stores/useViewStore';
import type { ViewToggle } from '../stores/view-store.type';
import { HOLD_TAP_MS } from './hold-toggle.constants';
import { speakToggle } from './speak-toggle';
import { toggleBefore } from './toggle-before';

const holdToggle = (toggle: ViewToggle, label: string): CommandHold => ({
  tapMs: HOLD_TAP_MS,
  release: (context: HoldContext) => {
    const wasOn = toggleBefore.get(toggle) ?? true;
    toggleBefore.delete(toggle);
    if (context.tap || wasOn) return;
    useViewStore.getState().setToggles({ [toggle]: false });
    speakToggle(label, toggle);
  },
});

export { holdToggle };
