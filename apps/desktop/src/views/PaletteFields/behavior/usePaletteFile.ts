/* @layer renderer-app @kind hook */
import { getPlatform } from '@drizztdourden08/brock-react';
import { useCallback, useState } from 'react';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { SOURCE_TEXT } from '../../../palette-source/palette-source.constants';
import type { PaletteSource } from '../../../palette-source/palette-source.type';
import { sourceFromValue } from '../../../palette-source/source-from-value';
import type { PaletteFileState } from '../PaletteFields.type';

const usePaletteFile = (source: PaletteSource, onChange: (source: PaletteSource) => void): PaletteFileState => {
  const [error, setError] = useState<string | null>(null);

  const pick = useCallback((): void => {
    const documents = getPlatform().documents;
    if (!documents) {
      setError(SOURCE_TEXT.unreadable);
      return;
    }
    void pickPaletteFile(documents).then((read) => {
      if (read === null) return;
      setError(read.ok ? null : read.message);
      if (read.ok) onChange({ kind: 'file', presetId: source.presetId, file: read.palette });
    });
  }, [onChange, source.presetId]);

  const choose = useCallback(
    (value: string): void => {
      const next = sourceFromValue(value, source);
      if (next === null) {
        pick();
        return;
      }
      setError(null);
      onChange(next);
    },
    [onChange, pick, source],
  );

  return { error, choose, pick };
};

export { usePaletteFile };
