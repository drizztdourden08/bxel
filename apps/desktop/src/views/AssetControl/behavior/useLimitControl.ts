/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { focusBank } from '../../../asset-config/focus-bank';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { PALETTE_TEXT } from '../../../editor/palette-text.constants';
import { startLimit } from '../../../palette-change/start-limit';
import type { LimitControlModel } from '../AssetControl.type';

const useLimitControl = (): LimitControlModel | null => {
  const focus = useAssetFocus();
  const bank = focus ? focusBank(focus) : undefined;
  const change = useCallback((): void => {
    if (focus && bank) startLimit(focus.documentId, bank);
  }, [focus, bank]);
  return bank ? { count: PALETTE_TEXT.count(bank.cap, bank.transparent), change } : null;
};

export { useLimitControl };
