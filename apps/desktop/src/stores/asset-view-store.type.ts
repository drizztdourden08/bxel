/* @layer renderer-app @kind types */
import type { AssetView } from '../asset-view/asset-view.type';

interface AssetViewState {
  views: Readonly<Record<string, Partial<AssetView>>>;
  patch: (key: string, patch: Partial<AssetView>) => void;
  reset: (key: string) => void;
}

export type { AssetViewState };
