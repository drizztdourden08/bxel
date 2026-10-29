/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { CLIPBOARD_PNG } from '@drizztdourden08/brock-core/platform';
import { clipType } from './clip-type';

const systemClipHeld = async (): Promise<boolean> => {
  try {
    const port = getPlatform().clipboard;
    if (!port) return false;
    const held = await port.read([clipType(), CLIPBOARD_PNG]);
    return Object.values(held).some((value) => value instanceof Uint8Array && value.length > 0);
  } catch {
    return false;
  }
};

export { systemClipHeld };
