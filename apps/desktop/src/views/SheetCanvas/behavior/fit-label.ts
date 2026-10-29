/* @layer renderer-app @kind logic */
import { LABEL_ELLIPSIS } from '../SheetCanvas.constants';

const fitLabel = (name: string, room: number, measure: (text: string) => number): string => {
  if (measure(name) <= room) return name;
  for (let length = name.length - 1; length > 0; length -= 1) {
    const text = `${name.slice(0, length)}${LABEL_ELLIPSIS}`;
    if (measure(text) <= room) return text;
  }
  return '';
};

export { fitLabel };
