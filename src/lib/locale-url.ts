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

/** Absolute-path URL for an algorithm page (trailing slash omitted; site adds it). */
export function getAlgorithmPath(locale: Locale, algorithmId: string): string {
  return locale === defaultLocale ? `/${algorithmId}/` : `/${locale}/${algorithmId}/`
}

/** Absolute-path URL for a category hub. */
export function getCategoryPath(locale: Locale, categorySlug: string): string {
  return locale === defaultLocale ? `/${categorySlug}/` : `/${locale}/${categorySlug}/`
}

export function getOgImagePath(algorithmId?: string): string {
  if (algorithmId) return `/og/${algorithmId}.jpg`
  return '/og/default.jpg'
}

export function getCategoryOgImagePath(categorySlug: string): string {
  return `/og/category-${categorySlug}.jpg`
}
