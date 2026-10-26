/* @layer core @kind logic */
import { ASSET_FORMAT } from '../../model/asset-format.constants';
import { fileSafeStem } from '../file-safe-stem';

const folderOf = (path: string | undefined): string => {
  if (path === undefined) return 'sprites';
  const cut = path.lastIndexOf('/');
  return cut < 0 ? '' : path.slice(0, cut);
};

const planAnimationPath = (name: string, beside: string | undefined, taken: ReadonlySet<string>): string => {
  const folder = folderOf(beside);
  const stem = fileSafeStem(name, 'animation');
  const extension = ASSET_FORMAT.animation.extension;
  const join = (file: string): string => (folder === '' ? file : `${folder}/${file}`);
  let path = join(`${stem}${extension}`);
  for (let suffix = 2; taken.has(path.toLowerCase()); suffix += 1) path = join(`${stem} ${suffix}${extension}`);
  return path;
};

export { planAnimationPath };
