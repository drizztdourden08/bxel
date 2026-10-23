/* @layer renderer-app @kind logic */
import type { DocumentState } from '@bxel/document';
import { encodeProject } from '@bxel/document/native';
import type { Clock } from '@bxel/document/native';
import { previewPng } from './preview-png';

const projectBytes = (state: DocumentState, clock: Clock): Uint8Array =>
  encodeProject(state, previewPng(state.project), clock);

export { projectBytes };
