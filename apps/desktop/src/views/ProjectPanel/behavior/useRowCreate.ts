/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { folderKeyOf } from '../../../project-browser/folder-key-of';
import { newParentKey } from '../../../project-browser/new-parent-key';
import { startNewAsset } from '../../../project/start-new-asset';
import type { CreatableKind } from '../../../stores/creation-store.type';
import { projectDirs } from '../../../workspace/project-dirs';
import type { CreateActions, PanelParts } from '../ProjectPanel.type';

const useRowCreate = ({ project, data, selection, edit }: PanelParts): CreateActions => {
  const { tree } = data;
  const selected = folderKeyOf(selection.targets[0], tree);
  const here = selected === null ? null : tree.items.get(selected);

  const newAsset = useCallback(
    (kind: CreatableKind, parentKey?: string) => {
      const explicit = parentKey ?? selected;
      if (kind !== 'sprite') {
        startNewAsset(kind, explicit === null || explicit === undefined ? undefined : tree.items.get(explicit)?.path);
        return;
      }
      const roleDir = project ? projectDirs(project).sprite : undefined;
      const parent = parentKey ?? newParentKey({ targets: selection.targets, tree, roleDir });
      if (parent !== null) edit.startSprite(parent);
    },
    [project, selected, selection.targets, tree, edit],
  );
  const newFolder = useCallback(
    (parentKey?: string) => {
      const parent = parentKey ?? selected ?? tree.mainKey;
      if (parent !== null) edit.startFolder(parent);
    },
    [selected, tree.mainKey, edit],
  );

  return { newAsset, newFolder, newHere: here ? `New in ${here.name}/` : 'New' };
};

export { useRowCreate };
