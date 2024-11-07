import React from 'react'

function VirtualKeyboard() {
  const keys = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ]

  const handleKeyClick = (key) => {
    const activeElement = document.activeElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      // Get the React instance
      const reactInstance = activeElement._valueTracker
      if (reactInstance) {
        // Temporarily detach React's tracker
        reactInstance.stopTracking()
      }

      // Get current cursor position
      const start = activeElement.selectionStart
      const end = activeElement.selectionEnd
      const value = activeElement.value

      // Create new value
      const newValue = value.substring(0, start) + key + value.substring(end)

      // Update the value
      activeElement.value = newValue

      // Update cursor position
      activeElement.selectionStart = activeElement.selectionEnd = start + 1

      // Re-enable React's tracker
      if (reactInstance) {
        reactInstance.startTracking()
      }

      // Trigger React's onChange
      const event = new Event('input', { bubbles: true })
      activeElement.dispatchEvent(event)
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

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-xl bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg pointer-events-auto z-40">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-0.5 mb-0.5">
          {row.map((key) => (
            <button
              key={key}
              onMouseDown={(e) => {
                e.preventDefault() // Prevent input blur
                handleKeyClick(key)
              }}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-sm"
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-1 mt-0.5">
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            handleBackspace()
          }}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-sm"
        >
          ⌫
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            handleSpace()
          }}
          className="px-8 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-sm"
        >
          Space
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault()
            handleEnter()
          }}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-colors text-sm"
        >
          ↵
        </button>
      </div>
    </div>
  )
}

export default VirtualKeyboard