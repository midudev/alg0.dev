import type { Algorithm } from '@lib/types'

export const CODE_PANEL_STATE_EVENT = 'alg0:code-panel-state'
export const CODE_PANEL_TAB_EVENT = 'alg0:code-panel-tab'

export type CodePanelTab = 'code' | 'about'

export interface CodePanelState {
  algorithm: Algorithm | null
  currentLine?: number
  variables?: Record<string, string | number | boolean | null>
  consoleOutput?: string[]
  /** Omitted for the initial SSR description; a string replaces it after SPA navigation. */
  aboutHtml?: string
}

export function publishCodePanelState(state: CodePanelState): void {
  window.dispatchEvent(new CustomEvent<CodePanelState>(CODE_PANEL_STATE_EVENT, { detail: state }))
}

export function setCodePanelTab(tab: CodePanelTab): void {
  window.dispatchEvent(new CustomEvent<CodePanelTab>(CODE_PANEL_TAB_EVENT, { detail: tab }))
}
