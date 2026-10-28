/* @layer renderer-app @kind component */
import { Box, Text, TextInput } from '@drizztdourden08/tessera';
import type { FocusEvent, KeyboardEvent } from 'react';
import { editorDefaults } from '../behavior/editor-defaults';
import type { RowEditorProps } from '../ProjectTree.type';
import './RowEditor.css';

const RowEditor = (props: RowEditorProps) => {
  const { model, creating } = props;
  const { edit } = model;
  const { initial, suffix, label } = editorDefaults(props);

  const finish = (event: FocusEvent<HTMLInputElement>): void => {
    const typed = event.currentTarget.value.trim();
    if (typed === '' || (!creating && typed === initial)) edit.stop();
    else void edit.commit(typed);
  };
  const cancel = (event: KeyboardEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    if (event.key === 'Escape') edit.stop();
  };

  return (
    <Box className="project-editor">
      <TextInput
        size="sm"
        aria-label={label}
        defaultValue={initial}
        invalid={edit.error !== null}
        autoFocus
        onFocus={(event) => event.currentTarget.select()}
        onBlur={finish}
        onKeyDown={cancel}
        onEnter={(value) => void edit.commit(value)}
      />
      {suffix === '' ? null : (
        <Text variant="caption" tone="faint" className="project-editor__suffix">
          {suffix}
        </Text>
      )}
      {edit.error === null ? null : (
        <Text variant="caption" className="project-editor__error" role="alert">
          {edit.error}
        </Text>
      )}
    </Box>
  );
};

export { RowEditor };
