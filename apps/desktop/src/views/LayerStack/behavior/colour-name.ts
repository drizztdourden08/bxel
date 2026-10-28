/* @layer renderer-app @kind logic */
import { TAG_COLOUR_CHOICES } from '../../../timeline/tag-colour.constants';

const CUSTOM_COLOUR = 'custom colour';

/** The name of a colour tag, so a colour is never the only thing that says which tag a row has. */
const colourName = (hex: string): string => TAG_COLOUR_CHOICES.find((choice) => choice.hex === hex)?.name ?? CUSTOM_COLOUR;

export { colourName };
