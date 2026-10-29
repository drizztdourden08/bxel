/* @layer renderer-app @kind logic */
import { IMAGE_ACCEPT } from './image-drop.constants';

const pickImageFiles = (): Promise<File[]> =>
  new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = IMAGE_ACCEPT;
    input.addEventListener('change', () => resolve(Array.from(input.files ?? [])));
    input.addEventListener('cancel', () => resolve([]));
    input.click();
  });

export { pickImageFiles };
