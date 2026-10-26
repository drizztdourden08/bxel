/* @layer renderer-app @kind component */
import { focusRegion } from '@drizztdourden08/brock-react';
import { Button, EmptyState, Flex, Icon } from '@drizztdourden08/tessera';
import { ASSET_ICON } from '../AssetTabs/AssetTabs.constants';
import { useFileTypePicker } from './behavior/useFileTypePicker';
import { FILE_TYPE_CHOICES, FILE_TYPE_TEXT } from './FileTypePicker.constants';
import './FileTypePicker.css';

const FileTypePicker = () => {
  const { choose } = useFileTypePicker();
  return (
    <Flex className="file-type-picker" {...focusRegion(FILE_TYPE_TEXT.label, FILE_TYPE_TEXT.label)}>
      <EmptyState
        size="md"
        title={FILE_TYPE_TEXT.title}
        message={FILE_TYPE_TEXT.message}
        action={
          <Flex gap="sm" wrap className="file-type-picker__choices">
            {FILE_TYPE_CHOICES.map((choice) => (
              <Button key={choice.kind} variant="secondary" icon={<Icon name={ASSET_ICON[choice.kind]} />} onClick={() => choose(choice.kind)}>
                {choice.label}
              </Button>
            ))}
          </Flex>
        }
      />
    </Flex>
  );
};

export { FileTypePicker };
