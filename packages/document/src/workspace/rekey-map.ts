/* @layer core @kind logic */
import type { IdSource } from '../ids/id-source.type';
import { freshId } from './fresh-id';

const rekeyMap = (
  owned: ReadonlySet<string>,
  claimed: ReadonlySet<string>,
  ids: IdSource,
  taken: Set<string>,
): ReadonlyMap<string, string> =>
  new Map([...owned].filter((id) => claimed.has(id)).map((id) => [id, freshId(id, ids, taken)] as const));

export { rekeyMap };
