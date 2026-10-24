/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';

const watchFolder = (documents: DocumentsPort, folder: string, onChange: () => void): (() => void) => {
  let stopped = false;
  let unwatch: (() => void) | null = null;
  documents.watch(folder, {}, onChange).then(
    (stop) => {
      if (stopped) stop();
      else unwatch = stop;
    },
    () => undefined,
  );
  return () => {
    stopped = true;
    unwatch?.();
  };
};

export { watchFolder };
