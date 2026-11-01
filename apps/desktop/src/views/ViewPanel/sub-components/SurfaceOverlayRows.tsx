/* @layer renderer-app @kind component */
import type { SurfaceProps } from '../ViewPanel.type';
import { MapOverlayRows } from './MapOverlayRows';
import { SheetOverlayRows } from './SheetOverlayRows';

const SurfaceOverlayRows = ({ surface }: SurfaceProps) => {
  if (surface === 'sheet') return <SheetOverlayRows />;
  if (surface === 'map') return <MapOverlayRows />;
  return null;
};

export { SurfaceOverlayRows };
