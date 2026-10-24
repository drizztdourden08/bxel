/* @layer renderer-app @kind constants */
import { ERROR_CODE } from '@bxel/document';
import type { ErrorCode } from '@bxel/document';
import { LAYER_TEXT } from './layer-text.constants';

const LAYER_ERROR_TEXT: Readonly<Partial<Record<ErrorCode, (name: string) => string>>> = {
  [ERROR_CODE.LAYER_LOCKED]: LAYER_TEXT.needUnlock,
  [ERROR_CODE.LAYER_HIDDEN]: LAYER_TEXT.needShow,
  [ERROR_CODE.LAST_LAYER]: () => LAYER_TEXT.lastLayer,
  [ERROR_CODE.NO_LAYER_BELOW]: () => LAYER_TEXT.bottom,
  [ERROR_CODE.TARGET_EMPTY]: () => LAYER_TEXT.noVisible,
  [ERROR_CODE.NAME_INVALID]: () => LAYER_TEXT.nameInvalid,
  [ERROR_CODE.NAME_TAKEN]: () => LAYER_TEXT.nameTaken,
};

export { LAYER_ERROR_TEXT };
