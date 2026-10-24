/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { ASSET_SOURCE } from '../../../asset-config/asset-source.constants';
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { inheritGroups } from '../../../platform-preset/inherit-groups';
import { PLATFORM_TEXT } from '../../../platform-preset/platform-preset.constants';
import { presetById } from '../../../platform-preset/preset-by-id';
import type { PlatformControlModel } from '../AssetControl.type';

const usePlatformControl = (): PlatformControlModel | null => {
  const focus = useAssetFocus();
  const sprite = focus ? focusAssetOf(focus, 'sprite') : undefined;
  const projectPlatform = focus?.artwork.platformId;
  const groups = useMemo(() => inheritGroups(projectPlatform), [projectPlatform]);
  const choose = useCallback((value: string): void => void ASSET_SOURCE.set('sprite.platform', value), []);
  if (!sprite) return null;
  const own = sprite.platformId;
  const unknown = own !== undefined && presetById(own) === null ? PLATFORM_TEXT.unknown(own) : null;
  return { groups, value: unknown === null ? (own ?? '') : '', unknown, choose };
};

export { usePlatformControl };
