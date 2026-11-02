/* @layer renderer-app @kind logic */
import type { BankId } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { startSwitch } from '../palette-change/start-switch';
import type { AssetRow } from './asset-list.type';
import { KIND_MENU } from './kind-menu.constants';
import { openSpriteId } from './open-sprite-id';

const applyPaletteRow = (row: AssetRow): void => {
  const spriteId = openSpriteId();
  if (spriteId === null || row.assetId === null) {
    toast(KIND_MENU.noSpriteOpen, { variant: 'info' });
    return;
  }
  startSwitch(spriteId, row.assetId as BankId);
};

export { applyPaletteRow };
