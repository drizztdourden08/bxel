/* @layer core @kind logic */
import type { AssetContent } from '../model/asset.type';
import type { ContentKey } from './content-key.type';

const pickContent = (content: AssetContent, keys: readonly ContentKey[]): AssetContent =>
  Object.fromEntries(keys.flatMap((key) => (content[key] === undefined ? [] : [[key, content[key]] as const])));

export { pickContent };
