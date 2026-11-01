/* @layer renderer-app @kind logic */
import type { DragAsset } from './asset-drag.type';

const assetOf = (each: unknown): DragAsset[] => {
  if (typeof each !== 'object' || each === null) return [];
  const { id, kind, assetId, path } = each as Record<string, unknown>;
  return typeof id === 'string' && typeof kind === 'string' && typeof path === 'string' ? [{ id, kind, assetId: typeof assetId === 'string' ? assetId : null, path }] : [];
};

const readNativeAssets = (text: string): readonly DragAsset[] => {
  try {
    const parsed: unknown = JSON.parse(text);
    return Array.isArray(parsed) ? parsed.flatMap(assetOf) : [];
  } catch {
    return [];
  }
};

export { readNativeAssets };
