/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { activeSheetOf } from '../../../asset-list/active-sheet-of';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { canCopyForSheet } from '../../../asset-list/can-copy-for-sheet';
import { KIND_MENU } from '../../../asset-list/kind-menu.constants';
import { openSpriteId } from '../../../asset-list/open-sprite-id';
import type { BrowserItem } from '../../../panel-browser/project-browser.type';
import { currentTileset } from '../../../tilemap/current-tileset';
import { currentFocus } from '../../../timeline/current-focus';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import type { KindArgs } from './kind-group-entries.type';

const onSheet = (item: BrowserItem): boolean => activeSheetOf()?.sheet.entries.some((entry) => entry.spriteId === item.row?.assetId) ?? false;

const isLoaded = (item: BrowserItem, kind: string): boolean => item.role === 'file' && item.kind === kind && item.row?.loaded === true;

const spriteEntries = (item: BrowserItem, args: KindArgs): readonly ContextMenuEntry[] => {
  const sprite = isLoaded(item, 'sprite');
  return [
    { command: 'asset.add_to_sheet', label: PROJECT_MENU.addToSheet, args, hidden: !sprite || activeSheetOf() === null || onSheet(item) },
    { command: 'asset.add_to_animation', label: KIND_MENU.addToAnimation, args, hidden: !sprite || currentFocus() === null },
    { command: 'asset.copy_for_sheet', label: ASSET_LIST_TEXT.copyForSheet, args, hidden: item.row === null || !canCopyForSheet(item.row) },
    { command: 'asset.make_animation', label: PROJECT_MENU.makeAnimation, args, hidden: !sprite },
  ];
};

const assetKindEntries = (item: BrowserItem, args: KindArgs): readonly ContextMenuEntry[] => [
  { command: 'asset.apply_palette', label: KIND_MENU.applyPalette, args, hidden: !isLoaded(item, 'palette') || openSpriteId() === null },
  { command: 'asset.new_tilemap_from', label: KIND_MENU.newTilemapFrom, args, hidden: !isLoaded(item, 'tileset') },
  { command: 'asset.open_sprites', label: KIND_MENU.openSprites, args, hidden: !isLoaded(item, 'sheet') },
  { command: 'asset.open_tileset', label: KIND_MENU.openTileset, args, hidden: !isLoaded(item, 'tilemap') },
];

const fileKindEntries = (item: BrowserItem, args: KindArgs): readonly ContextMenuEntry[] => {
  const file = item.role === 'file';
  return [
    { command: 'asset.split_legacy', label: KIND_MENU.splitLegacy, args, hidden: !file || item.kind !== 'legacy' },
    { command: 'asset.unpack_project', label: KIND_MENU.unpack, args, hidden: !file || item.kind !== 'project' },
    { command: 'asset.open_in_hub', label: KIND_MENU.openInHub, args, hidden: !file || item.kind !== 'project' },
    { command: 'asset.import_as_sprite', label: KIND_MENU.importSprite, args, hidden: !file || item.kind !== 'image' },
    { command: 'asset.import_as_tileset', label: KIND_MENU.importTileset, args, hidden: !file || item.kind !== 'image' || currentTileset() === null },
  ];
};

const kindGroupEntries = (item: BrowserItem): readonly ContextMenuEntry[] => {
  const args = { key: item.key, path: item.path };
  return [...spriteEntries(item, args), ...assetKindEntries(item, args), ...fileKindEntries(item, args)];
};

export { kindGroupEntries };
