/* @layer renderer-app @kind component */
import { ZoomField as TesseraZoomField } from '@drizztdourden08/tessera';
import { zoomTo } from '../../editor/zoom-to';
import { ZOOM_PERCENT, ZOOM_PRESETS, ZOOM_TEXT } from '../../view-zoom/view-zoom.constants';
import { useZoomPercent } from './behavior/useZoomPercent';
import { ZoomActions } from './sub-components/ZoomActions';
import './ZoomField.css';

const ZoomField = () => {
  const percent = useZoomPercent();
  const disabled = percent === null;
  return (
    <TesseraZoomField
      className="zoom-field"
      label={ZOOM_TEXT.region}
      value={percent ?? 100}
      onChange={zoomTo}
      min={ZOOM_PERCENT.min}
      max={ZOOM_PERCENT.max}
      presets={ZOOM_PRESETS}
      slider="below"
      disabled={disabled}
      actions={<ZoomActions disabled={disabled} />}
    />
  );
};

export { ZoomField };
