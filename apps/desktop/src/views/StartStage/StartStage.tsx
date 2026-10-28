/* @layer renderer-app @kind component */
import { commands, focusRegion } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Flex, Icon } from '@drizztdourden08/tessera';
import { START_ACTIONS, START_TEXT } from './StartStage.constants';
import './StartStage.css';

const StartStage = () => (
  <Flex className="start-stage" {...focusRegion(START_TEXT.region, START_TEXT.region)}>
    <EmptyState
      size="md"
      icon={<Icon name="pixel-sprite" />}
      title={START_TEXT.title}
      message={START_TEXT.message}
      action={
        <Flex gap="sm" wrap className="start-stage__actions">
          {START_ACTIONS.map((action) => (
            <Button key={action.id} variant={action.variant} icon={<Icon name={action.icon} />} onClick={() => commands.run(action.command)}>
              {action.label}
            </Button>
          ))}
        </Flex>
      }
    />
  </Flex>
);

export { StartStage };
