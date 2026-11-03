/**
 * Build-time SVG sprite with the code-language logos (server only).
 *
 * The logos used to be inlined in every page (~3.4 KB compressed). As an external
 * sprite they download once and stay cached: the URL carries a content hash, so
 * `/icons/*` can be served as immutable.
 */
import { createHash } from 'node:crypto'
import { codeLanguages } from '@lib/code-languages'

export const codeLanguageSprite = `<svg xmlns="http://www.w3.org/2000/svg">${codeLanguages
  .map(
    (language) =>
      `<symbol id="${language.id}" viewBox="${language.iconViewBox ?? '0 0 24 24'}"><path d="${language.iconPath}"/></symbol>`,
  )
  .join('')}</svg>`

const version = createHash('sha256').update(codeLanguageSprite).digest('hex').slice(0, 10)

/** `<use href>` base for a language logo: append `#<language id>`. */
export const codeLanguageSpriteUrl = `/icons/code-languages.svg?v=${version}`
