/* @layer renderer-app @kind hook */
import { findBank } from '@bxel/document';
import { buildRamp } from '@bxel/palette';
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo, useState } from 'react';
import { currentTarget } from '../../../editor/current-target';
import type { EditorTarget } from '../../../editor/editor.type';
import { applyRamp } from '../../../palette-ramps/apply-ramp';
import type { RampBuilderRequest } from '../../../stores/palette-panel-store.type';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useRampBuilderStore } from '../../../stores/useRampBuilderStore';
import type { BuilderSettings, BuilderState } from '../RampBuilderDialog.type';
import { builderOptions } from './builder-options';
import { firstSettings } from './first-settings';
import { roomFor } from './room-for';

const useRampBuilder = (request: RampBuilderRequest, live: EditorTarget): BuilderState => {
  const view = useDocumentStore((state) => state.views[request.documentId] ?? null);
  const bank = useMemo(() => (view ? findBank(view.state.artwork, request.bankId) : undefined) ?? live.bank, [view, request.bankId, live.bank]);
  const target = useMemo<EditorTarget>(() => ({ ...live, bank }), [live, bank]);
  const [settings, setSettings] = useState<BuilderSettings>(() => firstSettings(bank, request.baseIndex));
  const [failure, setFailure] = useState<string | null>(null);
  const change = useCallback((next: Partial<BuilderSettings>) => setSettings((current) => ({ ...current, ...next })), []);
  const build = useMemo(() => {
    const options = builderOptions(bank, settings);
    return options ? buildRamp(options) : null;
  }, [bank, settings]);
  const free = (settings.raise ?? bank.cap) - bank.slots.length;
  const fits = build !== null && build.added <= free;
  const room = build ? roomFor(bank, build.added) : null;
  const cancel = useCallback(() => useRampBuilderStore.getState().close(), []);
  const apply = useCallback(() => {
    if (!build) return;
    const name = settings.name.trim() || firstSettings(bank, settings.baseIndex).name;
    const outcome = applyRamp(currentTarget() ?? target, build.steps, name, settings.raise);
    if (!outcome.ok) {
      setFailure(outcome.message);
      return;
    }
    toast(outcome.message, { variant: 'success' });
    useRampBuilderStore.getState().close();
  }, [build, target, settings, bank]);
  return { target, bank, settings, change, build, free, fits, room, failure, apply, cancel };
};

export { useRampBuilder };
