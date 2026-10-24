/* @layer renderer-app @kind component */
import { useMapView } from './behavior/useMapView';
import { TilemapEmpty } from './sub-components/TilemapEmpty';
import { TilemapSurface } from './sub-components/TilemapSurface';
import './TilemapCanvas.css';

const TilemapCanvas = () => {
  const view = useMapView();
  return view ? <TilemapSurface view={view} /> : <TilemapEmpty />;
};

export { TilemapCanvas };
