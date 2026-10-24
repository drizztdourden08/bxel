/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { effectivePlatform } from '../../../platform-preset/effective-platform';
import { presetById } from '../../../platform-preset/preset-by-id';
import { snapPlan } from '../../../platform-preset/snap-plan';
import { snapPlatform } from '../../../platform-preset/snap-platform';
import { SNAP_TEXT } from '../../../platform-preset/snap-platform.constants';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { NO_CHANGES } from '../AssetControl.constants';
import type { SnapRowModel } from '../AssetControl.type';

const useSnapRow = (): SnapRowModel => {
  const focus = useAssetFocus();
  const [asked, setAsked] = useState(false);
  const sprite = focus ? focusAssetOf(focus, 'sprite') : undefined;
  const platformId = focus && sprite ? effectivePlatform(focus.artwork, sprite).platformId : undefined;
  const bankIds = useMemo(() => new Set(sprite ? [sprite.bankId] : []), [sprite]);
  const changes = useMemo(() => {
    const preset = presetById(platformId);
    return focus && preset ? snapPlan(focus.artwork, preset, bankIds).changes : NO_CHANGES;
  }, [focus, platformId, bankIds]);

  const apply = useCallback((): void => {
    setAsked(false);
    if (!focus || platformId === undefined) return;
    const outcome = snapPlatform(useDocumentStore.getState().host, focus.documentId, { platformId, bankIds });
    toast(outcome.ok ? SNAP_TEXT.done(outcome.moved) : outcome.message, { variant: outcome.ok ? 'success' : 'danger' });
  }, [focus, platformId, bankIds]);

  return {
    changes,
    banks: new Set(changes.map((change) => change.bankId)).size,
    open: asked && changes.length > 0,
    begin: () => setAsked(true),
    cancel: () => setAsked(false),
    apply,
  };
};

export { useSnapRow };
