import React, { useState } from 'react'

function VirtualKeyboard() {
  const [isCaps, setIsCaps] = useState(false)         
  const [isSingleCaps, setSingleCaps] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ]

  const handleKeyClick = (key) => {
    const activeElement = document.activeElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const reactInstance = activeElement._valueTracker
      if (reactInstance) {
        reactInstance.stopTracking()
      }

      const start = activeElement.selectionStart
      const end = activeElement.selectionEnd
      const value = activeElement.value
      const keyToAdd = (isCaps || isSingleCaps) ? key.toUpperCase() : key

      const newValue = value.substring(0, start) + keyToAdd + value.substring(end)

      activeElement.value = newValue
      activeElement.selectionStart = activeElement.selectionEnd = start + 1

      if (reactInstance) {
        reactInstance.startTracking()
      }

      const event = new Event('input', { bubbles: true })
      activeElement.dispatchEvent(event)

      if (isSingleCaps) {
        setSingleCaps(false)
      }
    }
  }

  const handleBackspace = () => {
    const activeElement = document.activeElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      const reactInstance = activeElement._valueTracker
      if (reactInstance) {
        reactInstance.stopTracking()
      }

      const start = activeElement.selectionStart
      const end = activeElement.selectionEnd
      const value = activeElement.value

      if (start === end && start > 0) {
        const newValue = value.substring(0, start - 1) + value.substring(end)
        activeElement.value = newValue
        activeElement.selectionStart = activeElement.selectionEnd = start - 1

        if (reactInstance) {
          reactInstance.startTracking()
        }

        const event = new Event('input', { bubbles: true })
        activeElement.dispatchEvent(event)
      }
    }
  }

  const handleSpace = () => handleKeyClick(' ')

  const handleEnter = () => {
    const activeElement = document.activeElement
    if (activeElement) {
      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      })
      activeElement.dispatchEvent(keyEvent)
    }
  }

  const handleCapsClick = () => {
    if (!isCaps && !isSingleCaps) {
      setSingleCaps(true)
    } else if (!isCaps && isSingleCaps) {
      setSingleCaps(false)
      setIsCaps(true)
    } else {
      setIsCaps(false)
    }
  }

  const handleDragStart = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleDragMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div 
      className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-xl bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg pointer-events-auto z-40 cursor-move"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="flex items-center justify-between mb-2 -mt-1 select-none">
        <div className="text-white/50 text-xs">Drag to move</div>
        <div className="text-white/50 text-xs">
          {isCaps ? 'CAPS LOCK ON' : isSingleCaps ? 'CAPS' : ''}
        </div>
      </div>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((key) => (
            <button
              key={key}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleKeyClick(key)
              }}
              className="w-12 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-base cursor-pointer"
            >
              {(isCaps || isSingleCaps) ? key.toUpperCase() : key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2 mt-2">
        <button
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleCapsClick()
          }}
          className={`px-4 py-2 ${
            isCaps ? 'bg-white/30' : isSingleCaps ? 'bg-white/20' : 'bg-white/10'
          } hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-base cursor-pointer`}
        >
          ⇧
        </button>
        <button
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleBackspace()
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-base cursor-pointer"
        >
          ⌫
        </button>
        <button
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleSpace()
          }}
          className="px-12 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-base cursor-pointer"
        >
          Space
        </button>
        <button
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleEnter()
          }}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-base cursor-pointer"
        >
          ↵
        </button>
      </div>
    </div>
  )
}

export default VirtualKeyboard