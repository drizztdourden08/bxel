/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { swatchAlpha } from '@bxel/document';
import { useCallback, useEffect, useRef, useState } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { unitToAlpha } from '../../../palette-bank/unit-to-alpha';
import { recolourSwatch } from '../../../palette-bank/recolour-swatch';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useSwatchDraftStore } from '../../../stores/useSwatchDraftStore';
import type { EditSwatch, SwatchDraft, SwatchEditModel } from '../PalettePanel.type';
import { draftFields } from './draft-fields';

const useSwatchEdit = (): SwatchEditModel => {
  const target = useEditorTarget();
  const anchor = useRef<HTMLElement | null>(null);
  const [draft, setDraft] = useState<SwatchDraft | null>(null);

  useEffect(() => {
    if (!draft || !target) {
      useSwatchDraftStore.getState().hide();
      return;
    }
    useSwatchDraftStore.getState().show({ documentId: target.documentId, bankId: target.bank.id, index: draft.index, rgb: draft.value, alpha: draft.alpha });
  }, [draft, target]);

  useEffect(() => () => useSwatchDraftStore.getState().hide(), []);

  const open = useCallback<EditSwatch>(
    (index, element) => {
      const slot = currentTarget()?.bank.slots[index];
      if (!slot || slot.kind === 'transparent') return;
      anchor.current = element;
      setDraft({ index, value: slot.rgb, alpha: swatchAlpha(slot), original: slot.rgb, originalAlpha: swatchAlpha(slot), name: slot.name });
    },
    [],
  );

  const change = useCallback((value: string): void => setDraft((current) => (current ? { ...current, value } : current)), []);
  const changeAlpha = useCallback((unit: number): void => setDraft((current) => (current ? { ...current, alpha: unitToAlpha(unit) } : current)), []);
  const rename = useCallback((name: string): void => setDraft((current) => (current ? { ...current, name } : current)), []);
  const reset = useCallback((): void => setDraft((current) => (current ? { ...current, value: current.original, alpha: current.originalAlpha } : current)), []);
  const cancel = useCallback((): void => setDraft(null), []);

  const done = useCallback((): void => {
    setDraft(null);
    if (!draft || !target) return;
    const outcome = recolourSwatch(useDocumentStore.getState().host, target.documentId, target.bank, { index: draft.index, rgb: draft.value, alpha: draft.alpha, name: draft.name });
    if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  }, [draft, target]);

  return { ...draftFields(draft), anchor, open, change, changeAlpha, rename, reset, cancel, done };
};

export { useSwatchEdit };
