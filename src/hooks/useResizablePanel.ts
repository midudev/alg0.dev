import { useState, useEffect, useRef, useCallback } from 'react'

interface UseResizablePanelOptions {
  maxWidth: number
  collapseThreshold: number
  /** 'left' = sidebar style (drag right to expand), 'right' = code panel style (drag left to expand) */
  side: 'left' | 'right'
}

export function useResizablePanel({ maxWidth, collapseThreshold, side }: UseResizablePanelOptions) {
  const [collapsed, setCollapsed] = useState(false)
  const [width, setWidth] = useState(maxWidth)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null)

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragRef.current = { startX: e.clientX, startWidth: width }
      setIsDragging(true)
    },
    [width],
  )

  const expand = useCallback(() => {
    setCollapsed(false)
    setWidth(maxWidth)
  }, [maxWidth])

  const collapse = useCallback(() => {
    setCollapsed(true)
    setWidth(0)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const delta = side === 'left'
        ? e.clientX - dragRef.current.startX
        : dragRef.current.startX - e.clientX
      const newWidth = Math.max(0, Math.min(maxWidth, dragRef.current.startWidth + delta))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      dragRef.current = null
      setWidth((prev) => {
        if (prev < collapseThreshold) {
          setCollapsed(true)
          return 0
        }
        setCollapsed(false)
        return maxWidth
      })
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, maxWidth, collapseThreshold, side])

  return {
    collapsed,
    width,
    isDragging,
    handleDragStart,
    expand,
    collapse,
  }
}
