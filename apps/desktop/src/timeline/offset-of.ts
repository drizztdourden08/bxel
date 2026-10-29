/* @layer renderer-app @kind logic */
import type { PlayPlan } from './play-plan.type';

const offsetOf = (plan: PlayPlan, cursor: number): number => plan.starts[Math.min(Math.max(cursor, 0), plan.starts.length - 1)] ?? 0;

export { offsetOf };
