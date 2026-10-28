/* @layer electron-main @kind logic */
import { HANDOFF_KIND } from './restart-handoff.constants';
import type { LiveSession } from './assistant.type';

const handoffOf = (session: LiveSession, key: string, now: number = Date.now()) => ({ kind: HANDOFF_KIND, key, grant: session.grant, at: now });

export { handoffOf };
