/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import type { PanelPartProps } from '../ProjectPanel.type';
import './ProjectFooter.css';

const ProjectFooter = ({ model }: PanelPartProps) => {
  const { counts, query, browser, source } = model;
  const { unsaved, missing } = counts.states;
  const total = Object.values(counts.kinds).reduce((sum, each) => sum + each, 0);
  const notes = unsaved + missing > 0 || browser.shown !== null || source.truncated;
  if (!notes) return null;
  return (
    <Flex align="center" gap="xs" className="project-footer">
      {unsaved > 0 ? (
        <Button variant="ghost" size="xs" onClick={() => query.toggleState('unsaved')}>
          {`${unsaved} unsaved`}
        </Button>
      ) : null}
      {missing > 0 ? (
        <Button variant="ghost" size="xs" onClick={() => query.toggleState('missing')}>
          {missing === 1 ? '1 missing link' : `${missing} missing links`}
        </Button>
      ) : null}
      {browser.shown === null ? null : (
        <Text variant="caption" tone="muted" className="project-footer__shown">{`${browser.shown} of ${total} shown`}</Text>
      )}
      {source.truncated ? (
        <Text variant="caption" tone="muted">
          The list is cut short.
        </Text>
      ) : null}
    </Flex>
  );
};

export { ProjectFooter };
