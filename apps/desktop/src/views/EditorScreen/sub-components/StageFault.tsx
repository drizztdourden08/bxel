/* @layer renderer-app @kind component */
import { Button, Flex, LoadError } from '@drizztdourden08/tessera';
import { revealRow } from '../../../asset-list/reveal-row';
import { runFileAction } from '../../../files/run-file-action';
import { STAGE_TEXT } from '../../../stage-state/stage-state.constants';
import { useFaultStore } from '../../../stores/useFaultStore';
import type { StageFaultProps } from '../EditorScreen.type';

const StageFault = ({ fault }: StageFaultProps) => {
  const { action } = fault;
  const path = action.kind === 'openPath' ? action.path : null;
  return (
    <Flex direction="column" align="center" justify="center" gap="md" className="stage-state">
      <LoadError message={fault.message} onRetry={() => void runFileAction(action)} />
      <Flex gap="sm">
        {path !== null && (
          <Button size="sm" variant="secondary" onClick={() => revealRow({ path })}>
            {STAGE_TEXT.reveal}
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => useFaultStore.getState().set(null)}>
          {STAGE_TEXT.dismiss}
        </Button>
      </Flex>
    </Flex>
  );
};

export { StageFault };
