/* @layer renderer-app @kind hook */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { useEffect, useRef } from 'react';
import { ruledEntries } from '../../../context-menu/ruled-entries';
import type { ImageTab } from '../../../stores/image-tab-store.type';
import type { SharedView } from '../../ImagePreview/ImagePreview.type';
import { IMAGE_MENU } from '../ImageStage.constants';
import { imageMenuEntries } from './image-menu-entries';

const useImageMenu = (tab: ImageTab | undefined, view: SharedView): void => {
  const latest = useRef({ tab, view });
  useEffect(() => {
    latest.current = { tab, view };
  });
  useContextMenu(IMAGE_MENU.zone, {
    label: IMAGE_MENU.label,
    entries: ruledEntries(() => (latest.current.tab ? imageMenuEntries(latest.current.tab, latest.current.view) : [])),
  });
};

export { useImageMenu };
