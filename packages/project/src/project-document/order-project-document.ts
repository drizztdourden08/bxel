/* @layer core @kind logic */
import type { PaletteDefault, PixelSize, ProjectDefaults } from '../defaults/asset-defaults.type';
import { FOLDER_ROLES } from './project-document.constants';
import type { FolderRoles, DocumentFolder, ProjectDocument, ProjectExport } from './project-document.type';

const orderSize = (size: PixelSize) => ({ width: size.width, height: size.height });

const orderPalette = (palette: PaletteDefault) =>
  palette.kind === 'preset'
    ? { kind: palette.kind, presetId: palette.presetId }
    : { kind: palette.kind, folderId: palette.folderId, path: palette.path };

const orderRoles = (roles: FolderRoles) =>
  Object.fromEntries(FOLDER_ROLES.flatMap((role) => (roles[role] === undefined ? [] : [[role, roles[role]]])));

const orderFolder = (folder: DocumentFolder) => ({
  folderId: folder.folderId,
  name: folder.name,
  path: folder.path,
  roles: orderRoles(folder.roles),
});

const orderDefaults = (defaults: ProjectDefaults) => ({
  ...(defaults.size === undefined ? {} : { size: orderSize(defaults.size) }),
  ...(defaults.colorLimit === undefined ? {} : { colorLimit: defaults.colorLimit }),
  ...(defaults.palette === undefined ? {} : { palette: orderPalette(defaults.palette) }),
  ...(defaults.platformId === undefined ? {} : { platformId: defaults.platformId }),
  ...(defaults.platformStrict === undefined ? {} : { platformStrict: defaults.platformStrict }),
  ...(defaults.transparent === undefined ? {} : { transparent: defaults.transparent }),
  ...(defaults.frameDurationMs === undefined ? {} : { frameDurationMs: defaults.frameDurationMs }),
  ...(defaults.pixelGrid === undefined ? {} : { pixelGrid: orderSize(defaults.pixelGrid) }),
});

const orderExport = (settings: ProjectExport) => ({
  ...(settings.scale === undefined ? {} : { scale: settings.scale }),
  ...(settings.pathTemplate === undefined ? {} : { pathTemplate: settings.pathTemplate }),
});

const orderProjectDocument = (manifest: ProjectDocument) => ({
  format: manifest.format,
  formatVersion: manifest.formatVersion,
  projectId: manifest.projectId,
  name: manifest.name,
  ...(manifest.cover === undefined ? {} : { cover: { folderId: manifest.cover.folderId, path: manifest.cover.path } }),
  folders: manifest.folders.map(orderFolder),
  defaults: orderDefaults(manifest.defaults),
  ...(manifest.export === undefined ? {} : { export: orderExport(manifest.export) }),
  assistant: {
    access: manifest.assistant.access,
    ...(manifest.assistant.folders === undefined ? {} : { folders: [...manifest.assistant.folders] }),
  },
});

export { orderProjectDocument };
