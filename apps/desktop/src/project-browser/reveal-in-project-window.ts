/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { PROJECT_HUB } from '../config-entry/config-entry.constants';
import { parentOf } from '../workspace/parent-of';
import { toSlashes } from '../workspace/to-slashes';
import { useBrowserStore } from './useBrowserStore';

const revealInProjectWindow = (path: string): void => {
  const slashed = toSlashes(path);
  useBrowserStore.getState().reveal(parentOf(slashed), slashed);
  nav.open(`${PROJECT_HUB}/browse`);
};

export { revealInProjectWindow };
