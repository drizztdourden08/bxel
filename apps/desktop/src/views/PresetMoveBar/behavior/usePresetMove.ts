/* @layer renderer-app @kind hook */
import { toast, useSettings } from '@drizztdourden08/brock-react';
import { NO_PRESETS } from '../../../export/export.constants';
import { movePresets } from '../../../export/move-presets';
import { PRESET_TEXT } from '../../../export/preset-list.constants';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import type { AppSettings } from '../../../settings.type';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import type { PresetMoveModel } from '../PresetMoveBar.type';

const usePresetMove = (): PresetMoveModel | null => {
  const view = useActiveDocument();
  const { settings, patch } = useSettings<AppSettings>();
  const documentId = view?.state.documentId;
  const inProject = useWorkspaceStore((state) => (documentId === undefined ? false : state.workspaces[documentId]?.kind === 'project'));
  const presets = settings.exportPresets ?? NO_PRESETS;
  if (!view || view.state.readOnly || !inProject || presets.length === 0 || settings.exportPresetsOffered === true) return null;
  const move = (): void => {
    const moved = movePresets(presets);
    if (moved.ok) patch({ exportPresets: [], exportPresetsOffered: true });
    toast(moved.ok ? PRESET_TEXT.moved(moved.count) : PRESET_TEXT.moveFailed(moved.message), { variant: moved.ok ? 'info' : 'danger' });
  };
  const keep = (): void => patch({ exportPresetsOffered: true });
  return { question: PRESET_TEXT.moveQuestion(presets.length), move, keep };
};

export { usePresetMove };
