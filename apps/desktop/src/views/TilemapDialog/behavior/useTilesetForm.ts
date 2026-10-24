/* @layer renderer-app @kind hook */
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { freeName } from '../../../sheet/free-name';
import { createTileset } from '../../../tilemap/create-tileset';
import type { TilesetForm } from '../../../tilemap/tilemap-form.type';
import { TILESET_DEFAULTS, TILESET_STEM } from '../TilemapDialog.constants';
import type { TilesetModel } from '../TilemapDialog.type';
import { useDialogForm } from './useDialogForm';

const useTilesetForm = (): TilesetModel => {
  const names = useActiveDocument()?.state.artwork.tilesets.map((each) => each.name) ?? [];
  return useDialogForm<TilesetForm>(() => ({ name: freeName(TILESET_STEM, names), ...TILESET_DEFAULTS }), createTileset);
};

export { useTilesetForm };
