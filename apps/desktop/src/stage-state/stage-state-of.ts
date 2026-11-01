/* @layer renderer-app @kind logic */
import type { StageState, StageStateInput } from './stage-state.type';

const stageStateOf = (input: StageStateInput): StageState => {
  if (input.surface === 'none') {
    if (input.loading !== null) {
      const total = Math.max(input.loading.total, 1);
      return { kind: 'loading', progress: input.loading.done / total, done: input.loading.done, total: input.loading.total };
    }
    if (input.opening) return { kind: 'loading', progress: null, done: 0, total: 0 };
    return input.fault === null ? { kind: 'ready' } : { kind: 'error', fault: input.fault };
  }
  return input.broken.length > 0 ? { kind: 'missing', links: input.broken } : { kind: 'ready' };
};

export { stageStateOf };
