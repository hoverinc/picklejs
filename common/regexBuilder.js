const verbs = require('./verbs');

const r = str => new RegExp(`^${str}$`, 'i');

const or = (arr, { capture, required } = {}) =>`(${
    capture ? '' : '?:'}${
    arr.join('|')})${
    required ? '' : '?'}`;

const string = '"([^"]+)"';
const int = '(\\d+)';

const elInEl = `\\s?${or(verbs)}\\s?${string}(?:\\s?${or(verbs)} ${string})?(?: containing ${string})?`;
const page = `(?: the)? ${string}(?:\\s(?:page|screen|Page|Screen))?`

module.exports = {
    r,
    or,
    string,
    int,
    elInEl,
    page,
};