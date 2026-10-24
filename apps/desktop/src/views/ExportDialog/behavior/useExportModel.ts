/* @layer renderer-app @kind hook */
import { exportBlocker } from '../../../export/export-blocker';
import { IMAGE_EXTENSION } from '../../../export/export.constants';
import { useExportStore } from '../../../export/useExportStore';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import type { ExportModel } from '../ExportDialog.type';
import { useExportActions } from './useExportActions';
import { useExportDraft } from './useExportDraft';
import { useExportPlan } from './useExportPlan';
import { useExportPresets } from './useExportPresets';
import { usePreviewSource } from './usePreviewSource';
import { useSelectedSprites } from './useSelectedSprites';

const useExportModel = (): ExportModel | null => {
  const draft = useExportDraft();
  const selectedIds = useSelectedSprites();
  const plan = useExportPlan(draft.settings, selectedIds);
  const presets = useExportPresets(draft);
  const actions = useExportActions(draft, selectedIds, plan?.files[0]?.name.replace(IMAGE_EXTENSION, '') ?? '');
  const source = usePreviewSource(plan);
  const running = useExportStore((state) => state.running);
  const artwork = useActiveDocument()?.state.artwork;
  if (!plan || !artwork) return null;
  const tags = artwork.sprites[0]?.tags.map((tag) => tag.name) ?? [];
  const blocker = exportBlocker(plan, draft.settings);
  return {
    draft,
    plan,
    presets,
    actions,
    source,
    blocker,
    running,
    spriteCount: artwork.sprites.length,
    selectedCount: selectedIds.length,
    tags,
  };
};

export { useExportModel };
