/* @layer renderer-app @kind logic */
import type { TagId } from '@bxel/document';
import type { TagRef } from './tag-ref.type';

const idRef = (id: TagId | null): TagRef | null => (id === null ? null : { by: 'id', id });

export { idRef };
