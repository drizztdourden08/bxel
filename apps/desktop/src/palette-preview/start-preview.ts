/* @layer renderer-app @kind logic */
import type { BankId } from '@bxel/document';
import { announce } from '@drizztdourden08/brock-react';
import type { PaletteTarget } from '../editor/editor.type';
import { usePreviewBankStore } from '../stores/usePreviewBankStore';
import { PREVIEW_TEXT } from './palette-preview.constants';

const startPreview = (target: PaletteTarget, withBankId: string): void => {
  usePreviewBankStore.getState().show({ documentId: target.documentId, revision: target.revision, bankId: target.bank.id, withBankId: withBankId as BankId });
  announce(PREVIEW_TEXT.started);
};

export { startPreview };
