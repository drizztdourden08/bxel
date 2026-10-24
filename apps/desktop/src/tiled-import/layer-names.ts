/* @layer renderer-app @kind logic */
import { CONTROL_CHARACTERS, MAX_NAME_LENGTH } from '@bxel/document';
import { freeName } from '../sheet/free-name';
import { LAYER_FALLBACK } from './tiled-import.constants';

const cleaned = (name: string): string => {
  const plain = name.replaceAll(new RegExp(CONTROL_CHARACTERS.source, 'gu'), ' ').trim().slice(0, MAX_NAME_LENGTH).trim();
  return plain === '' ? LAYER_FALLBACK : plain;
};

const layerNames = (names: readonly string[]): string[] => {
  const taken: string[] = [];
  for (const name of names) taken.push(freeName(cleaned(name), taken));
  return taken;
};

export { layerNames };
