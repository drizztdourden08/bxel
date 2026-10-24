/* @layer renderer-app @kind hook */
import type { SwatchSet, SwatchSetId } from '@bxel/project';
import { useCallback, useState } from 'react';
import { useUserSets } from '../../../swatch-library/useUserSets';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { EditorState } from '../SwatchSetEditor.type';

const useEditorState = (): EditorState => {
  const { sets, save, remove } = useUserSets();
  const [selectedId, setSelectedId] = useState<SwatchSetId | null>(null);
  const [rawIndex, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const current = sets.find((set) => set.setId === selectedId) ?? sets[0] ?? null;
  const index = Math.min(rawIndex, Math.max(0, (current?.colors.length ?? 1) - 1));

  const select = useCallback((setId: SwatchSetId): void => {
    setSelectedId(setId);
    setIndex(0);
    setError(null);
  }, []);

  const commit = useCallback(
    (next: SwatchSet): boolean => {
      const result = save(next);
      setError(result.ok ? null : SWATCH_EDITOR_TEXT.saveFailed(result.message));
      return result.ok;
    },
    [save],
  );

  return { sets, current, index, error, select, pick: setIndex, commit, remove, report: setError };
};

export { useEditorState };
