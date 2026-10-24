/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { layerRow } from './layer-row';

const shiftLayer = (session: Session, name: string, direction: 'Up' | 'Down'): Promise<void> =>
  layerRow(session, name).dispatchEvent('keydown', { key: `Arrow${direction}`, altKey: true, bubbles: true, cancelable: true });

export { shiftLayer };
