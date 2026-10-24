/* @layer renderer-app @kind constants */
import type { ProjectLocation } from '../../project/project.type';
import type { CreatableKind } from '../../stores/creation-store.type';
import type { ListingState } from './ProjectPanel.type';

const EMPTY_LISTING: ListingState = { listing: null, error: null };

const START_LOCATION: ProjectLocation = { folderId: '', segments: [] };

const OPENED_KINDS: readonly string[] = ['sprite', 'sheet', 'palette', 'tileset', 'tilemap', 'project', 'legacy'];

const NEW_ASSET_KINDS: readonly CreatableKind[] = ['sprite', 'sheet', 'palette', 'tileset', 'tilemap'];

export { EMPTY_LISTING, NEW_ASSET_KINDS, OPENED_KINDS, START_LOCATION };
