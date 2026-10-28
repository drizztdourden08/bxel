/* @layer renderer-app @kind component */
import { useSurface } from '../../hooks/useSurface';
import { useLayerThumbSetting } from './behavior/useLayerThumbSetting';
import { useMapLayerModel } from './behavior/useMapLayerModel';
import { useSheetLayerModel } from './behavior/useSheetLayerModel';
import { useSpriteLayerModel } from './behavior/useSpriteLayerModel';
import type { LayerSourceProps } from './LayerStack.type';
import { LayerStackView } from './sub-components/LayerStackView';

const SpriteLayers = (props: LayerSourceProps) => <LayerStackView model={useSpriteLayerModel()} {...props} />;

const MapLayers = (props: LayerSourceProps) => <LayerStackView model={useMapLayerModel()} {...props} />;

const SheetLayers = (props: LayerSourceProps) => <LayerStackView model={useSheetLayerModel()} {...props} />;

/** The layers of whatever the editor shows: a sprite, a tile, an animation frame, a tilemap, or the layer names of a sheet. */
const LayerStack = () => {
  const surface = useSurface();
  const thumbs = useLayerThumbSetting();
  const source = { thumbSize: thumbs.size, onThumbSize: thumbs.pick };
  if (surface === 'map') return <MapLayers {...source} />;
  if (surface === 'sheet') return <SheetLayers {...source} />;
  return <SpriteLayers {...source} />;
};

export { LayerStack };
