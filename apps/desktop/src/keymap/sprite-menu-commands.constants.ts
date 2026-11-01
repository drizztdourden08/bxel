/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import type { Sheet } from '@bxel/document';
import { commandArgs } from '../context-menu/command-args';
import type { AlignArgs, NameArgs, SheetArgs, TraitArgs } from '../context-menu/menu-args.type';
import { clearSpriteSelection } from '../sheet/clear-selection';
import { reorderSprites } from '../sheet/reorder-sprites';
import { activeFilters } from '../sheet-manager/active-filters';
import { addToSheet } from '../sheet-manager/add-to-sheet';
import { alignSprites } from '../sheet-manager/align-sprites';
import { applyOrder } from '../sheet-manager/apply-order';
import { applySelection } from '../sheet-manager/apply-selection';
import { currentManager } from '../sheet-manager/current-manager';
import { flipSprites } from '../sheet-manager/flip-sprites';
import { idsByTrait } from '../sheet-manager/ids-by-trait';
import { invertIds } from '../sheet-manager/invert-ids';
import { copyToSheet } from '../sheet-manager/copy-to-sheet';
import { distributeRows } from '../sheet-manager/distribute-rows';
import { exportSelection } from '../sheet-manager/export-selection';
import { holdEntries } from '../sheet-manager/hold-entries';
import { pasteEntries } from '../sheet-manager/paste-entries';
import { idsLike } from '../sheet-manager/ids-like';
import { makeTileset } from '../sheet-manager/make-tileset';
import { moveToSheet } from '../sheet-manager/move-to-sheet';
import { removeEntries } from '../sheet-manager/remove-entries';
import { selectDuplicates } from '../sheet-manager/select-duplicates';
import { selectIds } from '../sheet-manager/select-ids';
import { sortFacts } from '../sheet-manager/sort-facts';
import { trimSprites } from '../sheet-manager/trim-sprites';
import { turnSprites } from '../sheet-manager/turn-sprites';
import type { CurrentManager, ManagerDialog } from '../sheet-manager/manager.type';
import { useManagerStore } from '../stores/useManagerStore';
import { revealInProjectWindow } from '../project-browser/reveal-in-project-window';
import { assetPathOf } from '../sheet-manager/asset-path-of';
import { isolateSprite } from '../sheet/isolate-sprite';
import { pickTab } from '../workspace/pick-tab';
import { ANIMATION_ENTRY_COMMANDS } from './animation-entry-commands.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { ruled } from './ruled';
import { needs } from './needs';
import { REASON } from '../ui-context/reasons.constants';

const group = COMMAND_GROUP.sheet;

const END_INDEX = Number.MAX_SAFE_INTEGER;

const withManager = (run: (manager: CurrentManager, context?: CommandContext) => unknown) => (context?: CommandContext): void => {
  const manager = currentManager();
  if (manager) run(manager, context);
};

const toSheet = (act: (manager: CurrentManager, sheet: Sheet) => unknown) =>
  withManager((manager, context) => {
    const { sheetId } = commandArgs<SheetArgs>(context);
    const sheet = manager.artwork.sheets.find((each) => each.id === sheetId);
    if (sheet) act(manager, sheet);
  });

const dialog = (name: ManagerDialog) => withManager(() => useManagerStore.getState().patch({ dialog: name }));

const SPRITE_ACTIONS: readonly CommandDef[] = [
  { id: 'sprite.add_from_project', label: 'Add from the project', group, run: () => useManagerStore.getState().patch({ libraryRequest: Date.now() }) },
  { id: 'sprite.rename_many', label: 'Rename several sprites', group, run: dialog('rename') },
  { id: 'sprite.duplicate_named', label: 'Duplicate sprites with a name', group, run: dialog('duplicate') },
  { id: 'sprite.move_to_folder', label: 'Move sprites to a folder', group, run: dialog('folder') },
  { id: 'sprite.set_palette', label: 'Set the palette of sprites', group, run: dialog('bank') },
  { id: 'sprite.set_pivot', label: 'Set the pivot of sprites', group, run: dialog('pivot') },
  { id: 'sprite.resize', label: 'Set the canvas size of sprites', group, run: dialog('resize') },
  { id: 'sprite.make_animation', label: 'Make an animation from sprites', group, run: dialog('animate') },
  { id: 'sprite.cut_strip', label: 'Cut a strip into an animation', group, run: dialog('strip') },
  { id: 'sprite.slice', label: 'Slice sprites', group, run: dialog('slice') },
  { id: 'sprite.compare', label: 'Compare two sprites', group, run: dialog('compare') },
  { id: 'sprite.folder_from_selection', label: 'New folder from the selected sprites', group, run: dialog('folder') },
  { id: 'sprite.save_selection', label: 'Save the sprite selection', group, run: dialog('selection') },
];

const SPRITE_EDITS: readonly CommandDef[] = [
  {
    id: 'sprite.open_entry',
    label: 'Edit the picked entry',
    group,
    run: withManager((manager) => {
      const strip = manager.animations.find((fact) => manager.picked.includes(fact.key));
      if (strip && manager.ids.length === 0) pickTab({ kind: 'animation', id: strip.animation.id });
      else isolateSprite();
    }),
  },
  { id: 'sprite.make_tileset', label: 'Make a tileset from the picked sprites', group, run: withManager((manager) => void makeTileset(manager.ids)) },
  {
    id: 'sprite.show_in_project',
    label: 'Show in the Project panel',
    group,
    run: withManager((manager) => {
      const first = manager.ids[0] ?? manager.animations.find((fact) => manager.picked.includes(fact.key))?.animation.id;
      const path = first === undefined ? '' : assetPathOf(first);
      if (path !== '') revealInProjectWindow(path);
    }),
  },
  { id: 'sprite.trim', label: 'Trim sprites to their content', group, run: withManager((manager) => trimSprites(manager.ids)) },
  { id: 'sprite.flip_horizontal', label: 'Flip sprites left to right', group, run: withManager((manager) => flipSprites(manager.ids, 'horizontal')) },
  { id: 'sprite.flip_vertical', label: 'Flip sprites top to bottom', group, run: withManager((manager) => flipSprites(manager.ids, 'vertical')) },
  { id: 'sprite.turn_left', label: 'Turn sprites left', group, run: withManager((manager) => turnSprites(manager.ids, 'counter-clockwise')) },
  { id: 'sprite.turn_right', label: 'Turn sprites right', group, run: withManager((manager) => turnSprites(manager.ids, 'clockwise')) },
  { id: 'sprite.turn_half', label: 'Turn sprites 180 degrees', group, run: withManager((manager) => turnSprites(manager.ids, 'half')) },
];

const SPRITE_ORDER: readonly CommandDef[] = [
  { id: 'sprite.move_to_start', label: 'Move sprites to the start', group, run: withManager((manager) => reorderSprites(manager.ids, { to: 0 })) },
  { id: 'sprite.move_to_end', label: 'Move sprites to the end', group, run: withManager((manager) => reorderSprites(manager.ids, { to: END_INDEX })) },
  {
    id: 'sprite.sort_by_name',
    label: 'Sort sprites by name',
    group,
    run: withManager((manager) => applyOrder(sortFacts(manager.facts, 'name', false).map((fact) => fact.sprite.id))),
  },
  { id: 'sprite.use_view_order', label: 'Make the shown order the sheet order', group, run: withManager((manager) => applyOrder(manager.shown.map((fact) => fact.sprite.id))) },
];

const SPRITE_SHEET: readonly CommandDef[] = [
  { id: 'sprite.add_to_sheet', label: 'Add sprites to the sheet', group, run: withManager((manager) => addToSheet(manager.ids, manager.sheet?.id ?? null)) },
  {
    id: 'sprite.remove_from_sheet',
    label: 'Remove entries from the sheet',
    group,
    run: withManager((manager) => removeEntries(manager.ids, manager.picked, manager.sheet?.id ?? null)),
  },
  {
    id: 'sprite.move_to_sheet',
    label: 'Move sprites to another sheet',
    group,
    run: toSheet((manager, sheet) => moveToSheet(manager.ids, sheet.id)),
  },
  { id: 'sprite.copy_entries', label: 'Copy the picked entries', group, run: withManager((manager) => holdEntries(manager.ids, manager.picked, manager.sheet?.id ?? null, false)) },
  { id: 'sprite.cut_entries', label: 'Cut the picked entries', group, run: withManager((manager) => holdEntries(manager.ids, manager.picked, manager.sheet?.id ?? null, true)) },
  { id: 'sprite.paste_entries', label: 'Paste entries on the sheet', group, run: () => void pasteEntries() },
  { id: 'sprite.distribute_rows', label: 'Distribute the picked sprites in rows', group, run: withManager((manager) => distributeRows(manager.sheet, manager.ids, manager.picked)) },
  { id: 'sprite.export_selection_sheet', label: 'Export the picked sprites as a sheet', group, run: () => exportSelection('sheet') },
  { id: 'sprite.export_selection_files', label: 'Export the picked sprites as PNG files', group, run: () => exportSelection('sprite') },
  {
    id: 'sprite.copy_to_sheet',
    label: 'Copy the picked entries to another sheet',
    group,
    run: toSheet((manager, sheet) => copyToSheet(manager.ids, manager.picked, sheet.id)),
  },
  {
    id: 'sheet.align',
    label: 'Align the selected sprites',
    group,
    run: withManager((manager, context) => {
      const { mode } = commandArgs<AlignArgs>(context);
      if (mode !== undefined) alignSprites(manager.sheet, manager.ids, mode);
    }),
  },
];

const SPRITE_SELECT: readonly CommandDef[] = [
  { id: 'sprite.select_none', label: 'Select no sprites', group, run: () => clearSpriteSelection() },
  { id: 'sprite.select_invert', label: 'Invert the sprite selection', group, run: withManager((manager) => selectIds(invertIds(manager.order, manager.ids))) },
  { id: 'sprite.select_same_size', label: 'Select sprites of the same size', group, run: withManager((manager) => selectIds(idsLike(manager.facts, manager.ids, 'size'))) },
  { id: 'sprite.select_same_folder', label: 'Select sprites of the same folder', group, run: withManager((manager) => selectIds(idsLike(manager.facts, manager.ids, 'folder'))) },
  {
    id: 'sprite.select_duplicates',
    label: 'Select sprites that are identical',
    group,
    run: withManager((manager, context) => selectDuplicates(manager.facts.map((fact) => fact.sprite), commandArgs<{ flipped: boolean }>(context).flipped === true)),
  },
  {
    id: 'sprite.load_selection',
    label: 'Select the sprites of a saved selection',
    group,
    run: withManager((manager, context) => {
      const found = useManagerStore.getState().selections.find((each) => each.name === commandArgs<NameArgs>(context).name);
      if (found) applySelection(manager.artwork, found);
    }),
  },
  {
    id: 'sprite.drop_selection',
    label: 'Delete a saved selection',
    group,
    run: (context?: CommandContext) => {
      const { name } = commandArgs<NameArgs>(context);
      if (name !== undefined) useManagerStore.getState().dropSelection(name);
    },
  },
  {
    id: 'sprite.select_by_trait',
    label: 'Select sprites by tag, size or palette',
    group,
    run: withManager((manager, context) => {
      const { kind, value } = commandArgs<TraitArgs>(context);
      if (kind !== undefined && value !== undefined) selectIds(idsByTrait(manager.facts, { kind, value }));
    }),
  },
  {
    id: 'manager.clear_filters',
    label: 'Clear the sprite filters',
    group,
    ...needs(() => activeFilters(useManagerStore.getState().filter) > 0 || useManagerStore.getState().query !== '', REASON.noActiveFilter),
    run: () => useManagerStore.getState().clearFilters(),
  },
];

const SPRITE_MENU_COMMANDS: readonly CommandDef[] = [...SPRITE_ACTIONS, ...SPRITE_EDITS, ...ANIMATION_ENTRY_COMMANDS, ...SPRITE_ORDER, ...SPRITE_SHEET, ...SPRITE_SELECT].map(ruled);

export { SPRITE_MENU_COMMANDS };
