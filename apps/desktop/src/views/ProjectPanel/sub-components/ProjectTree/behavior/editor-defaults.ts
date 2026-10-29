/* @layer renderer-app @kind logic */
import { fileExtension } from '../../../../../files/file-extension';
import { PLAIN_KINDS } from '../../../../../panel-browser/project-browser.constants';
import { uniqueName } from '../../../../../panel-browser/unique-name';
import { NEW_FILE_SUFFIX } from '../../../../../project/project.constants';
import { PANEL_UI } from '../../../ProjectPanel.constants';
import type { EditorDefaults, RowEditorProps } from '../ProjectTree.type';

const editorDefaults = ({ item, model, creating }: Pick<RowEditorProps, 'item' | 'model' | 'creating'>): EditorDefaults => {
  if (!creating) {
    const stem = item.row !== null && !PLAIN_KINDS.includes(item.row.kind);
    return { initial: stem ? item.name : item.fileName, suffix: stem ? `.${fileExtension(item.fileName)}` : '', label: PANEL_UI.renameLabel };
  }
  const siblings = (model.data.tree.children.get(item.parentKey) ?? []).map((key) => model.data.tree.items.get(key)?.name ?? '');
  return { initial: uniqueName(siblings, 'sprite'), suffix: NEW_FILE_SUFFIX, label: PANEL_UI.newSpriteLabel };
};

export { editorDefaults };
