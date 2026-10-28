/* @layer renderer-app @kind hook */
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useCanvasSurface } from '../../../canvas-surface/useCanvasSurface';
import { managerSheet } from '../../../sheet-manager/manager-sheet';
import { useBoundSheetId } from '../../../hooks/useBoundSheetId';
import { useSpriteStore } from '../../../stores/useSpriteStore';

const useAssetName = (): string => {
  const surface = useCanvasSurface();
  const artwork = useActiveDocument()?.state.artwork;
  const sheetId = useBoundSheetId();
  const activeId = useSpriteStore((state) => state.activeId);
  if (!artwork) return '';
  return surface === 'sheet' ? (managerSheet(artwork, sheetId, activeId)?.name ?? artwork.name) : artwork.name;
};

export { useAssetName };
