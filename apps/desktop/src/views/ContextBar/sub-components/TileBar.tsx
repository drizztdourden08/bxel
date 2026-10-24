/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { MapChips } from './MapChips';
import { TileModeSwitch } from './TileModeSwitch';

const TileBar = () => (
  <Flex gap="sm" align="center">
    <TileModeSwitch />
    <MapChips />
  </Flex>
);

export { TileBar };
