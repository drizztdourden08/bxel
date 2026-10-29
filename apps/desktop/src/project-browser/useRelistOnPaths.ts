/* @layer renderer-app @kind hook */
import { useEffect, useMemo, useRef } from 'react';
import type { Workspace } from '../workspace/workspace.type';

const joined = (map: ReadonlyMap<string, string> | undefined): string => (map ? [...map].map((pair) => pair.join('=')).sort().join('|') : '');

const useRelistOnPaths = (workspace: Workspace | undefined, refresh: () => void): void => {
  const paths = workspace?.paths;
  const saved = workspace?.saved;
  const signature = useMemo(() => `${joined(paths)}#${joined(saved)}`, [paths, saved]);
  const seen = useRef(signature);

  useEffect(() => {
    if (seen.current === signature) return;
    seen.current = signature;
    refresh();
  }, [signature, refresh]);
};

export { useRelistOnPaths };
