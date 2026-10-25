/* @layer renderer-app @kind hook */
import { toast, useSettings } from '@drizztdourden08/brock-react';
import { NO_PRESETS } from '../../../export/export.constants';
import { movePresets } from '../../../export/move-presets';
import { PRESET_TEXT } from '../../../export/preset-list.constants';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import type { AppSettings } from '../../../settings.type';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import { NO_PROJECTS } from '../PresetMoveBar.constants';
import type { PresetMoveModel } from '../PresetMoveBar.type';
import { canOffer } from './can-offer';

const usePresetMove = (): PresetMoveModel | null => {
  const view = useActiveDocument();
  const { settings, patch } = useSettings<AppSettings>();
  const documentId = view?.state.documentId;
  const inProject = useWorkspaceStore((state) => (documentId === undefined ? false : state.workspaces[documentId]?.kind === 'project'));
  const presets = settings.exportPresets ?? NO_PRESETS;
  const offered = settings.exportPresetsOfferedIn ?? NO_PROJECTS;
  if (!canOffer(view, { inProject, presets: presets.length, offered })) return null;
  const answered = [...offered, view.state.artwork.id];
  const move = (): void => {
    const moved = movePresets(presets);
    if (moved.ok) patch({ exportPresets: [], exportPresetsOfferedIn: answered });
    toast(moved.ok ? PRESET_TEXT.moved(moved.count) : PRESET_TEXT.moveFailed(moved.message), { variant: moved.ok ? 'info' : 'danger' });
  };
  const keep = (): void => patch({ exportPresetsOfferedIn: answered });
  return { question: PRESET_TEXT.moveQuestion(presets.length), move, keep };
};

export { usePresetMove };
