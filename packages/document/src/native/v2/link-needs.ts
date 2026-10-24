/* @layer core @kind logic */
import type { AssetRef } from '../../model/asset.type';

const requireLinks = (needed: readonly string[], links: readonly AssetRef[], what: string): void => {
  const have = new Set(links.map((link) => link.id));
  const lacking = needed.find((id) => !have.has(id));
  if (lacking !== undefined) throw new Error(`${what} needs a link for ${lacking}.`);
};

export { requireLinks };
