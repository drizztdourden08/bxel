/* @layer renderer-app @kind component */
import { Button, EmptyState } from '@drizztdourden08/tessera';
import { ownFrame } from '../../../timeline/own-frame';
import { TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { EDITOR_CANVAS_TEXT } from '../EditorCanvas.constants';

const EmptyFrame = ({ readOnly }: { readonly readOnly: boolean }) => (
  <EmptyState
    message={EDITOR_CANVAS_TEXT.emptyFrame}
    action={
      <Button variant="primary" disabled={readOnly} onClick={() => ownFrame()}>
        {TIMELINE_LABEL.own}
      </Button>
    }
  />
);

export { EmptyFrame };
