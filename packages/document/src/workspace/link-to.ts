/* @layer core @kind logic */
import type { AssetRef } from '../model/asset.type';
import { relativeLinkPath } from './relative-link-path';
import type { SliceContext } from './slice-context.type';

const linkTo = (context: SliceContext, ids: readonly string[]): readonly AssetRef[] =>
  [...new Set(ids)].flatMap((id) => {
    const target = context.paths.get(context.owners.get(id) ?? id);
    return target === undefined ? [] : [{ id, path: relativeLinkPath(context.own, target) }];
  });

export { linkTo };
