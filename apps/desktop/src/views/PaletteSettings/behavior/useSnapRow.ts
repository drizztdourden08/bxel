/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { presetById } from '../../../platform-preset/preset-by-id';
import { snapPlan } from '../../../platform-preset/snap-plan';
import { snapPlatform } from '../../../platform-preset/snap-platform';
import { SNAP_TEXT } from '../../../platform-preset/snap-platform.constants';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { NO_CHANGES } from '../PaletteSettings.constants';
import type { SnapRowModel } from '../PaletteSettings.type';

const useSnapRow = (): SnapRowModel => {
  const view = useActiveDocument();
  const [asked, setAsked] = useState(false);
  const changes = useMemo(() => {
    const preset = presetById(view?.state.artwork.platformId);
    return view && preset ? snapPlan(view.state.artwork, preset).changes : NO_CHANGES;
  }, [view]);

  const apply = useCallback((): void => {
    const { host, activeId } = useDocumentStore.getState();
    setAsked(false);
    if (activeId === null) return;
    const outcome = snapPlatform(host, activeId);
    toast(outcome.ok ? SNAP_TEXT.done(outcome.moved) : outcome.message, { variant: outcome.ok ? 'success' : 'danger' });
  }, []);

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
