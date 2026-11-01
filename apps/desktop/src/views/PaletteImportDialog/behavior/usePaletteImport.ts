/* @layer renderer-app @kind hook */
import { getPlatform } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import type { PaletteTarget } from '../../../editor/editor.type';
import { useCommitPlan } from '../../../hooks/useCommitPlan';
import { importPlan } from '../../../palette-import/import-plan';
import { IMPORT_TEXT } from '../../../palette-import/palette-import.constants';
import type { ImportMode, ImportSource } from '../../../palette-import/palette-import.type';
import { sourceFromText } from '../../../palette-import/source-from-text';
import { pickPaletteFile } from '../../../palette-source/pick-palette-file';
import { usePaletteImportStore } from '../../../stores/usePaletteImportStore';
import { previewError } from '../../../transactions/preview-error';
import type { PaletteImportRequest } from '../../../stores/palette-panel-store.type';
import type { ImportState } from '../PaletteImportDialog.type';

const usePaletteImport = (request: PaletteImportRequest, target: PaletteTarget): ImportState => {
  const [source, setSource] = useState<ImportSource | null>(null);
  const [text, setTextValue] = useState('');
  const [mode, setMode] = useState<ImportMode>('append');
  const [notice, setNotice] = useState<string | null>(null);
  const plan = useMemo(() => (source ? importPlan(target.bank, source.colors, mode) : null), [source, target.bank, mode]);
  const error = useMemo(() => previewError(request.documentId, plan) ?? notice, [plan, request.documentId, notice]);
  const setText = useCallback((value: string) => {
    setTextValue(value);
    const read = value.trim() === '' ? null : sourceFromText(value);
    setSource(read);
    setNotice(value.trim() !== '' && read === null ? IMPORT_TEXT.unreadable : null);
  }, []);
  const chooseFile = useCallback(() => {
    const { documents } = getPlatform();
    if (!documents) return;
    void pickPaletteFile(documents).then((read) => {
      if (read === null) return;
      setTextValue('');
      setSource(read.ok ? { name: read.palette.name, colors: read.palette.colors } : null);
      setNotice(read.ok ? null : read.message);
    });
  }, []);
  const cancel = useCallback(() => usePaletteImportStore.getState().close(), []);
  const { failure, apply } = useCommitPlan(request.documentId, plan, { close: cancel });
  return { source, text, mode, plan, error, failure, setMode, setText, chooseFile, apply, cancel };
};

export { usePaletteImport };
