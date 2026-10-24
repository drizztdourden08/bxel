/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import type { BankId } from '@bxel/document';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { bankOptions } from '../../../palette-bank/bank-options';
import { switchBank } from '../../../palette-bank/switch-bank';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import type { BankRowModel } from '../PaletteSettings.type';

const useBankRow = (): BankRowModel | null => {
  const view = useActiveDocument();
  const target = useEditorTarget();
  const options = useMemo(() => (view ? bankOptions(view.state.artwork) : []), [view]);

  const choose = useCallback(
    (bankId: string): void => {
      const { host, activeId } = useDocumentStore.getState();
      if (activeId === null || !target) return;
      const outcome = switchBank(host, activeId, target.sprite.id, bankId as BankId);
      toast(outcome.message, { variant: outcome.ok ? 'success' : 'danger' });
    },
    [target],
  );

  return target && options.length > 1 ? { options, value: target.bank.id, choose } : null;
};

export { useBankRow };
