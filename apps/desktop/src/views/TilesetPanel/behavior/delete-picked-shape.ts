/* @layer renderer-app @kind logic */
import { pickedShape } from './picked-shape';
import { removeShape } from './remove-shape';

const deletePickedShape = (): boolean => {
  const picked = pickedShape();
  return picked ? removeShape(picked.tile, picked.index) : false;
};

export { deletePickedShape };
