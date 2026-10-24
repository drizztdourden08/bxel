/* @layer core @kind constants */
import { LOAD_ERROR } from '@bxel/document/native';
import type { LoadIssue } from '@bxel/document/native';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectErrorCode } from '../errors/project-result.type';

const ASSETS_DIR = 'assets/';

const PROJECT_KIND = 'project';

const FAILURE_CODE_OF: Readonly<Partial<Record<LoadIssue['code'], ProjectErrorCode>>> = {
  [LOAD_ERROR.WRONG_KIND]: PROJECT_ERROR_CODE.PROJECT_FILE_WRONG_KIND,
  [LOAD_ERROR.VERSION_TOO_NEW]: PROJECT_ERROR_CODE.PROJECT_FILE_TOO_NEW,
  [LOAD_ERROR.FILE_TOO_LARGE]: PROJECT_ERROR_CODE.PROJECT_FILE_TOO_LARGE,
};

export { ASSETS_DIR, FAILURE_CODE_OF, PROJECT_KIND };
