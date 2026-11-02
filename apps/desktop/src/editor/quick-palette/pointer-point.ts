/* @layer renderer-app @kind logic */
import { useLastPointerStore } from '../../stores/useLastPointerStore';
import type { QuickPoint } from './quick-palette.type';

const lastPointer = (): QuickPoint =>
  useLastPointerStore.getState().point ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };

export { lastPointer };
