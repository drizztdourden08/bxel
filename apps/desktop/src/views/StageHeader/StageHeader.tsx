/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera';
import { HEADER_TEXT } from '../../stage-header/stage-header.constants';
import { useStageHeader } from './behavior/useStageHeader';
import { BreadcrumbTrail } from './sub-components/BreadcrumbTrail';
import { ChipItem } from './sub-components/ChipItem';
import './StageHeader.css';

const StageHeader = () => {
  const model = useStageHeader();
  if (!model) return null;
  return (
    <Flex wrap gap="sm" align="center" className="stage-header">
      <BreadcrumbTrail crumbs={model.crumbs} />
      {model.chips.length > 0 && (
        <Flex wrap gap="xs" align="center" role="group" aria-label={HEADER_TEXT.chips} className="stage-header__chips">
          {model.chips.map((chip) => <ChipItem key={chip.id} chip={chip} />)}
        </Flex>
      )}
      {model.actions.length > 0 && (
        <Flex gap="xs" align="center" className="stage-header__actions">
          {model.actions.map((action) => (
            <Button
              key={action.label}
              size="xs"
              variant="secondary"
              title={action.title}
              aria-pressed={action.pressed}
              disabled={action.disabled}
              onClick={action.run}
            >
              {action.label}
            </Button>
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export { StageHeader };
