/* @layer renderer-app @kind component */
import { useBxelContext } from '../../ui-context/useBxelContext';
import { useLayerThumbSetting } from './behavior/useLayerThumbSetting';
import { MapLayers } from './sub-components/MapLayers';
import { SheetLayers } from './sub-components/SheetLayers';
import { SpriteLayers } from './sub-components/SpriteLayers';

const LayerStack = () => {
  const surface = useBxelContext((context) => context.surface);
  const thumbs = useLayerThumbSetting();
  const source = { thumbSize: thumbs.size, onThumbSize: thumbs.pick };
  if (surface === 'map') return <MapLayers {...source} />;
  if (surface === 'sheet') return <SheetLayers {...source} />;
  return <SpriteLayers {...source} />;
};

export { LayerStack };
