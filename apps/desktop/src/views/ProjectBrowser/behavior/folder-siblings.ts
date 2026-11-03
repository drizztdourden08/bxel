/* @layer renderer-app @kind logic */
import type { BreadcrumbSibling } from '@drizztdourden08/tessera';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';

const folderSiblings = (model: BrowserModel, path: string | null): readonly BreadcrumbSibling[] =>
  model
    .entriesIn(path)
    .filter((entry) => entry.kind === 'folder')
    .map((entry): BreadcrumbSibling => ({
      id: entry.id,
      label: entry.id.split('/').at(-1) ?? entry.id,
      icon: 'folder',
      group: BROWSER_TEXT.siblings,
      onSelect: () => useBrowserStore.getState().goTo(entry.id),
    }));

export { folderSiblings };
