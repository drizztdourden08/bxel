/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useViewStore } from '../stores/useViewStore';
import type { ViewToggle } from '../stores/view-store.type';

const speakToggle = (label: string, toggle: ViewToggle): void => announce(`${label} ${useViewStore.getState()[toggle] ? 'on' : 'off'}`);

export { speakToggle };
