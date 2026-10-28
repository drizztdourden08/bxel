/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { useBxelContext } from '../../ui-context/useBxelContext';
import { MapChips } from './sub-components/MapChips';
import { MapStateChips } from './sub-components/MapStateChips';
import { PaintingChip } from './sub-components/PaintingChip';
import { ScopeChips } from './sub-components/ScopeChips';
import './ScopeBar.css';

const ScopeBar = () => {
  const fileType = useBxelContext((context) => context.fileType);
  const surface = useBxelContext((context) => context.surface);
  const tilemap = fileType === 'tilemap' || fileType === 'tileset';
  const placing = useMapPlacing();
  if (surface === 'none' || surface === 'palette' || surface === 'preview') return null;
  return (
    <Flex gap="sm" align="center" className="scope-bar">
      {tilemap ? <MapChips /> : <ScopeChips />}
      {tilemap ? null : <PaintingChip />}
      {placing && <MapStateChips />}
    </Flex>
  );
};

export { ScopeBar };
