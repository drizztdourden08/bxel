/* @layer renderer-app @kind logic */
import { currentFocus } from '../timeline/current-focus';
import { insertAt } from '../timeline/insert-at';
import { addImageFiles } from './add-image-files';
import { pickImageFiles } from './pick-image-files';

const addFromImages = async (): Promise<void> => {
  if (currentFocus()?.readOnly !== false) return;
  const files = await pickImageFiles();
  const focus = currentFocus();
  if (focus && files.length > 0) await addImageFiles(files, insertAt(focus));
};

export { addFromImages };
