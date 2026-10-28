/* @layer renderer-app @kind component */
import { Flex, IconButton, Icon, Slider, TextInput } from '@drizztdourden08/tessera';
import { zoomView } from '../../editor/zoom-view';
import { zoomTo } from '../../editor/zoom-to';
import { percentToSlider } from '../../view-zoom/percent-to-slider';
import { sliderToPercent } from '../../view-zoom/slider-to-percent';
import { ZOOM_SLIDER, ZOOM_TEXT } from '../../view-zoom/view-zoom.constants';
import { useZoomDraft } from './behavior/useZoomDraft';
import { useZoomPercent } from './behavior/useZoomPercent';
import { ZoomActions } from './sub-components/ZoomActions';
import { ZoomPresets } from './sub-components/ZoomPresets';
import './ZoomField.css';

const ZoomField = () => {
  const percent = useZoomPercent();
  const draft = useZoomDraft(percent);
  const disabled = percent === null;
  return (
    <Flex direction="column" gap="sm" role="group" aria-label={ZOOM_TEXT.region} className="zoom-field">
      <Flex gap="xs" align="center">
        <IconButton size="sm" variant="secondary" label={ZOOM_TEXT.zoomOut} disabled={disabled} onClick={() => zoomView('out')}>
          <Icon name="pixel-zoom-out" size={16} />
        </IconButton>
        <TextInput
          size="sm"
          grow
          inputMode="numeric"
          aria-label={ZOOM_TEXT.field}
          aria-invalid={draft.invalid || undefined}
          invalid={draft.invalid}
          disabled={disabled}
          value={draft.text}
          onChange={draft.onChange}
          onBlur={draft.onBlur}
          onKeyDown={draft.onKeyDown}
          onFocus={(event) => event.currentTarget.select()}
        />
        <IconButton size="sm" variant="secondary" label={ZOOM_TEXT.zoomIn} disabled={disabled} onClick={() => zoomView('in')}>
          <Icon name="pixel-zoom-in" size={16} />
        </IconButton>
      </Flex>
      <Slider
        size="sm"
        min={ZOOM_SLIDER.min}
        max={ZOOM_SLIDER.max}
        step={1}
        keyStep={50}
        aria-label={ZOOM_TEXT.slider}
        disabled={disabled}
        showValue={false}
        value={percentToSlider(percent ?? 100)}
        onChange={(value) => zoomTo(sliderToPercent(value))}
      />
      <ZoomPresets percent={percent} disabled={disabled} />
      <ZoomActions disabled={disabled} />
    </Flex>
  );
};

export { ZoomField };
