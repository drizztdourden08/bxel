/* @layer core @kind logic */
import { NATIVE_ASSET_EXTENSIONS } from './pack.constants';

const isNativeAsset = (name: string): boolean => {
  const lower = name.toLowerCase();
  return NATIVE_ASSET_EXTENSIONS.some((extension) => lower.endsWith(extension) && lower.length > extension.length);
};

export { isNativeAsset };
