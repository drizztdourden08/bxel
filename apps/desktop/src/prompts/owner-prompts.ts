/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { confirmAction } from '@drizztdourden08/brock-react';
import type { PromptPort } from './prompt-port.type';

const ownerPrompts = (documents: DocumentsPort): PromptPort => ({
  saveAs: (options) => documents.saveAs(options),
  confirm: (options) => confirmAction(options),
});

export { ownerPrompts };
