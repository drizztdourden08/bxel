/* @layer renderer-app @kind constants */
import type { ProjectLocation } from '../../project/project.type';
import type { CreatableKind } from '../../stores/creation-store.type';
import type { ListingState } from './ProjectPanel.type';

const EMPTY_LISTING: ListingState = { listing: null, error: null };

const START_LOCATION: ProjectLocation = { folderId: '', segments: [] };

const OPENED_KINDS: readonly string[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap', 'project', 'legacy'];

const NEW_ASSET_KINDS: readonly CreatableKind[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'];

const PROJECT_MENU = {
  zone: 'project.start',
  label: 'Project actions',
  assetRow: '[data-asset-id]',
  entryRow: '[data-entry-name]',
  newAsset: 'New asset',
  newFolder: 'New folder',
  refresh: 'Refresh',
  revealRoot: 'Reveal the project folder',
  export: 'Export...',
  showUsers: 'Show the sheets that use it',
  trash: 'Move to trash',
} as const;

export { EMPTY_LISTING, NEW_ASSET_KINDS, OPENED_KINDS, PROJECT_MENU, START_LOCATION };
