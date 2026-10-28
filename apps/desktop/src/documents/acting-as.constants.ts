/* @layer renderer-app @kind constants */
import type { ActingAs } from './acting-as.type';

const acting: { current: ActingAs | null } = { current: null };

export { acting };
