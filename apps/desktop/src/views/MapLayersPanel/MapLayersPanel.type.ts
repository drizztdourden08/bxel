/* @layer renderer-app @kind types */
import type { MapLayer, MapLayerId, Tilemap } from '@bxel/document';

interface MapLayerRowProps {
  layer: MapLayer;
  selected: boolean;
  onSelect: (id: MapLayerId) => void;
}

interface MapLayerToolbarProps {
  onRename: () => void;
}

interface MapLayerRenameProps {
  layer: MapLayer;
  onClose: () => void;
}

interface MapPickerProps {
  maps: readonly Tilemap[];
  current: Tilemap;
}

export type { MapLayerRenameProps, MapLayerRowProps, MapLayerToolbarProps, MapPickerProps };
