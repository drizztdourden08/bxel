/* @layer renderer-app @kind logic */
import { encodePngRgba } from '@bxel/formats';
import { CLIPBOARD_PNG } from '@drizztdourden08/brock-core/platform';
import { getPlatform, toast } from '@drizztdourden08/brock-react';
import type { ImageTab } from '../../../stores/image-tab-store.type';
import { IMAGE_MENU } from '../ImageStage.constants';

const copyImageTab = async (tab: ImageTab): Promise<void> => {
  const { width, height, data } = tab.image;
  const encoded = encodePngRgba({ width, height, data });
  const port = getPlatform().clipboard;
  try {
    if (!encoded.ok || !port) throw new Error(IMAGE_MENU.copyFailed);
    await port.write({ [CLIPBOARD_PNG]: encoded.bytes });
    toast(IMAGE_MENU.copied, { variant: 'success' });
  } catch {
    toast(IMAGE_MENU.copyFailed, { variant: 'danger' });
  }
};

export { copyImageTab };
