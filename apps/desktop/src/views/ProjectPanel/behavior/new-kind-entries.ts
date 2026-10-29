/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { NEW_ASSET_KINDS } from '../ProjectPanel.constants';

const newKindEntries = (key?: string): readonly ContextMenuEntry[] =>
  NEW_ASSET_KINDS.map((kind) => ({ command: 'project.new_asset', label: ASSET_LIST_TEXT.newKinds[kind], args: { kind, key } }));

export { newKindEntries };
