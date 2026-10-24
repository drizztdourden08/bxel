/* @layer renderer-app @kind logic */
import type { BankId, DocumentId } from '@bxel/document';
import { useChangeStore } from '../stores/useChangeStore';

const startLimit = (documentId: DocumentId, bank: { readonly id: string; readonly cap: number }): void =>
  useChangeStore.getState().propose({ kind: 'limit', documentId, bankId: bank.id as BankId, swatch: 0, other: null, cap: bank.cap });

export { startLimit };
