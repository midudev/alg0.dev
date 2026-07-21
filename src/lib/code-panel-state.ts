import type { Algorithm } from '@lib/types'

export const CODE_PANEL_STATE_EVENT = 'alg0:code-panel-state'

export interface CodePanelState {
  algorithm: Algorithm | null
  currentLine?: number
  variables?: Record<string, string | number | boolean | null>
  consoleOutput?: string[]
}

export function publishCodePanelState(state: CodePanelState): void {
  window.dispatchEvent(new CustomEvent<CodePanelState>(CODE_PANEL_STATE_EVENT, { detail: state }))
}
