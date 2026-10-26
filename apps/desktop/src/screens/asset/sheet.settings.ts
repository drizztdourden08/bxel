/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { ASSET_SOURCE } from '../../asset-config/asset-source.constants';
import { runInEditor } from '../../asset-config/run-in-editor';
import { showForKind } from '../../asset-config/show-for-kind';
import { FILE_COMMAND } from '../../files/files.constants';
import { SHEET_COMMAND } from '../../keymap/sheet-command-id.constants';

const meta: ScreenMeta = {
  title: 'Sheet',
  icon: 'layout-grid',
  order: 1,
  source: ASSET_SOURCE,
  when: showForKind('sheet'),
  keywords: ['sheet', 'layout', 'grid', 'packed', 'cell', 'columns', 'spacing', 'margin', 'atlas', 'export'],
};

const layouts = [
  { value: 'manual', label: 'By hand', hint: 'You place every sprite yourself.' },
  { value: 'grid', label: 'Grid', hint: 'Sprites sit in equal cells.' },
  { value: 'packed', label: 'Packed', hint: 'Sprites are fitted tightly into rows.' },
];

const orders = [
  { value: 'rows', label: 'Row by row' },
  { value: 'columns', label: 'Column by column' },
];

const grid = (settings: Readonly<Record<string, unknown>>): boolean => settings['sheet.layout'] === 'grid';

const sections: Section[] = [
  {
    id: 'general',
    title: 'General',
    items: [
      { key: 'sheet.name', label: 'Name', description: 'The name of the sheet and of its file.', control: { kind: 'text', placeholder: 'Sheet name' } },
      { key: 'sheet.layout', label: 'Layout', description: 'How the sprites are placed on the sheet.', control: { kind: 'choice', options: layouts } },
    ],
  },
  {
    id: 'grid',
    title: 'Grid',
    items: [
      { key: 'sheet.columns', label: 'Columns', description: 'Cells across.', control: { kind: 'number', min: 1, max: 256, step: 1 }, visible: grid },
      { key: 'sheet.cellWidth', label: 'Cell width', description: 'Pixels across one cell.', control: { kind: 'number', min: 1, step: 1, unit: 'px' }, visible: grid },
      { key: 'sheet.cellHeight', label: 'Cell height', description: 'Pixels down one cell.', control: { kind: 'number', min: 1, step: 1, unit: 'px' }, visible: grid },
      { key: 'sheet.order', label: 'Order', description: 'Which way the cells fill.', control: { kind: 'choice', options: orders }, visible: grid },
    ],
  },
  {
    id: 'spacing',
    title: 'Spacing',
    items: [
      { key: 'sheet.spacing', label: 'Spacing', description: 'Pixels between sprites.', control: { kind: 'number', min: 0, step: 1, unit: 'px' } },
      { key: 'sheet.margin', label: 'Margin', description: 'Pixels around the whole sheet.', control: { kind: 'number', min: 0, step: 1, unit: 'px' } },
    ],
  },
  {
    id: 'tools',
    title: 'Sprites and export',
    items: [
      {
        key: 'sheet.manager',
        label: 'Sheet manager',
        description: 'Sort, rename, resize and arrange the sprites of the sheet.',
        actions: [{ id: 'manager', label: 'Open the sheet mode', icon: 'layout-grid', onSelect: () => runInEditor(SHEET_COMMAND.modeSheet) }],
      },
      {
        key: 'sheet.export',
        label: 'Export',
        description: 'Save the sheet as an image with its data file.',
        actions: [{ id: 'export', label: 'Export...', icon: 'download', onSelect: () => runInEditor(FILE_COMMAND.export) }],
      },
      {
        key: 'sheet.exportPresets', layout: 'wide',
        label: 'Saved presets',
        description: 'The sheet export settings you saved. Run opens the Export window with a preset in place.',
        hint: 'Save a preset in the Export window. It goes into this sheet file. Presets saved in the app are listed last.',
      },
    ],
  },
];

export default sections;
export { meta };
