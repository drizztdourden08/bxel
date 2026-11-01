/* @layer renderer-app @kind logic */
import { addReferenceLayer } from './add-reference-layer';
import { pickReferencePath } from './pick-reference-path';

const chooseReferenceLayer = async (): Promise<void> => {
  const path = await pickReferencePath();
  if (path !== null) addReferenceLayer(path);
};

export { chooseReferenceLayer };
