/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { relinkFinding } from '../../../stage-state/relink-finding';
import { STAGE_TEXT } from '../../../stage-state/stage-state.constants';
import type { StageMissingProps } from '../EditorScreen.type';

const StageMissing = ({ links }: StageMissingProps) => (
  <Flex direction="column" align="center" justify="center" gap="md" className="stage-state stage-state--missing" role="alert">
    <Text variant="title">{STAGE_TEXT.missingTitle}</Text>
    {links.map((link) => (
      <Flex key={link.linkId} align="center" gap="md" className="stage-state__row">
        <Text>{STAGE_TEXT.missingBody(link.fileName, link.targetName)}</Text>
        <Button size="sm" onClick={() => void relinkFinding(link)}>
          {STAGE_TEXT.relink}
        </Button>
      </Flex>
    ))}
  </Flex>
);

export { StageMissing };
