import React, { useState, useEffect } from 'react';

interface AdComponentProps {
  onClose: () => void;
}

const AdComponent: React.FC<AdComponentProps> = ({ onClose }) => {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanSkip(true);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-sm text-center border-2 border-yellow-400">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 tracking-widest">REKLAMA</h2>
        <div className="bg-gray-700 p-6 rounded-lg mb-6">
          <p className="text-lg text-white">Už tě nebaví prohrávat?</p>
          <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-400 my-2">
            Zkus Elixír Vítězství!™
          </p>
          <p className="text-sm text-gray-400">Vedlejší účinky mohou zahrnovat nadměrné sebevědomí a spontánní tanec.</p>
        </div>
        <button
          onClick={onClose}
          disabled={!canSkip}
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-wait"
        >
          {canSkip ? 'Přeskočit reklamu' : `Pokračovat za ${countdown}s`}
        </button>
      </div>
    </div>
  );
};

export default AdComponent;
