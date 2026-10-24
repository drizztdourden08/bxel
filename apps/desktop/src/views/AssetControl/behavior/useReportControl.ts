/* @layer renderer-app @kind hook */
import { useCallback, useMemo } from 'react';
import { ASSET_SOURCE } from '../../../asset-config/asset-source.constants';
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { PLATFORM_TEXT } from '../../../platform-preset/platform-preset.constants';
import { spriteReport } from '../../../platform-preset/sprite-report';
import type { ReportControlModel } from '../AssetControl.type';

const useReportControl = (): ReportControlModel => {
  const focus = useAssetFocus();
  const sprite = focus ? focusAssetOf(focus, 'sprite') : undefined;
  const report = useMemo(() => (focus && sprite ? spriteReport(focus.artwork, sprite) : null), [focus, sprite]);
  const toggleStrict = useCallback((on: boolean): void => void ASSET_SOURCE.set('sprite.strict', on), []);
  const inherits = sprite !== undefined && sprite.platformStrict === undefined;
  return { report, caption: inherits ? PLATFORM_TEXT.strictDefault(focus?.artwork.platformStrict === true) : '', toggleStrict };
};

export { useReportControl };
