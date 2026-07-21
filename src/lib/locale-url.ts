import type { Locale } from '@i18n/translations'
import { defaultLocale } from '@i18n/translations'

export function getHomeUrl(locale: Locale): string {
  return locale === defaultLocale ? '/' : `/${locale}/`
}

export function getLocaleUrl(targetLocale: Locale, algorithmId?: string): string {
  if (targetLocale === defaultLocale) {
    return algorithmId ? `/${algorithmId}` : '/'
  }
  return algorithmId ? `/${targetLocale}/${algorithmId}` : `/${targetLocale}/`
}
