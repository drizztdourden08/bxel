/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { assetKeys } from './asset-keys';
import { firstTabKey } from './first-tab-key';
import { keyId } from './key-id';
import type { WorkspaceSeed } from './workspace.type';

const looseSeed = (artwork: Artwork, unsaved: boolean, readOnly = false): WorkspaceSeed => ({
  kind: 'loose',
  name: artwork.name,
  root: null,
  dirs: {},
  projectFile: null,
  paths: new Map(),
  dirty: new Set(unsaved ? assetKeys(artwork).filter((key) => key.kind !== 'palette').map(keyId) : []),
  legacy: null,
  artwork,
  readOnly,
  unsaved,
  focus: firstTabKey(artwork),
});

export { looseSeed };
