/* @layer core @kind logic */
import { ACCESS_SECTION_KEY } from './access-section.constants';
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
  [ACCESS_SECTION_KEY]: { access: manifest[ACCESS_SECTION_KEY].access },
});

export { orderManifest };
