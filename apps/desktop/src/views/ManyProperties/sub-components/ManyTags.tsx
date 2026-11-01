/* @layer renderer-app @kind component */
import { Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { MANY_TEXT } from '../ManyProperties.constants';
import type { ManyModel } from '../ManyProperties.type';
import { ManyTagGroup } from './ManyTagGroup';

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
      <ManyTagGroup model={model} label={MANY_TEXT.sharedTags} tags={model.tags.shared} />
      <ManyTagGroup model={model} label={MANY_TEXT.partialTags} tags={model.tags.partial} />
      {model.editable && <TextInput value={typed} placeholder={MANY_TEXT.addTag} aria-label={MANY_TEXT.addTagLabel} onChange={(event) => setTyped(event.target.value)} onKeyDown={commit} />}
    </Stack>
  );
};

export { ManyTags };
