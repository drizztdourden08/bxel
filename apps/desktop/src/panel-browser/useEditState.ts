/* @layer renderer-app @kind hook */
import { useState } from 'react';
import type { EditState, EditTarget } from './browser-state.type';

const useEditState = (): EditState => {
  const [editing, setEditing] = useState<EditTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  return { editing, error, setEditing, setError };
};

export { useEditState };
