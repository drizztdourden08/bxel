/* @layer renderer-app @kind hook */
import { toast } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import { editOrganise } from '../../../organise/edit-organise';
import type { OrganiseOp } from '../../../organise/organise.type';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import type { OrganiseActions } from '../ProjectBrowser.type';

const assetsOf = (entries: readonly BrowserEntry[]): string[] =>
  entries.flatMap((entry) => (entry.kind === 'file' && entry.row.assetId !== null ? [entry.row.assetId] : []));

const run = (op: OrganiseOp): void => {
  void editOrganise(op).then((outcome) => {
    if (!outcome.ok) toast(outcome.message, { variant: 'warning' });
  });
};

const useOrganiseActions = (): OrganiseActions =>
  useMemo<OrganiseActions>(
    () => ({
      pin: (entries, on) => run({ op: on ? 'pin' : 'unpin', assets: assetsOf(entries) }),
      tag: (entries, typed) => run({ op: 'tag', assets: assetsOf(entries), tags: typed.split(',') }),
      untag: (entries, tag) => run({ op: 'untag', assets: assetsOf(entries), tags: [tag] }),
      collect: (entries, collection, on) => run({ op: on ? 'collect' : 'uncollect', assets: assetsOf(entries), collection }),
      collectInNew: (entries, name) => run({ op: 'newCollection', name, assets: assetsOf(entries) }),
      newCollection: (name) => run({ op: 'newCollection', name }),
      deleteCollection: (collection) => run({ op: 'deleteCollection', collection }),
      saveFilter: (query) => run({ op: 'saveSearch', name: query, query }),
      removeFilter: (id) => run({ op: 'removeSearch', search: id }),
    }),
    [],
  );

export { useOrganiseActions };
