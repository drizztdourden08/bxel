/* @layer renderer-app @kind constants */
import { COMMAND_NAME } from '@bxel/document';
import { spritesTarget } from '../sheet/sprites-target';
import { useViewStore } from '../stores/useViewStore';
import { ASSET_LABEL } from './asset-config.constants';
import type { AssetFields, AssetFocus, AssetOutcome } from './asset-config.type';
import { focusAssetOf } from './focus-asset-of';
import { runField } from './run-field';

const setPlatform = (focus: AssetFocus, value: unknown): AssetOutcome => {
  const sprite = focusAssetOf(focus, 'sprite');
  if (!sprite || typeof value !== 'string' || (value || undefined) === sprite.platformId) return null;
  const options = { platformId: value === '' ? null : value };
  return runField(focus, ASSET_LABEL.platform, [{ name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([sprite.id]), options }]);
};

const setStrict = (focus: AssetFocus, value: unknown): AssetOutcome => {
  const sprite = focusAssetOf(focus, 'sprite');
  if (!sprite || typeof value !== 'boolean' || value === (sprite.platformStrict === true)) return null;
  return runField(focus, ASSET_LABEL.strict, [{ name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([sprite.id]), options: { platformStrict: value } }]);
};

const PLATFORM_FIELDS: AssetFields = {
  'sprite.platform': { read: (focus) => focusAssetOf(focus, 'sprite')?.platformId ?? '', write: setPlatform },
  'sprite.strict': { read: (focus) => focusAssetOf(focus, 'sprite')?.platformStrict === true, write: setStrict },
};

const VIEW_FIELDS: AssetFields = {
  'view.grid': {
    read: () => useViewStore.getState().grid,
    write: (_focus, value) => {
      if (typeof value === 'boolean') useViewStore.getState().setToggles({ grid: value });
      return null;
    },
  },
  'view.gridTile': {
    read: () => useViewStore.getState().gridTile,
    write: (_focus, value) => {
      if (typeof value === 'boolean') useViewStore.getState().setToggles({ gridTile: value });
      return null;
    },
  },
};

export { PLATFORM_FIELDS, VIEW_FIELDS };
