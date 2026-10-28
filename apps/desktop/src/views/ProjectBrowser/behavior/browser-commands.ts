/* @layer renderer-app @kind logic */
import type { BrowserModel } from '../../../project-browser/browser-model.type';
import { pickAll } from '../../../project-browser/pick-all';
import { useBrowserStore } from '../../../project-browser/useBrowserStore';
import type { BrowserActions, Commands } from '../ProjectBrowser.type';

const when = (on: boolean, commands: Commands): Commands => (on ? commands : {});

const browserCommands = (model: BrowserModel, actions: BrowserActions): Commands => {
  const store = useBrowserStore.getState();
  const { selected } = model;
  const [first] = selected;
  const any = selected.length > 0;
  const editing = model.editable && any;
  const up = (): void => store.goTo(model.parentFolder);
  return {
    space: store.togglePreview,
    'mod+a': () => store.select(pickAll(model.order)),
    escape: () => (store.query === '' ? store.select({ ids: [], anchor: null }) : store.setQuery('')),
    ...when(any, { enter: () => (selected.length === 1 && first ? actions.open(first) : actions.openAll(selected)), 'alt+enter': () => actions.properties(selected) }),
    ...when(editing, { delete: () => actions.trash(selected), 'mod+d': () => actions.duplicate(selected) }),
    ...when(editing && selected.length === 1 && first !== undefined, { f2: () => first && actions.startRename(first.id) }),
    ...when(model.editable, { 'mod+shift+n': actions.newFolder }),
    ...when(model.parentFolder !== null, { backspace: up, 'alt+arrowup': up }),
  };
};

export { browserCommands };
