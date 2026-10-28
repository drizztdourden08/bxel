/* @layer renderer-app @kind component */
import { Box, Text, TextInput } from '@drizztdourden08/tessera';
import { useBrowserContext } from '../behavior/useBrowserContext';
import type { EntryProps } from '../ProjectBrowser.type';

const stemOf = (name: string, isFolder: boolean): string => (isFolder || !name.includes('.') ? name : name.slice(0, name.lastIndexOf('.')));

const EntryName = ({ entry, rename }: EntryProps & { readonly rename: boolean }) => {
  const { actions, renameError } = useBrowserContext();
  const name = entry.kind === 'folder' ? entry.name : entry.row.name;
  if (!rename) {
    return (
      <Text as="span" variant="caption" className="browser-name" title={name}>
        {name}
      </Text>
    );
  }
  return (
    <Box className="browser-name browser-name--editing" onClick={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
      <TextInput
        size="sm"
        aria-label={`Rename ${name}`}
        defaultValue={stemOf(name, entry.kind === 'folder')}
        invalid={renameError !== null}
        autoFocus
        onFocus={(event) => event.currentTarget.select()}
        onEnter={(value) => actions.commitRename(entry, value)}
        onBlur={(event) => actions.commitRename(entry, event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            actions.cancelRename();
          }
        }}
      />
      {renameError !== null && (
        <Text as="span" variant="caption" tone="danger" role="alert">
          {renameError}
        </Text>
      )}
    </Box>
  );
};

export { EntryName };
