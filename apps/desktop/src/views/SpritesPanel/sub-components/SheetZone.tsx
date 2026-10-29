/* @layer renderer-app @kind component */
import { commandZone, keepsWidgetFocus } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { useAssetDrop } from '../behavior/useAssetDrop';
import type { SheetZoneProps } from '../SpritesPanel.type';

const SheetZone = ({ model, onKeyDown, bind, children }: SheetZoneProps) => {
  const ref = useRef<HTMLElement>(null);
  useAssetDrop(ref, model);
  return (
    <Box ref={ref} onKeyDown={onKeyDown} className="sprites-panel__zone" {...commandZone(COMMAND_ZONE.sprites)} {...keepsWidgetFocus()} {...bind}>
      {children}
    </Box>
  );
};

export { SheetZone };
