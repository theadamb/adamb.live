import { useState, useEffect } from 'react'
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
  autoStartBreak,
  soundEnabled,
  devMode,
  isRunning,
  setIsRunning,
  onSessionComplete,
  remainingSessions,
  setRemainingSessions,
  children
}) {
  const [minutes, setMinutes] = useState(preset)
  const [seconds, setSeconds] = useState(0)

  // Update document title based on timer state
  useEffect(() => {
    if (isRunning) {
      const timerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      document.title = `${timerText} adamb.live`;
    } else {
      document.title = 'adamb.live';
    }

    return () => {
      document.title = 'adamb.live';
    };
  }, [minutes, seconds, isRunning]);

  // Reset on initial load
  useEffect(() => {
    setCurrentSession(1)
    setIsBreak(false)
    setRemainingSessions(sessionCount)
  }, [])

  // Update remaining sessions when sessionCount changes
  useEffect(() => {
    setRemainingSessions(sessionCount)
  }, [sessionCount])

  // Auto-start effect
  useEffect(() => {
    const shouldAutoStart = 
      (isBreak && autoStartBreak) ||
      (!isBreak && autoStartWork && currentSession > 1);
    if (shouldAutoStart) {
      setIsRunning(true);
    }
  }, [isBreak, currentSession]);

  useEffect(() => {
    setMinutes(isBreak ? breakDuration : preset)
    setSeconds(0)
    if (!autoStartBreak && isBreak) {
      setIsRunning(false)
    }
    if (!autoStartWork && !isBreak) {
      setIsRunning(false)
    }
  }, [preset, breakDuration, isBreak])

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        }
        if (seconds === 0) {
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

            if (isBreak) {
              if (currentSession < sessionCount) {
                setCurrentSession(currentSession + 1)
                setIsBreak(false)
                setMinutes(preset)
              } else {
                setCurrentSession(1)
                setIsBreak(false)
                setMinutes(preset)
                setRemainingSessions(sessionCount)
              }
            } else {
              setIsBreak(true)
              setMinutes(breakDuration)
              setRemainingSessions(prev => prev - 1)
            }
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        }
      }, devMode ? 50 : 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, minutes, seconds, isBreak, currentSession, sessionCount, preset, breakDuration, onSessionComplete])

  return (
    <div className="text-center">
      <div className="text-white/80 text-2xl mb-1">
        {isBreak 
          ? `Break Time (Remaining: ${remainingSessions})`
          : `Focus Time (Remaining: ${remainingSessions})`
        }
      </div>
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