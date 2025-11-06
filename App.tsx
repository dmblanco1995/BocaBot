import React, { useState, useCallback } from 'react';
import { generateTweets } from './services/geminiService';
import { Tweet, Tone } from './types';
import TweetCard from './components/TweetCard';
import Loader from './components/Loader';
import ToneSelector from './components/ToneSelector';
import AutomationGuide from './components/AutomationGuide'; // Importar el nuevo componente

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [tone, setTone] = useState<Tone>('Casual');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false); // Estado para el modal

  const handleGenerateTweets = useCallback(async () => {
    if (!topic.trim()) {
      setError('Por favor, ingresa un tema para generar los tuits.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTweets([]);

    try {
      const tweetTexts = await generateTweets(topic, tone);
      const newTweets = tweetTexts.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
      }));
      setTweets(newTweets);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, tone]);

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 flex-wrap">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
                    Generador de Tuits con IA
                </h1>
                <button
                    onClick={() => setIsGuideOpen(true)}
                    title="Aprende a automatizar las publicaciones"
                    className="bg-slate-700/50 text-sky-400 border border-slate-600 rounded-full p-2 hover:bg-slate-700 hover:text-sky-300 transition-all transform hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.022 12.022 0 0 0-5.84 0m5.84 0a12.022 12.022 0 0 1-5.84 0m5.84 0a12.022 12.022 0 0 1-5.84 0M12 6.37a6 6 0 0 1 5.84 7.38m-5.84-7.38a6 6 0 0 0-5.84 7.38m5.84-7.38v-4.82" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.6 12a9.6 9.6 0 0 1-9.6 9.6 9.6 9.6 0 0 1-9.6-9.6 9.6 9.6 0 0 1 9.6-9.6 9.6 9.6 0 0 1 9.6 9.6Z" />
                    </svg>
                </button>
            </div>
            <p className="mt-2 text-lg text-slate-400">
              Crea tuits impactantes para X en segundos.
            </p>
          </header>

          <main className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-2xl">
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="topic" className="block text-lg font-medium text-slate-300 mb-2">
                  1. ¿Sobre qué quieres tuitear?
                </label>
                <textarea
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ej: El futuro de la inteligencia artificial, consejos de productividad, el lanzamiento de un nuevo producto..."
                  className="w-full h-24 p-3 bg-slate-900 border-2 border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 placeholder-slate-500"
                />
              </div>

              <div>
                <h2 className="text-lg font-medium text-slate-300 mb-3 text-center">
                  2. Elige el tono
                </h2>
                <ToneSelector selectedTone={tone} onToneChange={setTone} />
              </div>

              <button
                onClick={handleGenerateTweets}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generando...
                  </>
                ) : (
                  '✨ Generar Tuits'
                )}
              </button>
            </div>
          </main>

          <div className="mt-10">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}
            {tweets.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {tweets.map((tweet) => (
                  <TweetCard key={tweet.id} tweetText={tweet.text} />
                ))}
              </div>
            )}
          </div>

          <footer className="text-center mt-12 text-slate-500 text-sm">
              <p>Creado con React, Tailwind CSS y la API de Gemini.</p>
          </footer>
        </div>
      </div>
      
      {isGuideOpen && <AutomationGuide onClose={() => setIsGuideOpen(false)} />}
    </>
  );
};

export default App;