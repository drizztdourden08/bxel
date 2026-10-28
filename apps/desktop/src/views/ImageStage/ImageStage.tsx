/* @layer renderer-app @kind component */
import { Button, EmptyState, Flex, Icon, Spacer, Tag, Text } from '@drizztdourden08/tessera';
import { useImageTabStore } from '../../stores/useImageTabStore';
import { ImagePreview } from '../ImagePreview';
import { useSharedView } from '../ImagePreview/behavior/useSharedView';
import { importImageTab } from './behavior/import-image-tab';
import { IMAGE_STAGE_TEXT } from './ImageStage.constants';
import './ImageStage.css';

const ImageStage = () => {
  const tab = useImageTabStore((state) => state.tabs.find((each) => each.id === state.activeId));
  const view = useSharedView();
  if (!tab) return <EmptyState message={IMAGE_STAGE_TEXT.missing} />;
  const { image, name, frames } = tab;
  return (
    <Flex direction="column" className="image-stage" role="region" aria-label={IMAGE_STAGE_TEXT.region}>
      <Flex align="center" gap="sm" className="image-stage__header">
        <Icon name="image" />
        <Text variant="label">{name}</Text>
        <Tag>{IMAGE_STAGE_TEXT.size(image.width, image.height)}</Tag>
        {frames > 1 && <Tag>{IMAGE_STAGE_TEXT.frames(frames)}</Tag>}
        <Tag title={IMAGE_STAGE_TEXT.readOnlyHint}>{IMAGE_STAGE_TEXT.readOnly}</Tag>
        <Spacer />
        <Button variant="primary" size="sm" title={IMAGE_STAGE_TEXT.importHint} onClick={() => importImageTab(tab)}>
          {IMAGE_STAGE_TEXT.import}
        </Button>
      </Flex>
      <ImagePreview fill image={image} label={IMAGE_STAGE_TEXT.label(name)} view={view} />
    </Flex>
  );
};

export { ImageStage };
