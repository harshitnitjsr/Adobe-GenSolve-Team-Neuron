import { useEffect, useState } from 'react';

export const TextToSpeech = ({ text } : any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const speechSynth = window.speechSynthesis;

    if (!speechSynth.speaking && text?.trim().length) {
      setError('');
      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.rate = 1.7; // Set the speaking rate
      speechSynth.speak(newUtterance);
      setIsPlaying(true);

      newUtterance.onend = () => {
        setIsPlaying(false);
      };
    } else if (!text?.trim().length) {
      setError('Nothing to Convert! Enter text in the text area.');
    }
  }, [text]);

  return (
    <div>
      {error && <p className="error-para">{error}</p>}
      <button id="convertBtn" disabled={isPlaying}>
        {/* {isPlaying ? 'Sound is Playing...' : 'Play Converted Sound'} */}
      </button>
    </div>
  );
};


