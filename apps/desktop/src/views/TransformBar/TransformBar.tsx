/* @layer renderer-app @kind component */
import { ALGORITHM_NOTES } from '@bxel/raster';
import { Button, Flex } from '@drizztdourden08/tessera';
import { flipInSession } from '../../editor/transform/flip-in-session';
import { reviseTransform } from '../../editor/transform/revise-transform';
import { IDENTITY } from '../../editor/transform/transform.constants';
import { turnInSession } from '../../editor/transform/turn-in-session';
import { FIELD_ROWS, TRANSFORM_BAR_TEXT } from './TransformBar.constants';
import { useFocusRequest } from './behavior/useFocusRequest';
import { useTransformBar } from './behavior/useTransformBar';
import { MethodField } from './sub-components/MethodField';
import { NumberField } from './sub-components/NumberField';
import { PivotField } from './sub-components/PivotField';
import './TransformBar.css';

const TransformBar = () => {
  const model = useTransformBar();
  useFocusRequest(model !== null);
  if (!model) return null;
  const hint = `${model.spec.corners ? TRANSFORM_BAR_TEXT.distorting : TRANSFORM_BAR_TEXT.keys} ${ALGORITHM_NOTES[model.spec.algorithm]}`;
  return (
    <Flex direction="column" gap="xs" role="group" aria-label={TRANSFORM_BAR_TEXT.region} title={hint} className="transform-bar">
      <Flex wrap gap="sm" align="center">
        {FIELD_ROWS.flat().map((field) => <NumberField key={field} field={field} model={model} />)}
      </Flex>
      <Flex wrap gap="sm" align="center">
        <PivotField model={model} />
        <MethodField model={model} />
        <Flex gap="xs" align="center">
          <Button size="xs" variant="tertiary" onClick={() => flipInSession('horizontal')}>{TRANSFORM_BAR_TEXT.flipHorizontal}</Button>
          <Button size="xs" variant="tertiary" onClick={() => flipInSession('vertical')}>{TRANSFORM_BAR_TEXT.flipVertical}</Button>
          <Button size="xs" variant="tertiary" onClick={() => turnInSession('clockwise')}>{TRANSFORM_BAR_TEXT.turn}</Button>
          <Button size="xs" variant="tertiary" onClick={() => reviseTransform((spec) => ({ ...IDENTITY, algorithm: spec.algorithm, bounds: spec.bounds }))}>{TRANSFORM_BAR_TEXT.reset}</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export { TransformBar };
