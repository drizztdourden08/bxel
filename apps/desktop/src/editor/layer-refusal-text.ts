/* @layer renderer-app @kind logic */
import type { CommandError } from '@bxel/document';
import { LAYER_ERROR_TEXT } from './layer-error-text.constants';

/** Why a layer command was refused, in plain words, for a list that has no sprite to name a layer from. */
const layerRefusalText = (error: CommandError): string => LAYER_ERROR_TEXT[error.code]?.('') ?? error.message;

export { layerRefusalText };
