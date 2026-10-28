/* @layer core @kind logic */
import { ERROR_CODE, fail } from '@bxel/document';
import type { Draft } from '@bxel/document';

const resolveSwatchRefs = (draft: Draft, items: readonly (string | { readonly ref: string })[], path: string): string[] =>
  items.map((item, at) => {
    if (typeof item === 'string') return item;
    const id = draft.created[item.ref];
    if (id === undefined) throw fail(ERROR_CODE.INVALID_OPTION, `No earlier step of this transaction created the ref "${item.ref}".`, { path: `${path}.${at}` });
    return id;
  });

export { resolveSwatchRefs };
