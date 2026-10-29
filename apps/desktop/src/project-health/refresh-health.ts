/* @layer renderer-app @kind logic */
import { useHealthStore } from '../stores/useHealthStore';
import { scanHealth } from './scan-health';

let running: Promise<void> | null = null;
let again = false;

/** Scans the project and puts the result in the health store. A scan asked for while one runs makes one more run after it. */
const refreshHealth = (): Promise<void> => {
  if (running !== null) {
    again = true;
    return running;
  }
  const { set, state } = useHealthStore.getState();
  if (state.status !== 'ready') set({ status: 'scanning' });
  running = scanHealth()
    .then((found) => set(found ?? { status: 'idle' }))
    .catch(() => set({ status: 'idle' }))
    .finally(() => {
      running = null;
      if (again) {
        again = false;
        void refreshHealth();
      }
    });
  return running;
};

export { refreshHealth };
