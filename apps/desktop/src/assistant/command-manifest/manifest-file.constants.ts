/* @layer renderer-app @kind constants */
import { one } from './manifest-one';
import { rows } from './manifest-rows';

const FILE_ROWS = [
  ...rows('files_saving', 'file', ['file.save', 'file.save_all']),
  one('file.save_as', 'files_saving', 'file', { dialog: 'save_as' }),
  one('export.open', 'files_saving', 'file', { dialog: 'export' }),
  one('image.import', 'files_saving', 'file', { dialog: 'image_import' }),
  ...rows('files_saving', 'file', ['file.open', 'file.new', 'sprite.new', 'file.import_image', 'file.import_tiled'], { dialog: 'file' }),
  ...rows('files_saving', 'file', ['project.new', 'project.open', 'project.close', 'project.pack'], { dialog: 'project' }),
  ...rows('files_saving', 'file', ['tab.close', 'tab.close_others', 'tab.close_right'], { args: 'tab' }),
  one('project.rename_file', 'files_saving', 'file', { args: 'renameFile' }),
  one('project.make_folder', 'files_saving', 'file', { args: 'path' }),
  one('project.move_files', 'files_saving', 'file', { args: 'moveFiles', dialog: 'confirm' }),
  one('project.trash_files', 'files_saving', 'file', { args: 'paths', dialog: 'confirm' }),
  ...rows('app_control', 'show', ['asset.reveal'], { args: 'path' }),
  one('asset.copy_path', 'app_control', 'app', { args: 'path' }),
];

export { FILE_ROWS };
