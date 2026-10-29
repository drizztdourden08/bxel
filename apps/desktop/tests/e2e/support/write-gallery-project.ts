/* @layer renderer-app @kind test */
import { join } from 'node:path';
import { buildGalleryArtwork } from './build-gallery-artwork';
import { GALLERY } from './gallery.constants';
import { linkTargets } from './link-targets';
import { writeSampleProject } from './write-sample-project';

type GalleryProject = { readonly root: string; readonly sheetPath: string; readonly spritePath: string };

const writeGalleryProject = async (place: string): Promise<GalleryProject> => {
  const root = join(place, GALLERY.project);
  const written = await writeSampleProject(root, buildGalleryArtwork(), GALLERY.project);
  const sheetPath = [...written.values()].find((path) => path.endsWith('.bxsheet')) ?? '';
  return { root, sheetPath, spritePath: linkTargets(sheetPath).find((path) => path.endsWith('.bxsprite')) ?? '' };
};

export { writeGalleryProject };
