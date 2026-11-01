/* @layer renderer-app @kind logic */
import { CLIPBOARD_TEXT } from '@drizztdourden08/brock-core/platform';
import { getPlatform } from '@drizztdourden08/brock-react';

const readClipboardText = async (): Promise<string | null> => {
  try {
    const port = getPlatform().clipboard;
    if (!port) return null;
    const held = await port.read([CLIPBOARD_TEXT]);
    const value = held[CLIPBOARD_TEXT];
    return typeof value === 'string' ? value : null;
  } catch {
    return null;
  }
};

export { readClipboardText };
