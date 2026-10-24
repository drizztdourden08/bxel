/* @layer core @kind logic */
import { MANIFEST_SUFFIX } from '../paths/path.constants';

const isManifestFile = (name: string): boolean => name.toLowerCase().endsWith(MANIFEST_SUFFIX);

export { isManifestFile };
