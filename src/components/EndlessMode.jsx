// src/components/EndlessMode.jsx

import { useState, useEffect } from 'react';

function EndlessMode({ 
  initialWorkDuration, 
  initialBreakDuration, 
  sessionCount, 
  onExit 
}) {
  const [isRunning, setIsRunning] = useState(true);
  const [isBreak, setIsBreak] = useState(false);
  const [minutes, setMinutes] = useState(initialWorkDuration);
  const [seconds, setSeconds] = useState(0);
  const [currentSession, setCurrentSession] = useState(1);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else if (minutes > 0 && seconds === 0) {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        } else if (minutes === 0 && seconds === 0) {
          // Timer completed
          clearInterval(interval);

          if (isBreak) {
            // Break session completed
            if (currentSession < sessionCount) {
              // Start next work session
              setIsBreak(false);
              setMinutes(initialWorkDuration);
              setSeconds(0);
              setCurrentSession(prev => prev + 1);
              setIsRunning(true); // Automatically start next session
            } else {
              // All sessions completed
              setIsRunning(false);
              // Optionally, restart the cycle for endless looping
              // Uncomment the following lines for true endless mode:
              // setIsBreak(false);
              // setMinutes(initialWorkDuration);
              // setSeconds(0);
              // setCurrentSession(1);
              // setIsRunning(true);
            }
          } else {
            // Work session completed
            setIsBreak(true);
            setMinutes(initialBreakDuration);
            setSeconds(0);
            setIsRunning(true); // Automatically start break session
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isBreak, currentSession, sessionCount, initialWorkDuration, initialBreakDuration]);

  const handleStop = () => {
    setIsRunning(false);
    onExit(); // Call the onExit function to return to normal operation
  };

  return (
    <div className="text-center">
      <div className="text-white/80 text-2xl mb-1">
        {isBreak 
          ? `Break Time (Session ${currentSession - 1} of ${sessionCount})`
          : `Focus Time (Session ${currentSession} of ${sessionCount})`
        }
      </div>
      <div className="text-[10rem] leading-none font-bold text-white mb-6">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <button
        onClick={handleStop}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white text-xl font-bold py-4 px-8 rounded-2xl transition-all"
      >
        Stop Endless Mode
      </button>
    </div>
  );
}

export default EndlessMode;
