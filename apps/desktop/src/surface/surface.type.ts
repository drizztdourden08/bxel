/* @layer renderer-app @kind types */
type Surface = 'none' | 'sprite' | 'sheet' | 'map' | 'tile';

type SurfacePart = 'symmetry' | 'view' | 'tiled' | 'playback' | 'zoom' | 'transform' | 'options' | 'paint' | 'layers';

export type { Surface, SurfacePart };
