/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { BankId, SwatchId } from '../../model/ids.type';
import type { PaletteBank, Rgb, Swatch } from '../../model/palette.type';
import { BACKGROUND_LABEL } from '../../model/transparent.constants';
import type { ProjectCreateOptions } from '../../schema/command-options.type';

const buildBank = (ids: IdSource, bank: ProjectCreateOptions['bank']): PaletteBank => {
  const id = ids.next('bnk') as BankId;
  const slots: Swatch[] = [];
  if (bank.transparent) slots.push({ id: ids.next('sw') as SwatchId, kind: 'transparent' });
  for (const [index, color] of bank.colors.entries()) {
    const rgb = color.rgb.toLowerCase() as Rgb;
    const fallback = !bank.transparent && index === 0 ? BACKGROUND_LABEL : rgb;
    slots.push({ id: ids.next('sw') as SwatchId, kind: 'color', rgb, name: color.name?.trim() ?? fallback });
  }
  return { id, name: bank.name.trim(), cap: bank.cap, transparent: bank.transparent, slots, ramps: [] };
};

export { buildBank };
