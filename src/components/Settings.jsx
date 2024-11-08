import { useState, useEffect } from 'react';

function Settings({
  setTimePreset,
  backgroundStyle,
  setBackgroundStyle,
  backgroundType,
  setBackgroundType,
  setSessionCount,
  setBreakDuration,
  currentPreset,
  setCurrentPreset,
  autoStartWork,
  setAutoStartWork,
  autoStartBreak,
  setAutoStartBreak,
  soundEnabled,
  setSoundEnabled,
  devMode,
  setDevMode,
  manualMode,
  setManualMode,
  showKeyboard,
  setShowKeyboard,
  onResetCounters,
  onStartEndlessMode, // Added this prop
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [workDuration, setWorkDuration] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [sessions, setSessions] = useState(4);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSettings &&
        !event.target.closest('.settings-panel') &&
        !event.target.closest('.settings-button')
      ) {
        setShowSettings(false);
        setCurrentView('main'); // Reset to main view when closing
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSettings]);

  const gradientBackgrounds = [
    {
      id: 'default',
      name: 'Default Purple',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      gradient: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
    },
    {
      id: 'sunset',
      name: 'Sunset',
      gradient: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    },
  ];

  const imageBackgrounds = [
    { id: 'anime1.jpg' },
    { id: 'anime2.jpg' },
    { id: 'city1.jpg' },
    { id: 'city2.jpg' },
    { id: 'flam1.jpg' },
    { id: 'flam2.jpg' },
    { id: 'rainyindoor.jpg' },
    { id: 'rainyindoor2.jpg' },
    { id: 'rainyindoor3.jpg' },
    { id: 'space1.jpg' },
    { id: 'space2.jpg' },
    { id: 'train1.jpg' },
    { id: 'train2.jpg' },
    { id: 'train3.jpg' },
  ];

  const handleSliderChange = (type, value) => {
    switch (type) {
      case 'work':
        setWorkDuration(value);
        setTimePreset(value);
        break;
      case 'break':
        setBreakTime(value);
        setBreakDuration(value);
        break;
      case 'sessions':
        setSessions(value);
        setSessionCount(value);
        break;
      default:
        break;
    }
    setCurrentPreset('custom');
  };

  const handleBackgroundSelect = (type, id) => {
    setBackgroundType(type);
    setBackgroundStyle(id);
  };

  const renderMainMenu = () => (
    <div className="space-y-2">
      <h3 className="text-lg font-bold mb-4 drop-shadow-sm">Settings</h3>

      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="drop-shadow-sm">Auto Start Work Sessions</span>
          <button
            onClick={() => setAutoStartWork(!autoStartWork)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              autoStartWork ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
                autoStartWork ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="drop-shadow-sm">Auto Start Breaks</span>
          <button
            onClick={() => setAutoStartBreak(!autoStartBreak)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              autoStartBreak ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
                autoStartBreak ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="drop-shadow-sm">Sound Notifications</span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              soundEnabled ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
                soundEnabled ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={() => setCurrentView('background')}
        className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors drop-shadow-sm"
      >
        Background Settings
      </button>
      <button
        onClick={() => setCurrentView('timer')}
        className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors drop-shadow-sm"
      >
        Timer Settings
      </button>
      <button
        onClick={onResetCounters}
        className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors drop-shadow-sm text-red-300 hover:text-red-200"
      >
        Reset Session Counters
      </button>

      {/* Start Endless Mode Button */}
      <button
        onClick={onStartEndlessMode}
        className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors drop-shadow-sm text-blue-300 hover:text-blue-200"
      >
        Start Endless Mode
      </button>

      <div className="pt-3 border-t border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70 drop-shadow-sm">Developer Mode</span>
          <button
            onClick={() => setDevMode(!devMode)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              devMode ? 'bg-yellow-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
                devMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-white/70 drop-shadow-sm">Manual Mode</span>
          <button
            onClick={() => setManualMode(!manualMode)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              manualMode ? 'bg-yellow-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
                manualMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-white/70 drop-shadow-sm">Virtual Keyboard</span>
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              showKeyboard ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ease-in-out ml-1 ${
                showKeyboard ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderBackgroundSettings = () => (
    <div>
      <button
        onClick={() => setCurrentView('main')}
        className="mb-4 text-sm hover:text-white/80 drop-shadow-sm"
      >
        ← Back to Settings
      </button>
      <h3 className="text-lg font-bold mb-4 drop-shadow-sm">Background Settings</h3>

      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 drop-shadow-sm">Gradients</h4>
        <div className="grid grid-cols-2 gap-4">
          {gradientBackgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleBackgroundSelect('gradient', bg.id)}
              className={`relative h-24 rounded-lg overflow-hidden transition-transform hover:scale-105 ${
                backgroundType === 'gradient' && backgroundStyle === bg.id
                  ? 'ring-2 ring-white shadow-lg scale-105'
                  : ''
              }`}
            >
              <div className="absolute inset-0" style={{ background: bg.gradient }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-3 drop-shadow-sm">Images</h4>
        <div className="grid grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
          {imageBackgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => handleBackgroundSelect('image', bg.id)}
              className={`relative h-24 rounded-lg overflow-hidden transition-transform hover:scale-105 ${
                backgroundType === 'image' && backgroundStyle === bg.id
                  ? 'ring-2 ring-white shadow-lg scale-105'
                  : ''
              }`}
            >
              <img
                src={`/backgrounds/${bg.id}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimerSettings = () => (
    <div>
      <button
        onClick={() => setCurrentView('main')}
        className="mb-4 text-sm hover:text-white/80 drop-shadow-sm"
      >
        ← Back to Settings
      </button>
      <h3 className="text-lg font-bold mb-4 drop-shadow-sm">Timer Settings</h3>

      <div className="space-y-6">
        <div>
          <label className="block text-sm mb-2 drop-shadow-sm">
            Work Duration: {workDuration} minutes
          </label>
          <input
            type="range"
            min="15"
            max="60"
            value={workDuration}
            onChange={(e) => handleSliderChange('work', parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 drop-shadow-sm">
            Break Duration: {breakTime} minutes
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={breakTime}
            onChange={(e) => handleSliderChange('break', parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 drop-shadow-sm">
            Number of Sessions: {sessions}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={sessions}
            onChange={(e) => handleSliderChange('sessions', parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="settings-button bg-black/30 hover:bg-black/40 text-white rounded-full p-4 transition-all hover:scale-105 backdrop-blur-sm border border-white/10 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {showSettings && (
        <>
          <div className="fixed inset-0" onClick={() => setShowSettings(false)} />
          <div className="settings-panel absolute bottom-16 right-0 bg-black/40 backdrop-blur-md rounded-2xl p-6 w-80 shadow-lg text-white border border-white/10 z-10">
            {currentView === 'main' && renderMainMenu()}
            {currentView === 'background' && renderBackgroundSettings()}
            {currentView === 'timer' && renderTimerSettings()}
          </div>
        </>
      )}
    </div>
  );
}

export default Settings;
