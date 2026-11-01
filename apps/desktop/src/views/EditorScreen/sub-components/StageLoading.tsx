/* @layer renderer-app @kind component */
import { Flex, ProgressRing, Spinner, Text } from '@drizztdourden08/tessera';
import { STAGE_TEXT } from '../../../stage-state/stage-state.constants';
import type { StageLoadingProps } from '../EditorScreen.type';

const StageLoading = ({ progress, done, total }: StageLoadingProps) => (
  <Flex direction="column" align="center" justify="center" gap="md" className="stage-state" role="status" aria-live="polite" aria-label={STAGE_TEXT.loadingLabel}>
    {progress === null ? <Spinner size="lg" label={STAGE_TEXT.loadingLabel} /> : <ProgressRing progress={progress} className="stage-state__ring" />}
    <Text>{progress === null ? STAGE_TEXT.loadingLabel : STAGE_TEXT.loadingCount(done, total)}</Text>
  </Flex>
);

export { StageLoading };
