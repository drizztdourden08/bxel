/* @layer renderer-app @kind logic */
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';
import { CUSTOM_COLOUR } from '../LayerStack.constants';

const colourName = (hex: string): string => TAG_COLOUR_CHOICES.find((choice) => choice.hex === hex)?.name ?? CUSTOM_COLOUR;

export { colourName };
