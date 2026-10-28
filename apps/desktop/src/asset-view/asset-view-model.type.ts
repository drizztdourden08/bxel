/* @layer renderer-app @kind types */
import type { AssetView } from './asset-view.type';

interface AssetViewModel {
  key: string | null;
  view: AssetView;
  patch: (patch: Partial<AssetView>) => void;
  reset: () => void;
}

export type { AssetViewModel };
