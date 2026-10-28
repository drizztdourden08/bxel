/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useViewStore } from '../../../stores/useViewStore';
import type { SurfaceProps } from '../ViewPanel.type';
import { MajorField } from './MajorField';
import { TileFields } from './TileFields';

const GridSpacing = ({ surface }: SurfaceProps) => {
  const major = useViewStore((state) => state.gridMajor);
  const tileOn = useViewStore((state) => state.gridTile);
  const fixed = surface === 'map' || surface === 'sheet';
  return (
    <Flex direction="column" gap="xs" className="view-panel__spacing">
      {major && !fixed && <MajorField />}
      {tileOn && <TileFields fixed={fixed} />}
    </Flex>
  );
};

export { GridSpacing };
