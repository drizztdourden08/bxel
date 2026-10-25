/* @layer renderer-app @kind logic */
import { IMAGE_EXTENSIONS, IMAGE_MIMES } from './image-import.constants';

const isImageFile = (file: File): boolean =>
  IMAGE_MIMES.includes(file.type) || IMAGE_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension));

export { isImageFile };
