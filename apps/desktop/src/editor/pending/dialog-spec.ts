/* @layer renderer-app @kind logic */
import type { DialogSpec, PendingEdit } from './pending.type';

const dialogSpec = (pending: PendingEdit | null): DialogSpec | null => {
  const spec = pending?.spec;
  if (!pending?.editing) return null;
  return spec?.kind === 'rotate' || spec?.kind === 'scale' ? spec : null;
};

export { dialogSpec };
