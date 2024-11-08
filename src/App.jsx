import { useState, useEffect } from 'react'
import Timer from './components/Timer'
import Settings from './components/Settings'
import Quote from './components/Quote'
import TodoModal from './components/TodoModal'
import StatsCounter from './components/StatsCounter'
import ConfirmationModal from './components/ConfirmationModal'
import FlowModal from './components/FlowModal'
import VirtualKeyboard from './components/VirtualKeyboard'
import { ListTodo, Focus } from 'lucide-react'

function EditableTitle({ title, setTitle }) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false)
    }
  }

  return isEditing ? (
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={handleSubmit}
      onBlur={() => setIsEditing(false)}
      className="bg-black/20 backdrop-blur-sm text-white border-none outline-none px-4 py-2 rounded-lg text-4xl font-bold w-full"
      autoFocus
    />
  ) : (
    <div
      onClick={() => setIsEditing(true)}
      className="text-white cursor-pointer hover:text-white/90 transition-colors text-4xl font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]"
    >
      {title}
    </div>
  )
}

function App() {
  // Timer and Session States
  const [timePreset, setTimePreset] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [sessionCount, setSessionCount] = useState(4)
  const [currentSession, setCurrentSession] = useState(1)
  const [isBreak, setIsBreak] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [isFlowActive, setIsFlowActive] = useState(false)
  const [remainingSessions, setRemainingSessions] = useState(sessionCount)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [manualMode, setManualMode] = useState(false)

  // UI States with localStorage persistence
  const [backgroundStyle, setBackgroundStyle] = useState(() => {
    return localStorage.getItem('backgroundStyle') || 'default'
  })
  const [backgroundType, setBackgroundType] = useState(() => {
    return localStorage.getItem('backgroundType') || 'gradient'
  })
  const [currentPreset, setCurrentPreset] = useState('light')
  const [title, setTitle] = useState('Adamb.live')
  const [showTodoModal, setShowTodoModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)

  // Feature Toggle States
  const [autoStartWork, setAutoStartWork] = useState(false)
  const [autoStartBreak, setAutoStartBreak] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [devMode, setDevMode] = useState(false)

  // Task Management States
  const [focusedTask, setFocusedTask] = useState(null)

  // Counter States (with localStorage persistence)
  const [workSessions, setWorkSessions] = useState(() => {
    return parseInt(localStorage.getItem('workSessions')) || 0
  })
  const [breakSessions, setBreakSessions] = useState(() => {
    return parseInt(localStorage.getItem('breakSessions')) || 0
  })
  const [completedTasks, setCompletedTasks] = useState(() => {
    return parseInt(localStorage.getItem('completedTasks')) || 0
  })

  // Update remaining sessions when sessionCount changes
  useEffect(() => {
    setRemainingSessions(sessionCount)
  }, [sessionCount])

  // Save background preferences to localStorage
  useEffect(() => {
    localStorage.setItem('backgroundStyle', backgroundStyle)
    localStorage.setItem('backgroundType', backgroundType)
  }, [backgroundStyle, backgroundType])

  // Other localStorage Effects
  useEffect(() => {
    const savedFocusedTask = localStorage.getItem('focusedTask')
    if (savedFocusedTask) {
      setFocusedTask(JSON.parse(savedFocusedTask))
    }
  }, [])

  useEffect(() => {
    if (focusedTask) {
      localStorage.setItem('focusedTask', JSON.stringify(focusedTask))
    } else {
      localStorage.removeItem('focusedTask')
    }
  }, [focusedTask])

  useEffect(() => {
    localStorage.setItem('workSessions', workSessions)
  }, [workSessions])

  useEffect(() => {
    localStorage.setItem('breakSessions', breakSessions)
  }, [breakSessions])

  useEffect(() => {
    localStorage.setItem('completedTasks', completedTasks)
  }, [completedTasks])

  // Reset session counts when timer settings change
  useEffect(() => {
    setCurrentSession(1)
    setIsBreak(false)
    setTimerRunning(false)
  }, [timePreset, breakDuration, sessionCount])

  const resetCounters = () => {
    setWorkSessions(0)
    setBreakSessions(0)
    setCompletedTasks(0)
  }

  const handleFlowComplete = () => {
    setIsFlowActive(false)
    setIsBreak(true)
    if (autoStartBreak && !manualMode) {
      setTimerRunning(true)
    }
    setWorkSessions(prev => prev + 1)
    setRemainingSessions(prev => prev - 1)
    if (currentSession < sessionCount) {
      setCurrentSession(prev => prev + 1)
    } else {
      setCurrentSession(1)
      setRemainingSessions(sessionCount)
    }
  }

  const backgrounds = {
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ocean: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
    sunset: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    break: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)'
  }

  const getBackgroundStyle = () => {
    if (isBreak) return { background: backgrounds.break }

    if (backgroundType === 'image') {
      return { 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url('/backgrounds/${backgroundStyle}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }

    return { background: backgrounds[backgroundStyle] }
  }

  const handleSessionComplete = (wasBreak) => {
    if (wasBreak) {
      setBreakSessions(prev => prev + 1)
    } else {
      setWorkSessions(prev => prev + 1)
    }

    if (!manualMode) {
      // Automatic Mode Logic
      if (wasBreak) {
        setIsBreak(false)
        if (autoStartWork) {
          setTimerRunning(true)
        }
      } else {
        setIsBreak(true)
        if (autoStartBreak) {
          setTimerRunning(true)
        }
      }
    } else {
      // In Manual Mode, do not automatically transition
      setTimerRunning(false)
    }
  }

  const handleTaskComplete = () => {
    setCompletedTasks(prev => prev + 1)
  }

  const handleStartBreak = () => {
    setWorkSessions(prev => prev + 1)
    setIsBreak(true)
    setTimerRunning(false)
  }

  const handleFinishBreak = () => {
    setBreakSessions(prev => prev + 1)
    setIsBreak(false)
    setTimerRunning(false)
  }

  return (
    <div 
      className="min-h-screen transition-all duration-700 flex items-center justify-center"
      style={getBackgroundStyle()}
    >
      <div className="absolute top-8 left-8">
        <EditableTitle title={title} setTitle={setTitle} />
      </div>

      <StatsCounter 
        workSessions={workSessions}
        breakSessions={breakSessions}
        completedTasks={completedTasks}
      />

      <div className="absolute top-12 text-center w-full px-4">
        {focusedTask ? (
          <div className="inline-block bg-black/30 backdrop-blur-md px-6 py-2 rounded-2xl text-white text-xl font-semibold shadow-lg border border-white/10">
            {focusedTask.text}
          </div>
        ) : (
          <div className="inline-block bg-black/30 backdrop-blur-md px-6 py-2 rounded-2xl text-white text-xl font-semibold shadow-lg border border-white/10">
            Favorite a to-do task to set it as your focus
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Timer 
            preset={timePreset}
            breakDuration={breakDuration}
            sessionCount={sessionCount}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            isBreak={isBreak}
            setIsBreak={setIsBreak}
            autoStartWork={autoStartWork}
            setAutoStartWork={setAutoStartWork}
            autoStartBreak={autoStartBreak}
            setAutoStartBreak={setAutoStartBreak}
            soundEnabled={soundEnabled}
            devMode={devMode}
            isRunning={timerRunning}
            setIsRunning={setTimerRunning}
            onSessionComplete={handleSessionComplete}
            remainingSessions={remainingSessions}
            setRemainingSessions={setRemainingSessions}
            manualMode={manualMode}
            onComplete={handleFlowComplete}
          >
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className="bg-black/40 hover:bg-black/50 text-white text-xl font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 backdrop-blur-md shadow-lg border border-white/10"
              >
                {timerRunning ? 'Pause' : 'Start'}
              </button>
              <button 
                onClick={() => setShowTodoModal(true)}
                className="bg-black/40 hover:bg-black/50 text-white text-xl font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 backdrop-blur-md shadow-lg border border-white/10 flex items-center space-x-2"
              >
                <ListTodo className="w-6 h-6" />
                <span>To-Do</span>
              </button>
            </div>
          </Timer>
          <Quote />
          {!isBreak && (
            <button
              onClick={() => {
                setIsFlowActive(true)
                setTimerRunning(false)
              }}
              className="mt-6 bg-black/40 hover:bg-black/50 text-white text-xl font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 backdrop-blur-md shadow-lg border border-white/10 flex items-center space-x-2"
            >
              <Focus className="w-6 h-6" />
              <span>Enter Flow</span>
            </button>
          )}
          {manualMode && !isBreak && (
            <button
              onClick={handleStartBreak}
              className="mt-4 bg-black/40 hover:bg-black/50 text-white text-xl font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 backdrop-blur-md shadow-lg border border-white/10"
            >
              Start Break
            </button>
          )}
          {manualMode && isBreak && (
            <button
              onClick={handleFinishBreak}
              className="mt-4 bg-black/40 hover:bg-black/50 text-white text-xl font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 backdrop-blur-md shadow-lg border border-white/10"
            >
              Finish Break
            </button>
          )}
        </div>
        <Settings 
          setTimePreset={setTimePreset}
          backgroundStyle={backgroundStyle}
          setBackgroundStyle={setBackgroundStyle}
          backgroundType={backgroundType}
          setBackgroundType={setBackgroundType}
          setSessionCount={setSessionCount}
          setBreakDuration={setBreakDuration}
          currentPreset={currentPreset}
          setCurrentPreset={setCurrentPreset}
          autoStartWork={autoStartWork}
          setAutoStartWork={setAutoStartWork}
          autoStartBreak={autoStartBreak}
          setAutoStartBreak={setAutoStartBreak}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          devMode={devMode}
          setDevMode={setDevMode}
          showKeyboard={showKeyboard}
          setShowKeyboard={setShowKeyboard}
          manualMode={manualMode}
          setManualMode={setManualMode}
          onResetCounters={() => setShowResetModal(true)}
        />
      </div>
      {showTodoModal && (
        <TodoModal 
          onClose={() => setShowTodoModal(false)} 
          focusedTask={focusedTask}
          setFocusedTask={setFocusedTask}
          onTaskComplete={handleTaskComplete}
        />
      )}
      {isFlowActive && <FlowModal onComplete={handleFlowComplete} />}
      <ConfirmationModal 
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetCounters}
        message="Are you sure you want to reset all counters? This action cannot be undone."
      />
      {showKeyboard && <VirtualKeyboard setShowKeyboard={setShowKeyboard} />}

      <button 
        id="state-transition-button" 
        className="opacity-0 pointer-events-none absolute"
        aria-hidden="true"
        onClick={handleFlowComplete}
      />
    </div>
  )
}

export default App
