/* @layer renderer-app @kind hook */
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useMapContext } from '../../../hooks/useMapContext';
import { freeName } from '../../../sheet/free-name';
import { createTilemap } from '../../../tilemap/create-tilemap';
import type { TilemapForm } from '../../../tilemap/tilemap-form.type';
import { MAP_DEFAULTS, MAP_STEM } from '../TilemapDialog.constants';
import type { MapModel } from '../TilemapDialog.type';
import { useDialogForm } from './useDialogForm';

const useMapForm = (): MapModel => {
  const names = useActiveDocument()?.state.artwork.tilemaps.map((each) => each.name) ?? [];
  const tilesetId = useMapContext()?.tileset?.id ?? null;
  return useDialogForm<TilemapForm>(() => ({ name: freeName(MAP_STEM, names), tilesetId, ...MAP_DEFAULTS }), createTilemap);
};

export { useMapForm };
