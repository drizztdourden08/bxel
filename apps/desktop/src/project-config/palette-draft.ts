/* @layer renderer-app @kind logic */
import type { AssetDefaults } from '@bxel/project';
import { bankPlan } from '../palette-source/bank-plan';
import { sourceColorText } from '../palette-source/source-color-text';
import type { PaletteSource } from '../palette-source/palette-source.type';
import type { PaletteSeed } from './project-config.type';

const paletteDraft = (source: PaletteSource, defaults: AssetDefaults): PaletteSeed => {
  const { bank } = bankPlan(source, defaults.colorLimit, defaults.transparent);
  return { name: bank.name, cap: bank.cap, transparent: bank.transparent, colors: bank.colors.map(sourceColorText) };
};

export { paletteDraft };
