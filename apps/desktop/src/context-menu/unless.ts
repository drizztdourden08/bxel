/* @layer renderer-app @kind logic */
import type { Gate } from './unless.type';

const unless = (allowed: boolean, reason: string): Gate => (allowed ? {} : { disabled: true, reason });

export { unless };
