/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { useReferenceImages } from '../../../hooks/useReferenceImages';
import { chooseReferenceImage } from '../../../reference-image/choose-reference-image';
import { REFERENCE_TEXT } from '../../../reference-image/reference-image.constants';
import { ReferenceRow } from './ReferenceRow';

const ReferenceSection = () => {
  const images = useReferenceImages();
  return (
    <Flex direction="column" gap="xs">
      {images.length === 0 && <Text variant="caption" tone="muted">{REFERENCE_TEXT.none}</Text>}
      {images.map((image) => (
        <ReferenceRow key={image.id} image={image} />
      ))}
      <Flex gap="xs">
        <Button size="sm" variant="secondary" onClick={() => void chooseReferenceImage()}>{REFERENCE_TEXT.add}</Button>
      </Flex>
      <Text variant="caption" tone="muted">{REFERENCE_TEXT.hint}</Text>
    </Flex>
  );
};

export { ReferenceSection };
