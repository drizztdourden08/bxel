/* @layer renderer-app @kind logic */
import type { BrowserState } from '../../project-browser/browser-store.type';
import type { SetViewInput } from './app-tool-input.type';

const applyBrowse = (store: BrowserState, browse: NonNullable<SetViewInput['browse']>, picked: readonly string[] | null): void => {
  if (browse.view !== undefined) store.setView(browse.view);
  if (browse.search !== undefined) store.setQuery(browse.search);
  if (picked !== null) store.select({ ids: picked, anchor: picked[0] ?? null });
};

export { applyBrowse };
