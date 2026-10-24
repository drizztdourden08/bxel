/* @layer core @kind logic */
import type { AcceptedSource } from './accepted-source.type';
import type { RekeyRecord } from './merge-result.type';

const recordOf = (item: AcceptedSource): RekeyRecord => ({
  path: item.path,
  kind: item.slice.kind,
  oldId: item.oldId,
  newId: item.slice.id,
  count: item.map.size,
});

const rekeyRecords = (accepted: readonly AcceptedSource[]): readonly RekeyRecord[] =>
  accepted.filter((item) => item.map.size > 0).map(recordOf);

export { rekeyRecords };
