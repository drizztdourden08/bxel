/* @layer renderer-app @kind component */
import { TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { BROWSER_TEXT } from '../../../project-browser/project-browser.constants';
import { useBrowserContext } from '../behavior/useBrowserContext';

const NewCollection = () => {
  const { actions } = useBrowserContext();
  const [name, setName] = useState('');
  const commit = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' || name.trim() === '') return;
    event.preventDefault();
    actions.newCollection(name);
    setName('');
  };
  return (
    <TextInput
      value={name}
      placeholder={BROWSER_TEXT.newCollectionHint}
      aria-label={BROWSER_TEXT.newCollectionLabel}
      onChange={(event) => setName(event.target.value)}
      onKeyDown={commit}
    />
  );
};

export { NewCollection };
