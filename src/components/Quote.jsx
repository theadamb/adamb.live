import { useState } from 'react'

function Quote() {
  const [quote, setQuote] = useState("If it doesn't challenge you, it doesn't change you")
  const [isEditing, setIsEditing] = useState(false)

  const handleQuoteSubmit = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  return (
    <div className="text-center text-white/80 mt-2">
      {isEditing ? (
        <input
          type="text"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          onKeyDown={handleQuoteSubmit}
          onBlur={() => setIsEditing(false)}
          className="bg-white/10 text-white border-none outline-none px-6 py-3 rounded-lg w-full max-w-lg text-center text-xl"
          autoFocus
        />
      ) : (
        <div 
          onClick={() => setIsEditing(true)} 
          className="cursor-pointer hover:text-white transition-colors text-xl"
        >
          "{quote}"
        </div>
      )}
    </div>
  )
}

export default Quote