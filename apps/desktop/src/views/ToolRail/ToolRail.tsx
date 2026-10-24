/* @layer renderer-app @kind component */
import { useMapPlacing } from '../../hooks/useMapPlacing';
import { MapToolRail } from './sub-components/MapToolRail';
import { SpriteToolRail } from './sub-components/SpriteToolRail';
import './ToolRail.css';

const ToolRail = () => (useMapPlacing() ? <MapToolRail /> : <SpriteToolRail />);

export { ToolRail };
