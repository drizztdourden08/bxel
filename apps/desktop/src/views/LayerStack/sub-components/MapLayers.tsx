/* @layer renderer-app @kind component */
import { useMapLayerModel } from '../behavior/useMapLayerModel';
import type { LayerSourceProps } from '../LayerStack.type';
import { LayerStackView } from './LayerStackView';

const MapLayers = (props: LayerSourceProps) => <LayerStackView model={useMapLayerModel()} {...props} />;

export { MapLayers };
