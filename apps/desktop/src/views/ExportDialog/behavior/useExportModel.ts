/* @layer renderer-app @kind hook */
import { animationClipNames } from '../../../export/animation-clip-names';
import { exportBlocker } from '../../../export/export-blocker';
import { sheetLabel } from '../../../export/sheet-label';
import { IMAGE_EXTENSION } from '../../../export/export.constants';
import { useExportStore } from '../../../export/useExportStore';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { listSprites } from '../../../sheet/list-sprites';
import type { ExportModel } from '../ExportDialog.type';
import { useCurrentPick } from './useCurrentPick';
import { useExportActions } from './useExportActions';
import { useExportDraft } from './useExportDraft';
import { useExportPlan } from './useExportPlan';
import { useExportPresets } from './useExportPresets';
import { usePreviewSource } from './usePreviewSource';
import { useSelectedSprites } from './useSelectedSprites';

const useExportModel = (): ExportModel | null => {
  const draft = useExportDraft();
  const selectedIds = useSelectedSprites();
  const current = useCurrentPick();
  const plan = useExportPlan(draft.settings, selectedIds, current);
  const presets = useExportPresets(draft);
  const actions = useExportActions(draft, selectedIds, plan?.files[0]?.name.replace(IMAGE_EXTENSION, '') ?? '');
  const source = usePreviewSource(plan);
  const running = useExportStore((state) => state.running);
  const artwork = useActiveDocument()?.state.artwork;
  if (!plan || !artwork) return null;
  const sprites = listSprites(artwork);
  const animation = artwork.animations.find((each) => each.id === draft.settings.animationId);
  const tags = animation ? animationClipNames(animation) : (sprites[0]?.tags.map((tag) => tag.name) ?? []);
  const blocker = exportBlocker(plan, draft.settings);
  return {
    draft,
    plan,
    presets,
    actions,
    source,
    blocker,
    running,
    spriteCount: sprites.length,
    selectedCount: selectedIds.length,
    tags,
    sheetLabel: sheetLabel(artwork, draft.settings),
  };
};

export { useExportModel };
