/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';

const newProjectFromHub = (): void => {
  nav.close();
  useProjectStore.getState().showDialog(true);
};

export { newProjectFromHub };
