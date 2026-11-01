/* @layer renderer-app @kind component */
import { Button, ErrorBoundary } from '@drizztdourden08/tessera';
import { revealRow } from '../../../asset-list/reveal-row';
import { useActiveAsset } from '../../../hooks/useActiveAsset';
import { STAGE_TEXT } from '../../../stage-state/stage-state.constants';
import { FileTypePicker } from '../../FileTypePicker';
import type { StageBodyProps } from '../EditorScreen.type';
import { useStageState } from '../behavior/useStageState';
import { StageFault } from './StageFault';
import { StageLoading } from './StageLoading';
import { StageMissing } from './StageMissing';
import { StageSurface } from './StageSurface';

const StageBody = ({ adding }: StageBodyProps) => {
  const state = useStageState();
  const asset = useActiveAsset();
  const path = asset?.path;
  if (adding) return <FileTypePicker />;
  if (state.kind === 'loading') return <StageLoading progress={state.progress} done={state.done} total={state.total} />;
  if (state.kind === 'error') return <StageFault fault={state.fault} />;
  if (state.kind === 'missing') return <StageMissing links={state.links} />;
  const reveal = path ? (
    <Button size="sm" variant="secondary" onClick={() => revealRow({ path })}>
      {STAGE_TEXT.reveal}
    </Button>
  ) : undefined;
  return (
    <ErrorBoundary label={STAGE_TEXT.boundaryLabel} resetKey={asset?.tab?.id ?? null} action={reveal}>
      <StageSurface />
    </ErrorBoundary>
  );
};

export { StageBody };
