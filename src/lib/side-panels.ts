/**
 * Sidebar and code panel share the row with the algorithm stage.
 * On narrow desktops (tablets) there is no room for both next to a usable stage,
 * so expanding one asks the other to collapse instead of squeezing the stage.
 */
import { $ } from '@lib/dom'

/** Narrowest stage width worth keeping when side panels open or resize. */
export const STAGE_MIN_WIDTH = 360

const SIDE_PANEL_EXPAND_EVENT = 'alg0:side-panel-expand'

export type SidePanel = 'sidebar' | 'code'

const panelSelectors: Record<SidePanel, string> = {
  sidebar: '[data-sidebar-panel]',
  code: '[data-code-panel-panel]',
}

/** In-flow (desktop) width of a side panel; 0 when collapsed. */
export function sidePanelWidth(panel: SidePanel): number {
  return parseFloat($<HTMLElement>(panelSelectors[panel])?.style.width ?? '') || 0
}

export function announceSidePanelExpand(panel: SidePanel): void {
  window.dispatchEvent(new CustomEvent<SidePanel>(SIDE_PANEL_EXPAND_EVENT, { detail: panel }))
}

/** Run `collapse` when the other panel expands and the stage no longer fits. */
export function onSidePanelNeedsRoom(self: SidePanel, collapse: () => void): void {
  window.addEventListener(SIDE_PANEL_EXPAND_EVENT, (event) => {
    if ((event as CustomEvent<SidePanel>).detail === self) return
    const stage = window.innerWidth - sidePanelWidth('sidebar') - sidePanelWidth('code')
    if (stage < STAGE_MIN_WIDTH) collapse()
  })
}
