/* @layer renderer-app @kind component */
import { Box, Button, Stack, Text } from '@drizztdourden08/tessera';
import { importImageAs } from '../../../asset-list/import-image-as';
import { formatSize } from '../../../project/format-size';
import { SUBJECT_TEXT } from '../../../properties-subject/properties-subject.constants';
import { useFileSummary } from '../behavior/useFileSummary';
import type { FileSummaryProps } from '../SubjectCard.type';
import { MissingNotice } from './MissingNotice';

const FileSummary = ({ path }: FileSummaryProps) => {
  const { loaded, data } = useFileSummary(path);
  if (!loaded) return null;
  if (data === null) return <MissingNotice />;
  return (
    <Box className="subject-card" role="region" aria-label={SUBJECT_TEXT.summaryTitle}>
      <Stack gap="sm">
        <Text variant="label">{data.name}</Text>
        <Text>{`${SUBJECT_TEXT.summarySize}: ${formatSize(data.size)}`}</Text>
        <Text>{`${SUBJECT_TEXT.summaryModified}: ${new Date(data.modified).toLocaleString()}`}</Text>
        {data.width !== null && data.height !== null && <Text>{`${SUBJECT_TEXT.summaryPixels}: ${SUBJECT_TEXT.pixels(data.width, data.height)}`}</Text>}
        {data.frames !== null && <Text>{`${SUBJECT_TEXT.summaryFrames}: ${data.frames}`}</Text>}
        {!data.isImage && <Text>{SUBJECT_TEXT.summaryNative}</Text>}
        {data.isImage && (
          <Stack gap="sm">
            <Button size="sm" variant="primary" onClick={() => void importImageAs(path, 'sprite')}>
              {SUBJECT_TEXT.importSprite}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => void importImageAs(path, 'tileset')}>
              {SUBJECT_TEXT.importTileset}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export { FileSummary };
