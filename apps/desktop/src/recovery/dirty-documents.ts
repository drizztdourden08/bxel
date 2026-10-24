/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { dirtyNames } from '../workspace/dirty-names';
import type { Workspace } from '../workspace/workspace.type';
import type { DirtyDocument } from './recovery.type';

const dirtyDocuments = (
  views: Readonly<Record<string, DocumentView>>,
  order: readonly DocumentId[],
  workspaces: Readonly<Record<string, Workspace>>,
): DirtyDocument[] =>
  order.flatMap((documentId) => {
    const view = views[documentId];
    const workspace = workspaces[documentId];
    if (view === undefined || view.state.readOnly) return [];
    const names = workspace ? dirtyNames(workspace, view.state.artwork) : [];
    if (names.length > 0) return [{ documentId, name: names.join(', ') }];
    return view.clean ? [] : [{ documentId, name: workspace?.name ?? view.state.artwork.name }];
  });

export { dirtyDocuments };
