/* @layer renderer-app @kind hook */
import type { BankId } from '@bxel/document';
import { useMemo } from 'react';
import type { PaletteTarget } from '../editor/editor.type';
import { paletteFileTarget } from '../palette-panel/palette-file-target';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { useActiveDocument } from './useActiveDocument';
import { useEditorTarget } from './useEditorTarget';

const usePaletteTarget = (): PaletteTarget | null => {
  const editor = useEditorTarget();
  const view = useActiveDocument();
  const paletteId = useWorkspaceStore((state) => {
    const key = state.tabs.find((each) => each.id === state.activeTab)?.key;
    return key?.kind === 'palette' ? key.id : null;
  });
  return useMemo(() => {
    if (paletteId === null) return editor;
    return view ? paletteFileTarget(view, paletteId as BankId) : null;
  }, [paletteId, editor, view]);
};

export { usePaletteTarget };
