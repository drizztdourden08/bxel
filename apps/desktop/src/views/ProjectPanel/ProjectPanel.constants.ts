/* @layer renderer-app @kind constants */
import type { ProjectLocation } from '../../project/project.type';
import type { ListingState } from './ProjectPanel.type';

const EMPTY_LISTING: ListingState = { listing: null, error: null };

const START_LOCATION: ProjectLocation = { folderId: '', segments: [] };

export { EMPTY_LISTING, START_LOCATION };
