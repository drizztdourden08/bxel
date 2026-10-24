/* @layer renderer-app @kind logic */
import { colourMap } from './colour-map';
import { EXPORT_TEXT } from './export.constants';
import type { IndexedStatus, Target } from './export.type';

const indexedStatus = (targets: readonly Target[]): IndexedStatus => {
  const result = colourMap(targets);
  if (!result.ok) {
    const note = result.banks === 1 ? EXPORT_TEXT.indexedNoRoom : EXPORT_TEXT.indexedOff(result.banks, result.colours);
    return { state: 'unavailable', note };
  }
  const { map } = result;
  if (map.banks === 1) {
    return { state: 'available', needsApproval: false, note: EXPORT_TEXT.indexedShared(map.bankName, map.opaque), map };
  }
  return { state: 'available', needsApproval: true, note: EXPORT_TEXT.indexedCombined(map.banks, map.opaque + 1), map };
};

export { indexedStatus };
