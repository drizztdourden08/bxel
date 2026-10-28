/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera';
import { zoomTo } from '../../../editor/zoom-to';
import { ZOOM_PRESETS, ZOOM_TEXT } from '../../../view-zoom/view-zoom.constants';
import type { ZoomPresetsProps } from '../ZoomField.type';

const ZoomPresets = ({ percent, disabled }: ZoomPresetsProps) => (
  <Flex wrap gap="2xs" role="group" aria-label={ZOOM_TEXT.presets} className="zoom-field__presets">
    {ZOOM_PRESETS.map((preset) => (
      <Button
        key={preset}
        size="sm"
        variant="ghost"
        active={percent === preset}
        aria-pressed={percent === preset}
        disabled={disabled}
        onClick={() => zoomTo(preset)}
      >
        {ZOOM_TEXT.preset(preset)}
      </Button>
    ))}
  </Flex>
);

export { ZoomPresets };
