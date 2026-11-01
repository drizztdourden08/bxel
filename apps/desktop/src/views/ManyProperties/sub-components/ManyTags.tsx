/* @layer renderer-app @kind component */
import { Box, Stack, Tag, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { MANY_TEXT } from '../ManyProperties.constants';
import type { ManyModel } from '../ManyProperties.type';

const ManyTags = ({ model }: { readonly model: ManyModel }) => {
  const [typed, setTyped] = useState('');
  const commit = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' || typed.trim() === '') return;
    event.preventDefault();
    model.addTag(typed);
    setTyped('');
  };
  if (model.taggable.length === 0) return <Text tone="muted">{MANY_TEXT.noTaggable}</Text>;
  return (
    <Stack gap="xs">
      <Text as="h3" variant="overline" tone="muted">
        {MANY_TEXT.tags}
      </Text>
      {model.tags.shared.length + model.tags.partial.length === 0 && <Text tone="muted">{MANY_TEXT.noTags}</Text>}
      {model.tags.shared.length > 0 && (
        <Box role="group" aria-label={MANY_TEXT.sharedTags}>
          <Text as="span" variant="caption" tone="muted">
            {MANY_TEXT.sharedTags}
          </Text>
          {model.tags.shared.map((tag) => (
            <Tag key={tag} name={tag} {...(model.editable ? { onRemove: () => model.removeTag(tag) } : {})}>
              {tag}
            </Tag>
          ))}
        </Box>
      )}
      {model.tags.partial.length > 0 && (
        <Box role="group" aria-label={MANY_TEXT.partialTags}>
          <Text as="span" variant="caption" tone="muted">
            {MANY_TEXT.partialTags}
          </Text>
          {model.tags.partial.map((tag) => (
            <Tag key={tag} name={tag} {...(model.editable ? { onRemove: () => model.removeTag(tag) } : {})}>
              {tag}
            </Tag>
          ))}
        </Box>
      )}
      {model.editable && <TextInput value={typed} placeholder={MANY_TEXT.addTag} aria-label={MANY_TEXT.addTagLabel} onChange={(event) => setTyped(event.target.value)} onKeyDown={commit} />}
    </Stack>
  );
};

export { ManyTags };
