/* @layer core @kind constants */
const ID_ALPHABET = '0123456789abcdefghjkmnpqrstvwxyz';
const ID_BODY_LENGTH = 12;
const ID_PREFIX = { project: 'prj', folder: 'fld', swatchSet: 'sws' } as const;
const PROJECT_ID_REGEX = /^prj_[0-9a-hjkmnp-tv-z]{6,16}$/;
const FOLDER_ID_REGEX = /^fld_[0-9a-hjkmnp-tv-z]{6,16}$/;
const SWATCH_SET_ID_REGEX = /^sws_[0-9a-hjkmnp-tv-z]{6,16}$/;

export { FOLDER_ID_REGEX, ID_ALPHABET, ID_BODY_LENGTH, ID_PREFIX, PROJECT_ID_REGEX, SWATCH_SET_ID_REGEX };
