/* @layer renderer-app @kind component */
import { Callout, Image as PreviewImage, Paragraph, Stack, Text } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { PreviewPanelProps } from '../ExportDialog.type';

const PreviewPanel = ({ plan, source, blocker }: PreviewPanelProps) => (
  <Stack gap="sm" className="export-dialog__preview">
    <Text variant="label">{EXPORT_DIALOG_TEXT.preview}</Text>
    {source === null ? (
      <Paragraph tone="dim">{EXPORT_DIALOG_TEXT.noPreview}</Paragraph>
    ) : (
      <PreviewImage className="export-dialog__image" src={source} alt={EXPORT_DIALOG_TEXT.preview} pixelated fit="contain" />
    )}
    {plan.files.map((file) => (
      <Text key={file.name} variant="caption" tone="dim">
        {file.detail}
      </Text>
    ))}
    {plan.notes.map((note) => (
      <Paragraph key={note} tone="dim">
        {note}
      </Paragraph>
    ))}
    {blocker !== null && (
      <Callout variant="footnote" tone="danger">
        {blocker}
      </Callout>
    )}
  </Stack>
);

export { PreviewPanel };
