/* @layer renderer-app @kind types */
import type { DocumentGrantingOptions, DocumentPick } from '@drizztdourden08/brock-core';
import type { ConfirmActionOptions } from '@drizztdourden08/brock-react';

type ConfirmOptions = ConfirmActionOptions;

type PromptPort = {
  readonly saveAs: (options: DocumentGrantingOptions) => Promise<DocumentPick | null>;
  readonly confirm: (options: ConfirmOptions) => Promise<boolean>;
};

type PromptKind = keyof PromptPort | 'open' | 'openFolder' | 'regrant';

export type { PromptKind, PromptPort };
