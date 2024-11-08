import { useState, useEffect, useRef } from 'react'
import { playChime } from '../utils/sounds'

function Timer({ 
  preset, 
  breakDuration, 
  sessionCount, 
  currentSession,
  setCurrentSession,
  isBreak,
  setIsBreak,
  autoStartWork,
  setAutoStartWork,
  autoStartBreak,
  setAutoStartBreak,
  soundEnabled,
  devMode,
  manualMode,
  isRunning,
  setIsRunning,
  onSessionComplete,
  remainingSessions,
  setRemainingSessions,
  handleFlowComplete,
  children
}) {
  const [minutes, setMinutes] = useState(preset)
  const [seconds, setSeconds] = useState(0)

  // Track previous value of isBreak to detect changes
  const prevIsBreakRef = useRef(isBreak)
  useEffect(() => {
    prevIsBreakRef.current = isBreak
  }, [isBreak])
  const prevIsBreak = prevIsBreakRef.current

  // Update document title based on timer state
  useEffect(() => {
    if (isRunning) {
      const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      document.title = `${timerText} adamb.live`
    } else {
      document.title = 'adamb.live'
    }

    return () => {
      document.title = 'adamb.live'
    }
  }, [minutes, seconds, isRunning])

  // Reset on initial load
  useEffect(() => {
    setCurrentSession(1)
    setIsBreak(false)
    setRemainingSessions(sessionCount)
    setMinutes(preset)
    setSeconds(0)
  }, [sessionCount, preset])

  // Update remaining sessions when sessionCount changes
  useEffect(() => {
    setRemainingSessions(sessionCount)
  }, [sessionCount])

  // Auto-start effect
  useEffect(() => {
    if (!isRunning) {
      const shouldAutoStart = 
        (isBreak && autoStartBreak) ||
        (!isBreak && autoStartWork && currentSession > 1)

      if (shouldAutoStart && !manualMode) {
        setIsRunning(true)
      }
    }
  }, [isBreak, currentSession, manualMode, isRunning, autoStartWork, autoStartBreak])

  // Update timer when isBreak changes
  useEffect(() => {
    if (prevIsBreak !== isBreak) {
      setMinutes(isBreak ? breakDuration : preset)
      setSeconds(0)
      if (!autoStartBreak && isBreak) {
        setIsRunning(false)
      }
      if (!autoStartWork && !isBreak) {
        setIsRunning(false)
      }
    }
  }, [isBreak, prevIsBreak, preset, breakDuration, autoStartBreak, autoStartWork])

  // Update timer when preset or breakDuration change
  useEffect(() => {
    setMinutes(isBreak ? breakDuration : preset)
    setSeconds(0)
  }, [preset, breakDuration])

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval)
            setIsRunning(false)
            if (soundEnabled) {
              playChime()
            }
            if (Notification.permission === 'granted') {
              new Notification(isBreak ? 'Break Complete!' : 'Focus Session Complete!')
            }

            onSessionComplete(isBreak)

            if (!manualMode) {
              if (isBreak) {
                if (currentSession < sessionCount) {
                  setCurrentSession(currentSession + 1)
                  setIsBreak(false)
                  setMinutes(preset)
                  setSeconds(0)
                } else {
                  setCurrentSession(1)
                  setIsBreak(false)
                  setMinutes(preset)
                  setSeconds(0)
                  setRemainingSessions(sessionCount)
                }
              } else {
                setIsBreak(true)
                setMinutes(breakDuration)
                setSeconds(0)
                setRemainingSessions(prev => prev - 1)
              }
            }
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        }
      }, devMode ? 50 : 1000)
    }
    return () => clearInterval(interval)
  }, [
    isRunning,
    minutes,
    seconds,
    isBreak,
    currentSession,
    sessionCount,
    preset,
    breakDuration,
    onSessionComplete,
    manualMode,
    setCurrentSession,
    setIsBreak,
    setMinutes,
    setRemainingSessions,
    soundEnabled
  ])

  return (
    <div className="text-center">
      {!manualMode && (
        <div className="text-white/80 text-2xl mb-1">
          {isBreak 
            ? `Break Time (Remaining: ${remainingSessions})`
            : `Focus Time (Remaining: ${remainingSessions})`
          }
        </div>
      )}
      <div className="text-[10rem] leading-none font-bold text-white mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      {children}
      {devMode && (
        <div className="text-white/50 text-sm mt-4">
          Dev Mode Active - Timer Speed Increased
        </div>
      )}
    </div>
  )
}

export default Timer
