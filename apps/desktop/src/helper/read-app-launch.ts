/* @layer helper @kind logic */
import { fieldOf } from '../assistant-bridge/field-of';
import { LAUNCH } from '../assistant-bridge/launch.constants';
import type { AppLaunch } from './helper.type';

const parsedOf = (raw: string): unknown => {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
};

const readAppLaunch = (env: NodeJS.ProcessEnv = process.env): AppLaunch | null => {
  const parsed = parsedOf(env[LAUNCH.appEnv] ?? '');
  const command = fieldOf(parsed, 'command');
  const args = fieldOf(parsed, 'args');
  if (typeof command !== 'string' || !Array.isArray(args)) return null;
  const strings = args.filter((arg): arg is string => typeof arg === 'string');
  return strings.length === args.length ? { command, args: strings } : null;
};

export { readAppLaunch };
