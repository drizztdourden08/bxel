/* @layer core @kind logic */
import { manifestSchema } from '../schema/manifest-schema';
import type { ArchiveContents } from './archive.type';
import type { Manifest } from './manifest.type';
import { parseManifestWith } from './parse-manifest-with';
import type { Parsed } from './parsed.type';

const parseManifest = (archive: ArchiveContents): Parsed<Manifest> => parseManifestWith(archive, manifestSchema);

export { parseManifest };
