/* @layer renderer-app @kind component */
import { Icon, Image } from '@drizztdourden08/tessera';
import { KIND_ICON } from '../../../../../asset-list/asset-list.constants';
import type { AssetRow } from '../../../../../asset-list/asset-list.type';

const AssetThumb = ({ row }: { readonly row: AssetRow }) =>
  row.preview === null ? <Icon name={KIND_ICON[row.kind]} /> : <Image src={row.preview} alt="" fit="contain" pixelated />;

export { AssetThumb };
