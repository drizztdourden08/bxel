/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import { antiAlias } from '@bxel/raster';
import { stepInRamp } from '@bxel/palette';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { beginPending } from './pending/begin-pending';
import { ANTI_ALIAS_TEXT } from './anti-alias-layer.constants';
import { patchOfPixels } from './patch-of-pixels';
import { unlockedTarget } from './unlocked-target';

const antiAliasLayer = (): boolean => {
  const target = unlockedTarget();
  if (!target) return false;
  const notices = useNoticeStore.getState();
  const edge = useToolStore.getState().foreground;
  const mid = stepInRamp(target.bank, edge, 1) ?? stepInRamp(target.bank, edge, -1);
  if (mid === null || mid === edge) {
    notices.post(ANTI_ALIAS_TEXT.noRamp);
    return false;
  }
  const { sprite } = target;
  const found = antiAlias({ pixels: flattenFrame(sprite, target.frameId), width: sprite.width, height: sprite.height, edge, mid, inside: true });
  const patch = patchOfPixels(found, sprite.width, sprite.height);
  if (patch === null) {
    notices.post(ANTI_ALIAS_TEXT.nothing);
    return false;
  }
  return beginPending({ kind: 'patch', label: ANTI_ALIAS_TEXT.label, rect: patch.rect, pixels: patch.pixels });
};

export { antiAliasLayer };
