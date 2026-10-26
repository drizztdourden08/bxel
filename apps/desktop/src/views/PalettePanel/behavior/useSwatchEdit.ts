/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { swatchAlpha } from '@bxel/document';
import { useCallback, useRef, useState } from 'react';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { alphaToUnit } from '../../../palette-bank/alpha-to-unit';
import { recolourSwatch } from '../../../palette-bank/recolour-swatch';
import { unitToAlpha } from '../../../palette-bank/unit-to-alpha';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { EditSwatch, SwatchDraft, SwatchEditModel } from '../PalettePanel.type';

const useSwatchEdit = (): SwatchEditModel => {
  const target = useEditorTarget();
  const anchor = useRef<HTMLElement | null>(null);
  const [draft, setDraft] = useState<SwatchDraft | null>(null);

  const open = useCallback<EditSwatch>(
    (index, element) => {
      const slot = target?.bank.slots[index];
      if (!slot || slot.kind === 'transparent') return;
      anchor.current = element;
      setDraft({ index, value: slot.rgb, alpha: swatchAlpha(slot) });
    },
    [target],
  );

  const change = useCallback((value: string): void => setDraft((current) => (current ? { ...current, value } : current)), []);

  const changeAlpha = useCallback((unit: number): void => setDraft((current) => (current ? { ...current, alpha: unitToAlpha(unit) } : current)), []);

  const close = useCallback((): void => {
    setDraft(null);
    if (!draft || !target) return;
    const outcome = recolourSwatch(useDocumentStore.getState().host, target.documentId, target.bank, { index: draft.index, rgb: draft.value, alpha: draft.alpha });
    if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
  }, [draft, target]);

  return { index: draft?.index ?? null, value: draft?.value ?? '', alpha: alphaToUnit(draft?.alpha ?? 255), anchor, open, change, changeAlpha, close };
};

export { useSwatchEdit };
