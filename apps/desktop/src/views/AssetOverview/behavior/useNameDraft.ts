/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import type { NameDraft } from '../AssetOverview.type';

const useNameDraft = (name: string, rename: (name: string) => string | null): NameDraft => {
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const commit = useCallback(
    (value: string): void => {
      if (value.trim() === name) {
        setError(null);
        return;
      }
      const failure = rename(value);
      setError(failure);
      if (failure !== null) setDraft(name);
    },
    [name, rename],
  );
  return { draft, error, setDraft, commit };
};

export { useNameDraft };
