/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { CreatableKind } from '../../../stores/creation-store.type';
import { NEW_ASSET_KINDS, NEW_KIND_LETTERS } from '../ProjectPanel.constants';

const letterOf = (kind: CreatableKind): string => Object.entries(NEW_KIND_LETTERS).find(([, each]) => each === kind)?.[0].toUpperCase() ?? '';

const labelOf = (kind: CreatableKind, hinted: boolean): string => (hinted ? `${ASSET_LIST_TEXT.newKinds[kind]} (${letterOf(kind)})` : ASSET_LIST_TEXT.newKinds[kind]);

const newKindEntries = (key?: string, hinted = false): readonly ContextMenuEntry[] =>
  NEW_ASSET_KINDS.map((kind) => ({ command: 'project.new_asset', label: labelOf(kind, hinted), args: { kind, key } }));

export { newKindEntries };
