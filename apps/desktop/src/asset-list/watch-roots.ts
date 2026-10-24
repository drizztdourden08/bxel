/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { WATCH_DELAY_MS } from './asset-list.constants';

const watchRoots = (documents: DocumentsPort, roots: readonly string[], onChange: () => void): (() => void) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const bounce = (): void => {
    clearTimeout(timer);
    timer = setTimeout(onChange, WATCH_DELAY_MS);
  };
  const stops = roots.map((root) => documents.watch(root, { recursive: true }, bounce));
  return () => {
    clearTimeout(timer);
    for (const stop of stops) void stop.then((end) => end(), () => undefined);
  };
};

export { watchRoots };
