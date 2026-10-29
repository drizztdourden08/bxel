/* @layer core @kind logic */
import { cleanedgeSampler } from './cleanedge-sampler';
import { imageSampler } from './image-sampler';
import { magnify } from './magnify';
import { ROTSPRITE_PASSES } from './resample.constants';
import type { IndexImage, Sampler, SamplerRequest } from './resample.type';
import { scale2x } from './scale2x';
import { stepConfig } from './step-config';

const rotspriteImage = (image: IndexImage, request: SamplerRequest): IndexImage => {
  const config = stepConfig(request.options, false);
  let current = image;
  for (let pass = 0; pass < ROTSPRITE_PASSES; pass++) current = scale2x(current, config);
  return current;
};

const makeSampler = (request: SamplerRequest): Sampler => {
  const { image, algorithm } = request;
  if (algorithm === 'rotsprite') return imageSampler(rotspriteImage(image, request), 2 ** ROTSPRITE_PASSES);
  if (algorithm === 'cleanedge') return cleanedgeSampler(image);
  if (algorithm === 'nearest') return imageSampler(image, 1);
  const made = magnify(image, algorithm, request.scale, stepConfig(request.options, true));
  return imageSampler(made.image, made.factor);
};

export { makeSampler };
