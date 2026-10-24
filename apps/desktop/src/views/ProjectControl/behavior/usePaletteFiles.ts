/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { paletteChoice } from '../../../asset-defaults/palette-choice';
import { locateAsset } from '../../../project-meta/locate-asset';
import { useProjectFocus } from '../../../project-config/useProjectFocus';
import type { PaletteFileRow } from '../ProjectControl.type';

const usePaletteFiles = (): readonly PaletteFileRow[] => {
  const focus = useProjectFocus();
  return useMemo(() => {
    if (!focus?.artwork) return [];
    const { artwork, paths, project } = focus;
    return artwork.banks.flatMap((bank) => {
      const path = paths.get(bank.id);
      const location = path === undefined ? null : locateAsset(project.folders, path);
      if (location === null) return [];
      return [{ id: bank.id, name: bank.name, path: location.path, choice: paletteChoice({ kind: 'file', folderId: location.folderId, path: location.path }), users: artwork.sprites.filter((sprite) => sprite.bankId === bank.id).length }];
    });
  }, [focus]);
};

export { usePaletteFiles };
