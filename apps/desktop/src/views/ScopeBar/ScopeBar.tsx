/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { MapChips } from './sub-components/MapChips';
import { MapStateChips } from './sub-components/MapStateChips';
import { PaintingChip } from './sub-components/PaintingChip';
import { ScopeChips } from './sub-components/ScopeChips';
import './ScopeBar.css';

const ScopeBar = () => {
  const tilemap = useSpriteStore((state) => state.mode === 'tilemap');
  const placing = useMapPlacing();
  return (
    <Flex gap="sm" align="center" className="scope-bar">
      {tilemap ? <MapChips /> : <ScopeChips />}
      {tilemap ? null : <PaintingChip />}
      {placing && <MapStateChips />}
    </Flex>
  );
};

export { ScopeBar };
