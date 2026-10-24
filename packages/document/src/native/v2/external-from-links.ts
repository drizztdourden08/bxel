/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';
import type { ExternalIds } from '../external-ids.type';

const only = (ids: ReadonlySet<string>, wanted: boolean): ReadonlySet<string> => (wanted ? ids : new Set());

const externalFromLinks = (links: readonly AssetRef[], field: 'sprites' | 'tilesets'): ExternalIds => {
  const ids = new Set(links.map((link) => link.id));
  return { banks: new Set(), sprites: only(ids, field === 'sprites'), tilesets: only(ids, field === 'tilesets') };
};

export { externalFromLinks };
