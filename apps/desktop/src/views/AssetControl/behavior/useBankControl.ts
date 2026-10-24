/* @layer renderer-app @kind hook */
import type { BankId } from '@bxel/document';
import { useCallback, useMemo } from 'react';
import { NO_PATHS } from '../../../asset-config/asset-config.constants';
import { bankChoices } from '../../../asset-config/bank-choices';
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { startSwitch } from '../../../palette-change/start-switch';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';
import type { BankControlModel } from '../AssetControl.type';

const useBankControl = (): BankControlModel | null => {
  const focus = useAssetFocus();
  const paths = useWorkspaceStore((state) => (focus ? state.workspaces[focus.documentId]?.paths : undefined)) ?? NO_PATHS;
  const sprite = focus ? focusAssetOf(focus, 'sprite') : undefined;
  const options = useMemo(() => (focus ? bankChoices(focus.artwork, paths) : []), [focus, paths]);
  const choose = useCallback(
    (bankId: string): void => {
      if (sprite) startSwitch(sprite.id, bankId as BankId);
    },
    [sprite],
  );
  return sprite ? { options, value: sprite.bankId, choose } : null;
};

export { useBankControl };
