import React, { useEffect, useState } from 'react';

function FlowModal({ onComplete }) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      {showAnimation && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[100px] h-[100px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-white rounded-full animate-flow-pulse-outer" />
            <div className="absolute inset-0 bg-white rounded-full animate-flow-pulse-inner" />
            <div className="absolute inset-0 border-2 border-white rounded-full animate-flow-converge" />
          </div>
        </div>
      )}

      <div className="text-center z-10">
        <div className={`text-3xl font-bold text-white mb-8 transition-opacity duration-1000 ${
          showAnimation ? 'opacity-0' : 'opacity-100'
        }`}>
          You have entered Flow
        </div>
        <button
          onClick={onComplete}
          className={`px-8 py-3 bg-white text-black font-bold rounded-lg 
            hover:bg-gray-200 transition-all transform hover:scale-105
            ${showAnimation ? 'opacity-0' : 'opacity-100'}`}
        >
          Task Complete
        </button>
      </div>
    </div>
  );
}

export default FlowModal;