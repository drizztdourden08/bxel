/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { SpriteId } from '@bxel/document';
import type { ExportPlan, ExportSettings } from '../../../export/export.type';
import { planExport } from '../../../export/plan-export';
import { useActiveDocument } from '../../../hooks/useActiveDocument';

const useExportPlan = (settings: ExportSettings, selectedIds: readonly SpriteId[]): ExportPlan | null => {
  const state = useActiveDocument()?.state;
  return useMemo(
    () => (state ? planExport({ frozen: { revision: state.revision, artwork: state.artwork }, settings, selectedIds }) : null),
    [state, settings, selectedIds],
  );
};

export { useExportPlan };
