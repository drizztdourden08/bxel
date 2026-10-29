/* @layer renderer-app @kind logic */
import { commands } from '@drizztdourden08/brock-react';
import type { HeldKeys } from '../transform/transform.type';

const heldKeys = (event?: Pick<KeyboardEvent, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>): HeldKeys => {
  const held = commands.heldModifiers(event);
  return { shiftKey: held.includes('shift'), altKey: held.includes('alt'), ctrlKey: held.includes('ctrl') };
};

export { heldKeys };
