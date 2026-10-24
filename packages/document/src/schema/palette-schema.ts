/* @layer core @kind logic */
import { z } from 'zod';
import { ID_PREFIX } from '../ids/id-prefix.constants';
import type { BankId, RampId, SwatchId } from '../model/ids.type';
import { MAX_BANK_CAP, MIN_BANK_CAP } from '../model/limits.constants';
import { brandedIdSchema } from './branded-id-schema';
import { createdSchema } from './created-schema';
import { nameSchema } from './name-schema';
import { swatchSchema } from './swatch-schema';

const rampSchema = z.object({
  id: brandedIdSchema<RampId>(ID_PREFIX.ramp),
  name: nameSchema,
  swatches: z.array(brandedIdSchema<SwatchId>(ID_PREFIX.swatch)),
});

const paletteBankSchema = z
  .object({
    id: brandedIdSchema<BankId>(ID_PREFIX.bank),
    name: nameSchema,
    created: createdSchema.optional(),
    cap: z.number().int().min(MIN_BANK_CAP).max(MAX_BANK_CAP),
    transparent: z.boolean(),
    slots: z.array(swatchSchema).min(1),
    ramps: z.array(rampSchema),
  })
  .refine((bank) => bank.slots.length <= bank.cap, { path: ['slots'], message: 'A bank holds at most cap slots.' });

export { paletteBankSchema };
