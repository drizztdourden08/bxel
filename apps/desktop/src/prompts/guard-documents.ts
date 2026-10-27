/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { PromptRefused } from './prompt-refused';

const DIALOG_METHODS: readonly (string | symbol)[] = ['open', 'saveAs', 'openFolder', 'regrant'];

const guardDocuments = (documents: DocumentsPort): DocumentsPort =>
  new Proxy(documents, {
    get: (target, property) => {
      if (typeof property === 'string' && DIALOG_METHODS.includes(property)) {
        return () => Promise.reject(new PromptRefused(property as 'open' | 'saveAs' | 'openFolder' | 'regrant'));
      }
      const value: unknown = Reflect.get(target, property);
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });

export { guardDocuments };
