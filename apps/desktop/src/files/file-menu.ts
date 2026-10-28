/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { DIALOG_COMMAND } from '../keymap/dialog-command-id.constants';
import { TILED_COMMAND } from '../keymap/tiled-command-id.constants';
import { ruledItem } from '../menu/ruled-item';
import { tidyMenu } from '../menu/tidy-menu';
import type { BxelContext } from '../ui-context/bxel-context.type';
import { FILE_COMMAND, FILE_TEXT } from './files.constants';

const fileMenu = (recent: MenuItem, context: BxelContext): MenuEntry[] => {
  const item = (key: string, id: string, label: string, extra: Partial<MenuItem> = {}) => {
    const built = ruledItem(context, id, label, extra);
    return built ? { ...built, key } : null;
  };
  return [
    {
      key: 'file',
      label: FILE_TEXT.group,
      icon: 'file',
      children: tidyMenu([
        item('file-new', DIALOG_COMMAND.newFile, 'New...'),
        item('file-open', FILE_COMMAND.open, 'Open...'),
        recent,
        'separator',
        item('file-save', FILE_COMMAND.save, 'Save'),
        item('file-save-as', FILE_COMMAND.saveAs, 'Save as...'),
        item('file-save-all', FILE_COMMAND.saveAll, 'Save all'),
        'separator',
        item('file-export', FILE_COMMAND.export, 'Export...'),
        {
          key: 'file-import',
          label: FILE_TEXT.importGroup,
          children: tidyMenu([
            item('file-import-image', DIALOG_COMMAND.importImage, 'Image...'),
            item('file-import-tiled', TILED_COMMAND.importMap, 'Tiled map...'),
          ]),
        },
      ]),
    },
    ...tidyMenu([item('save-top', FILE_COMMAND.save, 'Save', { icon: 'pixel-save-file' }), item('save-as-top', FILE_COMMAND.saveAs, 'Save as...')]),
  ];
};

export { fileMenu };
