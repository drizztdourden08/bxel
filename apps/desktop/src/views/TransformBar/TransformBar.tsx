/* @layer renderer-app @kind component */
import { ALGORITHM_NOTES } from '@bxel/raster';
import { Button, Flex, Text, Toolbar } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { usePendingStore } from '../../stores/usePendingStore';
import { MAIN_FIELDS, MORE_FIELDS, TRANSFORM_BAR_TEXT } from './TransformBar.constants';
import { barNote } from './behavior/bar-note';
import { actionItems } from './behavior/transform-items';
import { useFocusRequest } from './behavior/useFocusRequest';
import { useTransformBar } from './behavior/useTransformBar';
import { ChoiceFields } from './sub-components/ChoiceFields';
import { NumberField } from './sub-components/NumberField';
import { PivotField } from './sub-components/PivotField';
import { SnapField } from './sub-components/SnapField';
import './TransformBar.css';

const TransformBar = () => {
  const model = useTransformBar();
  const outcome = usePendingStore((state) => state.outcome);
  const [more, setMore] = useState(false);
  useFocusRequest(model !== null);
  if (!model) return null;
  const hint = `${model.spec.corners ? TRANSFORM_BAR_TEXT.distorting : TRANSFORM_BAR_TEXT.keys} ${ALGORITHM_NOTES[model.spec.algorithm]}`;
  const note = barNote(outcome);
  return (
    <Flex wrap gap="sm" align="center" role="group" aria-label={TRANSFORM_BAR_TEXT.region} title={hint} className="transform-bar">
      {MAIN_FIELDS.map((field) => <NumberField key={field} field={field} model={model} />)}
      <ChoiceFields model={model} />
      <Toolbar label={TRANSFORM_BAR_TEXT.tools} items={actionItems()} />
      <Button size="xs" variant="tertiary" aria-expanded={more} title={TRANSFORM_BAR_TEXT.moreHint} onClick={() => setMore(!more)}>{TRANSFORM_BAR_TEXT.more}</Button>
      {more && MORE_FIELDS.map((field) => <NumberField key={field} field={field} model={model} />)}
      {more && <SnapField />}
      {more && <PivotField model={model} />}
      {note !== null && <Text as="span" variant="caption" className="transform-bar__note">{note}</Text>}
      <Flex gap="xs" align="center" className="transform-bar__end">
        <Button size="xs" variant="tertiary" onClick={cancelPending}>{TRANSFORM_BAR_TEXT.cancel}</Button>
        <Button size="xs" variant="primary" disabled={outcome?.error != null} onClick={commitPending}>{TRANSFORM_BAR_TEXT.apply}</Button>
      </Flex>
    </Flex>
  );
};

export { TransformBar };
