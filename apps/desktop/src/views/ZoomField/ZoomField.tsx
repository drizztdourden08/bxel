/* @layer renderer-app @kind component */
import { Flex, NumberField, Slider } from '@drizztdourden08/tessera';
import { zoomTo } from '../../editor/zoom-to';
import { ZOOM_PERCENT, ZOOM_PRESETS, ZOOM_TEXT } from '../../view-zoom/view-zoom.constants';
import { useZoomPercent } from './behavior/useZoomPercent';
import { ZoomActions } from './sub-components/ZoomActions';
import { ZoomPresets } from './sub-components/ZoomPresets';
import './ZoomField.css';

const ZoomField = () => {
  const percent = useZoomPercent();
  const disabled = percent === null;
  const shown = percent ?? 100;
  return (
    <Flex direction="column" gap="sm" role="group" aria-label={ZOOM_TEXT.region} className="zoom-field">
      <NumberField
        size="sm"
        buttons="sides"
        stepLabels={[ZOOM_TEXT.zoomOut, ZOOM_TEXT.zoomIn]}
        aria-label={ZOOM_TEXT.field}
        suffix="%"
        min={ZOOM_PERCENT.min}
        max={ZOOM_PERCENT.max}
        ladder={ZOOM_PRESETS}
        scrub={false}
        disabled={disabled}
        value={shown}
        onChange={zoomTo}
        className="zoom-field__number"
      />
      <Slider
        size="sm"
        scale="log"
        min={ZOOM_PERCENT.min}
        max={ZOOM_PERCENT.max}
        step={1}
        ladder={ZOOM_PRESETS}
        aria-label={ZOOM_TEXT.slider}
        disabled={disabled}
        showValue={false}
        formatValue={ZOOM_TEXT.preset}
        value={shown}
        onChange={(value) => zoomTo(Math.round(value))}
      />
      <ZoomPresets percent={percent} disabled={disabled} />
      <ZoomActions disabled={disabled} />
    </Flex>
  );
};

export { ZoomField };
