/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { useTileSize } from '../behavior/useTileSize';

const TileSizeControl = () => {
  const size = useTileSize();
  return size === null ? null : <Text>{size}</Text>;
};

export { TileSizeControl };
