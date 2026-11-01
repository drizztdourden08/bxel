/* @layer renderer-app @kind logic */
import type { RenamePlan } from '../../sheet-manager/manager.type';
import { NO_CHANGE } from './manager-direct.constants';

const problemOf = (plan: RenamePlan): string => plan.entries.find((entry) => entry.error !== null)?.error ?? NO_CHANGE;

export { problemOf };
