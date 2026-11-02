/* @layer renderer-app @kind constants */
import type { ViewSectionId } from './view-section.type';

const SECTION_MENU = {
  zone: 'view.section',
  label: 'View section actions',
  reset: 'Reset section',
  nothingToReset: 'This section has nothing to reset.',
  toolbar: 'Show in toolbar',
  noToolbar: 'This section has no toolbar buttons.',
  settings: 'Open settings page',
} as const;

const SECTION_COMMAND = {
  reset: 'view.section_reset',
  toolbar: 'view.section_toolbar',
  settings: 'view.section_settings',
} as const;

const SECTION_PAGES: Readonly<Record<ViewSectionId, string>> = {
  navigator: 'canvas',
  zoom: 'canvas',
  preview: 'canvas',
  overlays: 'grid',
  guides: 'grid',
  onion: 'animation',
  tiled: 'canvas',
  symmetry: 'tools',
  reference: 'canvas',
  background: 'canvas',
};

const SECTION_TOOLBAR_ITEMS: Readonly<Partial<Record<ViewSectionId, readonly string[]>>> = {
  zoom: ['zoom-fit', 'zoom-actual'],
  overlays: ['grid', 'gridMajor', 'gridTile', 'snap'],
  guides: ['guides', 'rulers'],
  onion: ['onion'],
  tiled: ['tiled'],
  symmetry: ['mirror-x', 'mirror-y'],
};

const CANVAS_TOOLBAR = 'canvas';

export { CANVAS_TOOLBAR, SECTION_COMMAND, SECTION_MENU, SECTION_PAGES, SECTION_TOOLBAR_ITEMS };
