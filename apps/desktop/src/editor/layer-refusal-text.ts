/* @layer renderer-app @kind logic */
import type { CommandError } from '@bxel/document';
import { LAYER_ERROR_TEXT } from './layer-error-text.constants';

const layerRefusalText = (error: CommandError): string => LAYER_ERROR_TEXT[error.code]?.('') ?? error.message;

export { layerRefusalText };
