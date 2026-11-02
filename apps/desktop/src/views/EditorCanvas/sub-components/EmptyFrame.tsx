/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex } from '@drizztdourden08/tessera';
import { copyPreviousFrame } from '../../../timeline/copy-previous-frame';
import { ownFrame } from '../../../timeline/own-frame';
import { TIMELINE_LABEL } from '../../../timeline/timeline.constants';
import { EDITOR_CANVAS_TEXT } from '../EditorCanvas.constants';

const EmptyFrame = ({ readOnly, hasPrevious }: { readonly readOnly: boolean; readonly hasPrevious: boolean }) => (
  <EmptyState
    message={EDITOR_CANVAS_TEXT.emptyFrame}
    action={
      <Flex gap="sm">
        <Button variant="primary" disabled={readOnly} onClick={() => ownFrame()}>
          {TIMELINE_LABEL.own}
        </Button>
        <Button variant="secondary" disabled={readOnly || !hasPrevious} onClick={() => copyPreviousFrame()}>
          {EDITOR_CANVAS_TEXT.copyPrevious}
        </Button>
      </Flex>
    }
  />
);

export { EmptyFrame };
