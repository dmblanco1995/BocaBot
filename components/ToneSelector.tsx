import React from 'react';
import { Tone, tones } from '../types';

interface ToneSelectorProps {
  selectedTone: Tone;
  onToneChange: (tone: Tone) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ selectedTone, onToneChange }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tones.map((tone) => (
        <button
          key={tone}
          onClick={() => onToneChange(tone)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            selectedTone === tone
              ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
          }`}
        >
          {tone}
        </button>
      ))}
    </div>
  );
};

export default ToneSelector;
