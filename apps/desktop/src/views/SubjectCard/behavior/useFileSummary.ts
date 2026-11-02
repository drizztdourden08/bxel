/* @layer renderer-app @kind hook */
import { getPlatform } from '@drizztdourden08/brock-react';
import { useEffect, useState } from 'react';
import { readFileSummary } from '../../../properties-subject/read-file-summary';
import type { FileSummaryData } from '../../../properties-subject/properties-subject.type';
import type { SummaryLoad } from './useFileSummary.type';

const useFileSummary = (path: string): { readonly loaded: boolean; readonly data: FileSummaryData | null } => {
  const [load, setLoad] = useState<SummaryLoad | null>(null);
  useEffect(() => {
    let current = true;
    const { documents } = getPlatform();
    if (!documents) return undefined;
    void readFileSummary(documents, path).then((data) => {
      if (current) setLoad({ path, data });
    });
    return () => {
      current = false;
    };
  }, [path]);
  const loaded = load !== null && load.path === path;
  return { loaded, data: loaded ? load.data : null };
};

export { useFileSummary };
