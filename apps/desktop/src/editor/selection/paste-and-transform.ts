/* @layer renderer-app @kind logic */
import { commitPending } from '../pending/commit-pending';
import { startTransform } from '../transform/start-transform';
import { pasteFromSystem } from './paste-from-system';

const pasteAndTransform = async (): Promise<boolean> => {
  const placed = await pasteFromSystem('place');
  return placed && commitPending() && startTransform();
};

export { pasteAndTransform };
