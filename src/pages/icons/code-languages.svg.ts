import type { APIRoute } from 'astro'
import { codeLanguageSprite } from '@lib/code-language-sprite'

export const GET: APIRoute = () =>
  new Response(codeLanguageSprite, { headers: { 'Content-Type': 'image/svg+xml' } })
