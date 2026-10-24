/* @layer renderer-app @kind logic */
import { findBank } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { limitPreview } from './limit-preview';
import type { ChangePreview, ChangeRequest } from './palette-change.type';
import { swatchPreview } from './swatch-preview';
import { switchPreview } from './switch-preview';

const changePreview = (view: DocumentView, request: ChangeRequest): ChangePreview | null => {
  const { artwork } = view.state;
  const bank = findBank(artwork, request.bankId);
  if (!bank) return null;
  if (request.kind === 'switch') return switchPreview(artwork, bank, request);
  return request.kind === 'limit' ? limitPreview(artwork, bank, request) : swatchPreview(artwork, bank, request);
};

export { changePreview };
