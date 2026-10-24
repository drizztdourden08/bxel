/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';
import { waitStatus } from './wait-status';

const waitSaved = (session: Session): Promise<void> => waitStatus(session, /File\s+Saved/);

export { waitSaved };
