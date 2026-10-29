/* @layer renderer-app @kind logic */
import { cellMaskRuns } from '@bxel/document';
import type { Tilemap } from '@bxel/document';
import type { MapSelection } from '../../stores/tilemap-store.type';
import { selectionCount } from '../../tilemap/selection-count';
import { selectionMaskOf } from '../../tilemap/selection-mask-of';
import { RUNS_REPLY_MAX } from './selection-runs.constants';

const mapSelectionReply = (selection: MapSelection | null, tilemap: Tilemap) => {
  if (selection === null) return { empty: true, bounds: null, cells: 0, runs: null };
  const runs = cellMaskRuns(selectionMaskOf(selection, tilemap), tilemap.columns);
  return { empty: false, bounds: selection.rect, cells: selectionCount(selection), runs: runs.length > RUNS_REPLY_MAX ? null : runs };
};

export { mapSelectionReply };
