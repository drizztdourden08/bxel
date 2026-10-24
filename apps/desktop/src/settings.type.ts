/* @layer renderer-app @kind types */
import type { BaseSettings } from '@drizztdourden08/brock-core';
import type { CreationMemory } from './new-sprite/new-sprite.type';

interface AppSettings extends BaseSettings {
  newSprite: CreationMemory;
}

export type { AppSettings };
