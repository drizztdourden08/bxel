/* @layer core @kind constants */
import type { BundleDef } from './catalogue.type';

const BUNDLES = [
  { id: 'session', label: 'Session', description: 'Start, show and stop Bxel, and see the session.', document: false },
  { id: 'browse_files', label: 'Browse files', description: 'List places, files, assets and open documents; open and close documents.', document: false },
  { id: 'read_documents', label: 'Read documents', description: 'Read documents, pixels, palettes, maps and animations; render and preview.', document: false },
  { id: 'edit_pixels', label: 'Edit pixels', description: 'Edit pixels, layers, cels, frames, palettes, guides, slices and presets; undo.', document: true },
  { id: 'animation', label: 'Animation', description: 'Edit animations and tags.', document: true },
  { id: 'sheets_sprites', label: 'Sheets and sprites', description: 'Edit sheets and sprites.', document: true },
  { id: 'tilemaps', label: 'Tilemaps', description: 'Edit maps, tiles, tilemaps and tilesets.', document: true },
  { id: 'files_saving', label: 'Files and saving', description: 'Create, save and export documents; split legacy files.', document: true },
  { id: 'app_control', label: 'App control', description: 'Run commands and change the view in the owner window.', document: false },
  { id: 'layout', label: 'Layout', description: 'Show, hide and move widgets and toolbars.', document: false },
  { id: 'settings', label: 'Settings', description: 'Read and change app, project and asset settings.', document: false },
] as const satisfies readonly BundleDef[];

const BUNDLE_IDS = BUNDLES.map((bundle) => bundle.id);

export { BUNDLE_IDS, BUNDLES };
