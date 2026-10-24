/* @layer renderer-app @kind logic */
import { PNG_MIME } from './image-import.constants';

const isPngFile = (file: File): boolean => file.type === PNG_MIME || file.name.toLowerCase().endsWith('.png');

export { isPngFile };
