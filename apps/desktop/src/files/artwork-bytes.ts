/* @layer renderer-app @kind logic */
import type { DocumentState } from '@bxel/document';
import { encodeArtwork } from '@bxel/document/native';
import type { Clock } from '@bxel/document/native';
import { currentPick } from '../editor/current-pick';
import type { CurrentPick } from '../editor/current-pick.type';
import { previewPng } from './preview-png';

const artworkBytes = (state: DocumentState, clock: Clock, current: CurrentPick = currentPick()): Uint8Array =>
  encodeArtwork(state, previewPng(state.artwork, current), clock);

export { artworkBytes };
