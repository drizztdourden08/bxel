/* @layer renderer-app @kind logic */
import { pickReferencePath } from '../editor/pick-reference-path';
import { addReferenceFromPath } from './add-reference-from-path';

const chooseReferenceImage = async (): Promise<void> => {
  const path = await pickReferencePath();
  if (path !== null) addReferenceFromPath(path);
};

export { chooseReferenceImage };
