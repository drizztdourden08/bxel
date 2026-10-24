/* @layer renderer-app @kind component */
import { Box, Button, Flex, Tag, Text } from '@drizztdourden08/tessera';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { APPLY_BAR_TEXT } from './ApplyBar.constants';
import { useApplyBar } from './behavior/useApplyBar';
import './ApplyBar.css';

const ApplyBar = () => {
  const bar = useApplyBar();
  if (!bar) return null;
  const { scope } = bar;
  return (
    <>
      <Box className="apply-bar__scrim" aria-hidden />
      <Box surface="raised" role="region" aria-label={APPLY_BAR_TEXT.region} className="apply-bar">
        <Flex wrap gap="md" align="center">
          <Text as="span" variant="label">{bar.title}</Text>
          <Flex wrap gap="xs" align="center" role="status" aria-label={APPLY_BAR_TEXT.scope}>
            <Tag>{APPLY_BAR_TEXT.targets(scope.targets)}</Tag>
            <Tag>{APPLY_BAR_TEXT.layers(scope.layers)}</Tag>
            <Tag>{APPLY_BAR_TEXT.frames(scope.frames)}</Tag>
            <Tag>{APPLY_BAR_TEXT.clipping(bar.clipping)}</Tag>
          </Flex>
          {bar.error !== null && <Text as="span" variant="caption" className="apply-bar__error">{bar.error}</Text>}
          <Flex gap="sm" align="center" className="apply-bar__actions">
            <Button variant="tertiary" onClick={cancelPending}>{APPLY_BAR_TEXT.cancel}</Button>
            <Button variant="primary" disabled={bar.error !== null} onClick={commitPending}>{APPLY_BAR_TEXT.apply}</Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export { ApplyBar };
