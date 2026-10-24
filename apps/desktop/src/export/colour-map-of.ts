/* @layer renderer-app @kind logic */
import type { ColourMap, ExportSettings, IndexedStatus } from './export.type';
import { wantsMap } from './wants-map';

const colourMapOf = (settings: ExportSettings, indexed: IndexedStatus): ColourMap | null =>
  wantsMap(settings) && indexed.state === 'available' && (!indexed.needsApproval || settings.approved) ? indexed.map : null;

export { colourMapOf };
