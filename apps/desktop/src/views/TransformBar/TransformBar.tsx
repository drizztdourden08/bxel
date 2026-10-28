/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { flipInSession } from '../../editor/transform/flip-in-session';
import { turnInSession } from '../../editor/transform/turn-in-session';
import { reviseTransform } from '../../editor/transform/revise-transform';
import { IDENTITY } from '../../editor/transform/transform.constants';
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
  return (
    <Flex direction="column" gap="xs" role="group" aria-label={TRANSFORM_BAR_TEXT.region} className="transform-bar">
      <Flex wrap gap="md" align="center">
        <Text as="span" variant="label">{TRANSFORM_BAR_TEXT.title}</Text>
        {FIELD_ROWS.map((row) => (
          <Flex key={row.join('-')} gap="sm" align="center" className="transform-bar__group">
            {row.map((field) => <NumberField key={field} field={field} model={model} />)}
          </Flex>
        ))}
        <PivotField model={model} />
        <Flex gap="xs" align="center">
          <Button variant="tertiary" onClick={() => flipInSession('horizontal')}>{TRANSFORM_BAR_TEXT.flipHorizontal}</Button>
          <Button variant="tertiary" onClick={() => flipInSession('vertical')}>{TRANSFORM_BAR_TEXT.flipVertical}</Button>
          <Button variant="tertiary" onClick={() => turnInSession('clockwise')}>{TRANSFORM_BAR_TEXT.turn}</Button>
          <Button variant="tertiary" onClick={() => reviseTransform((spec) => ({ ...IDENTITY, algorithm: spec.algorithm, bounds: spec.bounds }))}>{TRANSFORM_BAR_TEXT.reset}</Button>
        </Flex>
      </Flex>
      <Flex wrap gap="md" align="center">
        <MethodField model={model} />
      </Flex>
      <Text as="span" variant="caption">{model.spec.corners ? TRANSFORM_BAR_TEXT.distorting : `${TRANSFORM_BAR_TEXT.keys} ${TRANSFORM_BAR_TEXT.exactNote}`}</Text>
    </Flex>
  );
};

export { TransformBar };
