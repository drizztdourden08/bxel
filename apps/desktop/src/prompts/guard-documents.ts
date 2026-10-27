/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { DIALOG_METHODS } from './guard-documents.constants';
import { PromptRefused } from './prompt-refused';

const dialogOf = (property: string | symbol) => DIALOG_METHODS.find((method) => method === property);

const guardDocuments = (documents: DocumentsPort): DocumentsPort =>
  new Proxy(documents, {
    get: (target, property) => {
      const dialog = dialogOf(property);
      if (dialog) return () => Promise.reject(new PromptRefused(dialog));
      const value: unknown = Reflect.get(target, property);
      return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });

export { guardDocuments };
