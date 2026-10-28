/* @layer renderer-app @kind component */
import { Button, Flex, Icon } from '@drizztdourden08/tessera';
import { zoomView } from '../../../editor/zoom-view';
import { zoomSelection } from '../../../view-zoom/zoom-selection';
import { ZOOM_TEXT } from '../../../view-zoom/view-zoom.constants';
import type { ZoomActionsProps } from '../ZoomField.type';

const ZoomActions = ({ disabled }: ZoomActionsProps) => (
  <Flex wrap gap="xs" className="zoom-field__actions">
    <Button size="sm" variant="secondary" icon={<Icon name="maximize-2" size={14} />} disabled={disabled} onClick={() => zoomView('fit')}>{ZOOM_TEXT.fit}</Button>
    <Button size="sm" variant="secondary" icon={<Icon name="zoom-in" size={14} />} disabled={disabled} onClick={() => zoomView('actual')}>{ZOOM_TEXT.actual}</Button>
    <Button size="sm" variant="secondary" icon={<Icon name="pixel-select-rect" size={14} />} disabled={disabled} onClick={zoomSelection}>{ZOOM_TEXT.selection}</Button>
  </Flex>
);

export { ZoomActions };
