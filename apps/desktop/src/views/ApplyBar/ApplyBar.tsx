/* @layer renderer-app @kind component */
import { AnchoredBar, Button, Flex, Text } from '@drizztdourden08/tessera';
import { useCallback } from 'react';
import { cancelPending } from '../../editor/pending/cancel-pending';
import { commitPending } from '../../editor/pending/commit-pending';
import { APPLY_BAR_BOUNDARY, APPLY_BAR_FOCUS, APPLY_BAR_TEXT } from './ApplyBar.constants';
import { anchorRect } from './behavior/anchor-rect';
import { applyDetails } from './behavior/apply-details';
import { subscribeView } from './behavior/subscribe-view';
import { useApplyBar } from './behavior/useApplyBar';
import { useNudgeKeys } from './behavior/useNudgeKeys';
import './ApplyBar.css';

const ApplyBar = () => {
  const bar = useApplyBar();
  const anchor = bar?.anchor ?? null;
  const rect = useCallback(() => anchorRect(anchor), [anchor]);
  useNudgeKeys(bar !== null);
  if (bar === null) return null;
  return (
    <AnchoredBar
      inline
      dock="top-center"
      placement="auto"
      role="alertdialog"
      label={APPLY_BAR_TEXT.region}
      anchorRect={rect}
      boundary={APPLY_BAR_BOUNDARY}
      subscribe={subscribeView}
      dockedText={APPLY_BAR_TEXT.docked}
      initialFocus={APPLY_BAR_FOCUS}
      error={bar.error !== null}
      onEscape={cancelPending}
    >
      <Flex direction="column" gap="2xs" className="apply-bar">
        <Text variant="label">{bar.title}</Text>
        <Text variant="caption" tone="muted">{applyDetails(bar)}</Text>
        <Flex gap="xs" align="center" className="apply-bar__foot">
          {bar.nudges && <Text as="span" variant="caption" tone="muted">{APPLY_BAR_TEXT.nudge}</Text>}
          <Flex gap="xs" className="apply-bar__actions">
            <Button size="sm" variant="ghost" onClick={cancelPending}>{APPLY_BAR_TEXT.cancel}</Button>
            <Button data-apply size="sm" variant="primary" disabled={bar.error !== null} onClick={commitPending}>{APPLY_BAR_TEXT.apply}</Button>
          </Flex>
        </Flex>
      </Flex>
    </AnchoredBar>
  );
};

export { ApplyBar };
