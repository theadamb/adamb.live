import React from 'react'

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-black/40 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-white mb-6">{message}</div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal