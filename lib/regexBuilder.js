import verbs from './verbs';

export const r = str => new RegExp(`^${str}$`, 'i');

export const or = (arr, { capture, required } = {}) =>`(${
    capture ? '' : '?:'}${
    arr.join('|')})${
    required ? '' : '?'}`;

export const string = '"([^"]+)"';
export const int = '(\\d+)';

export const elInEl = `\\s?${or(verbs)}\\s?${string}(?:\\s?${or(verbs)} ${string})?(?: containing ${string})?`;
export const page = `(?: the)? ${string}(?:\\s(?:page|screen|Page|Screen))?`