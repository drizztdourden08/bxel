/* @layer renderer-app @kind logic */
import type { DocumentState } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import type { Clock } from '@bxel/document/native';
import { previewPng } from './preview-png';

const artworkBytes = (state: DocumentState, clock: Clock): Uint8Array =>
  encodeArtwork(state, previewPng(state.artwork), clock);

export { artworkBytes };
