/* @layer renderer-app @kind logic */
import { useAssetViewStore } from '../stores/useAssetViewStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { currentReferences } from './current-references';
import { currentViewKey } from './current-view-key';
import { REFERENCE_DEFAULTS, REFERENCE_LIMITS, REFERENCE_TEXT } from './reference-image.constants';
import type { ReferenceSource } from './reference-image.type';

const addReferenceImage = ({ key, name }: ReferenceSource): string | null => {
  const viewKey = currentViewKey();
  if (viewKey === null) return null;
  const list = currentReferences();
  if (list.length >= REFERENCE_LIMITS.count) {
    useNoticeStore.getState().post(REFERENCE_TEXT.tooMany(REFERENCE_LIMITS.count));
    return null;
  }
  const id = crypto.randomUUID();
  useAssetViewStore.getState().patch(viewKey, { references: [...list, { id, key, name, ...REFERENCE_DEFAULTS }] });
  return id;
};

export { addReferenceImage };
