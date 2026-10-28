/* @layer renderer-app @kind component */
import { useSpriteLayerModel } from '../behavior/useSpriteLayerModel';
import type { LayerSourceProps } from '../LayerStack.type';
import { LayerStackView } from './LayerStackView';

const SpriteLayers = (props: LayerSourceProps) => <LayerStackView model={useSpriteLayerModel()} {...props} />;

export { SpriteLayers };
