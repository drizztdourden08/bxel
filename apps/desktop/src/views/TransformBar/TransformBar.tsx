/* @layer renderer-app @kind component */
import { ALGORITHM_NOTES } from '@bxel/raster';
import { Button, Flex, Text, Toolbar } from '@drizztdourden08/tessera';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { usePendingStore } from '../../stores/usePendingStore';
import { FIELD_ROWS, TRANSFORM_BAR_TEXT } from './TransformBar.constants';
import { transformItems } from './behavior/transform-items';
import { useFocusRequest } from './behavior/useFocusRequest';
import { useTransformBar } from './behavior/useTransformBar';
import { NumberField } from './sub-components/NumberField';
import { PivotField } from './sub-components/PivotField';
import './TransformBar.css';

const TransformBar = () => {
  const model = useTransformBar();
  const outcome = usePendingStore((state) => state.outcome);
  useFocusRequest(model !== null);
  if (!model) return null;
  const hint = `${model.spec.corners ? TRANSFORM_BAR_TEXT.distorting : TRANSFORM_BAR_TEXT.keys} ${ALGORITHM_NOTES[model.spec.algorithm]}`;
  const note = outcome?.error ?? (outcome && outcome.clipping !== 'none' ? outcome.clipping : null);
  return (
    <Flex wrap gap="sm" align="center" role="group" aria-label={TRANSFORM_BAR_TEXT.region} title={hint} className="transform-bar">
      {FIELD_ROWS.flat().map((field) => <NumberField key={field} field={field} model={model} />)}
      <PivotField model={model} />
      <Toolbar label={TRANSFORM_BAR_TEXT.tools} items={transformItems(model.spec)} />
      {note !== null && <Text as="span" variant="caption" className="transform-bar__note">{note}</Text>}
      <Flex gap="xs" align="center" className="transform-bar__end">
        <Button size="xs" variant="tertiary" onClick={cancelPending}>{TRANSFORM_BAR_TEXT.cancel}</Button>
        <Button size="xs" variant="primary" disabled={outcome?.error != null} onClick={commitPending}>{TRANSFORM_BAR_TEXT.apply}</Button>
      </Flex>
    </Flex>
  );
};

export { TransformBar };
