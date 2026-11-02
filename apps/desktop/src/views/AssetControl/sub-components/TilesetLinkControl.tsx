/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { useTilesetLink } from '../behavior/useTilesetLink';
import { ASSET_CONTROL_TEXT } from '../AssetControl.constants';

const TilesetLinkControl = () => {
  const model = useTilesetLink();
  if (model === null) return null;
  return (
    <Button size="sm" variant="secondary" aria-label={ASSET_CONTROL_TEXT.openTileset(model.name)} onClick={model.open}>
      {model.name}
    </Button>
  );
};

export { TilesetLinkControl };
