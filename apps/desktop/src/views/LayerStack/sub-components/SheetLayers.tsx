/* @layer renderer-app @kind component */
import { useSheetLayerModel } from '../behavior/useSheetLayerModel';
import type { LayerSourceProps } from '../LayerStack.type';
import { LayerStackView } from './LayerStackView';

const SheetLayers = (props: LayerSourceProps) => <LayerStackView model={useSheetLayerModel()} {...props} />;

export { SheetLayers };
