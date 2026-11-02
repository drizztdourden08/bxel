/* @layer renderer-app @kind logic */
import { requestReference } from '../editor/request-reference';
import { addReferenceImage } from './add-reference-image';
import { referenceName } from './reference-name';

const addReferenceFromPath = (path: string): string | null => {
  requestReference(path);
  return addReferenceImage({ key: path, name: referenceName(path) });
};

export { addReferenceFromPath };
