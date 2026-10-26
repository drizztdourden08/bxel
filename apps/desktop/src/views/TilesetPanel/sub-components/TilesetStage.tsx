/* @layer renderer-app @kind component */
import { useTilesetModel } from '../behavior/useTilesetModel';
import { TilesetStageBody } from './TilesetStageBody';

const TilesetStage = () => {
  const model = useTilesetModel();
  return model ? <TilesetStageBody model={model} /> : null;
};

export { TilesetStage };
