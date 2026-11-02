/* @layer core @kind test */
import type { Artwork, DocumentState } from '@bxel/document';
import { decodeArtwork } from '@bxel/document/native';
import { artworkOf, encodeHeart, heartState } from './native-fixture';

const reopenHeart = (state: DocumentState = heartState()): Artwork => artworkOf(decodeArtwork(encodeHeart(state)));

export { reopenHeart };
