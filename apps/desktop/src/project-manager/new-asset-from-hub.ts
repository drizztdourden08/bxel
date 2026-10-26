/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import { startNewAsset } from '../project/start-new-asset';
import type { CreatableKind } from '../stores/creation-store.type';

const newAssetFromHub = (kind: CreatableKind): void => {
  nav.close();
  startNewAsset(kind);
};

export { newAssetFromHub };
