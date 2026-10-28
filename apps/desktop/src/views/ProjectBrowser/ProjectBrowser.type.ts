/* @layer renderer-app @kind types */
import type { CreatableKind } from '../../stores/creation-store.type';
import type { BrowserModel } from '../../project-browser/browser-model.type';
import type { BrowserEntry } from '../../project-browser/project-browser.type';

type BrowserActions = {
  readonly open: (entry: BrowserEntry) => void;
  readonly openAll: (entries: readonly BrowserEntry[]) => void;
  readonly properties: (entries: readonly BrowserEntry[]) => void;
  readonly startRename: (id: string) => void;
  readonly commitRename: (entry: BrowserEntry, typed: string) => void;
  readonly cancelRename: () => void;
  readonly newFolder: () => void;
  readonly newAsset: (kind: CreatableKind) => void;
  readonly trash: (entries: readonly BrowserEntry[]) => void;
  readonly duplicate: (entries: readonly BrowserEntry[]) => void;
  readonly reveal: (entry: BrowserEntry) => void;
  readonly copyPath: (entry: BrowserEntry) => void;
  readonly pin: (entries: readonly BrowserEntry[], on: boolean) => void;
  readonly moveInto: (ids: readonly string[], folder: string) => void;
  readonly importImage: () => void;
  readonly importPalette: () => void;
  readonly filterBy: (token: string) => void;
};

type BrowserContextValue = {
  readonly model: BrowserModel;
  readonly actions: BrowserActions;
  readonly selection: readonly string[];
  readonly renaming: string | null;
  readonly renameError: string | null;
  readonly thumb: number;
};

type EntryProps = { readonly entry: BrowserEntry };

export type { BrowserActions, BrowserContextValue, EntryProps };
