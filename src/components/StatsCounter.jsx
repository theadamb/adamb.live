import React from 'react'

function StatsCounter({ workSessions, breakSessions, completedTasks }) {
  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2">
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-white space-y-4">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{workSessions}</span>
          <span className="text-sm text-white/80">Work Sessions</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{breakSessions}</span>
          <span className="text-sm text-white/80">Breaks</span>
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{completedTasks}</span>
          <span className="text-sm text-white/80">Completed Tasks</span>
        </div>
      </div>
    </div>
  )
}

export default StatsCounter