/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { LAYER_TEXT } from '../../../editor/layer-text.constants';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { LAYER_LOCK_TEXT, LAYER_MENU_TEXT, LAYER_STACK_TEXT } from '../LayerStack.constants';
import type { LayerRowModel, LayerStackModel } from '../LayerStack.type';

const newLayerOnly: readonly ContextMenuEntry[] = [COMMAND_ID.layerAdd];

const isSolo = (rows: readonly LayerRowModel[], id: string): boolean => rows.length > 1 && rows.every((row) => row.visible === (row.id === id));

const lockItems = (model: LayerStackModel, row: LayerRowModel, args: { layerId: string }): ContextMenuEntry[] =>
  model.locks.map((kind) => ({
    command: 'layer.set_lock',
    label: LAYER_LOCK_TEXT[kind].name,
    args: { ...args, kind },
    kind: 'radio' as const,
    checked: row.lock === kind,
  }));

const colourItems = (row: LayerRowModel, args: { layerId: string }): ContextMenuEntry[] => [
  { command: 'layer.set_colour', label: LAYER_STACK_TEXT.noTag, args: { ...args, colour: null }, kind: 'radio', checked: row.colour === null },
  ...TAG_COLOUR_CHOICES.map((choice) => ({
    command: 'layer.set_colour',
    label: choice.name,
    args: { ...args, colour: choice.hex },
    kind: 'radio' as const,
    checked: row.colour === choice.hex,
  })),
];

/** The menu of a layer row, for a sprite or a tilemap. The clicked row has been made active before it opens. */
const layerMenuEntries = (model: LayerStackModel, layerId: string | undefined): readonly ContextMenuEntry[] => {
  const { rows } = model;
  const at = rows.findIndex((row) => row.id === layerId);
  const row = rows[at];
  if (!row || model.kind === 'sheet') return newLayerOnly;
  const args = { layerId: row.id };
  const only = rows.length === 1;
  const pixels = model.kind === 'sprite';
  return [
    { command: 'layer.toggle_visible', label: LAYER_MENU_TEXT.visible, args, checked: row.visible },
    { label: LAYER_MENU_TEXT.locked, items: lockItems(model, row, args) },
    { command: 'layer.solo', args, checked: isSolo(rows, row.id), ...unless(!only, LAYER_STACK_TEXT.oneLayer) },
    { command: 'layer.rename', label: LAYER_MENU_TEXT.rename },
    'separator',
    COMMAND_ID.layerAdd,
    COMMAND_ID.layerDuplicate,
    { command: COMMAND_ID.layerMerge, label: pixels ? LAYER_MENU_TEXT.mergeDown : LAYER_MENU_TEXT.mergeMapDown, ...unless(at < rows.length - 1, LAYER_TEXT.bottom) },
    ...(pixels ? [{ command: COMMAND_ID.layerFlatten, ...unless(rows.some((each) => each.visible), LAYER_TEXT.noVisible) }] : []),
    { label: LAYER_MENU_TEXT.colour, items: colourItems(row, args) },
    'separator',
    { command: 'layer.move_up', args, ...unless(at > 0, LAYER_STACK_TEXT.top) },
    { command: 'layer.move_down', args, ...unless(at < rows.length - 1, LAYER_STACK_TEXT.bottom) },
    { command: 'layer.move_top', args, ...unless(at > 0, LAYER_STACK_TEXT.top) },
    { command: 'layer.move_bottom', args, ...unless(at < rows.length - 1, LAYER_STACK_TEXT.bottom) },
    'separator',
    { command: 'layer.show_all', args },
    { command: 'layer.hide_others', args, ...unless(!only, LAYER_STACK_TEXT.oneLayer) },
    { command: 'layer.lock_others', args, ...unless(!only, LAYER_STACK_TEXT.oneLayer) },
    { command: 'layer.unlock_all', args },
    'separator',
    { command: COMMAND_ID.layerDelete, tone: 'danger', ...unless(!only, LAYER_TEXT.lastLayer) },
  ];
};

export { layerMenuEntries };
