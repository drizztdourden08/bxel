/* @layer core @kind logic */
import type { FolderLocation, ProjectFolder, ProjectManifest } from './manifest.type';

const orderLocation = (location: FolderLocation) => ({ folderId: location.folderId, path: location.path });

const orderFolder = (folder: ProjectFolder) => ({ folderId: folder.folderId, name: folder.name, path: folder.path });

const orderManifest = (manifest: ProjectManifest) => ({
  format: manifest.format,
  formatVersion: manifest.formatVersion,
  projectId: manifest.projectId,
  name: manifest.name,
  folders: manifest.folders.map(orderFolder),
  settings: {
    newFiles: orderLocation(manifest.settings.newFiles),
    exports: orderLocation(manifest.settings.exports),
    palette: manifest.settings.palette === null ? null : orderLocation(manifest.settings.palette),
  },
  assistant: { access: manifest.assistant.access },
});

export { orderManifest };
