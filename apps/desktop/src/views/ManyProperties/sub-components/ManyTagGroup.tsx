/* @layer renderer-app @kind component */
import { Box, Tag, Text } from '@drizztdourden08/tessera';
import type { ManyModel } from '../ManyProperties.type';

const ManyTagGroup = ({ model, label, tags }: { readonly model: ManyModel; readonly label: string; readonly tags: readonly string[] }) => {
  if (tags.length === 0) return null;
  return (
    <Box role="group" aria-label={label}>
      <Text as="span" variant="caption" tone="muted">
        {label}
      </Text>
      {tags.map((tag) => (
        <Tag key={tag} name={tag} {...(model.editable ? { onRemove: () => model.removeTag(tag) } : {})}>
          {tag}
        </Tag>
      ))}
    </Box>
  );
};

export { ManyTagGroup };
