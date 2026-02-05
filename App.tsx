import Haiti from "./components/Haiti";

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Translator from './components/Translator';
import History from './components/History';
import Footer from './components/Footer';
import { TranslationRecord } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<TranslationRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('translation_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('translation_history', JSON.stringify(history));
  }, [history]);

  const handleNewTranslation = (record: TranslationRecord) => {
    setHistory(prev => [record, ...prev].slice(0, 50)); // Keep last 50
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50/50 to-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Bridge the Gap from <br />
              <span className="text-blue-600">Kreyol to English</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Experience the world's most accurate Haitian Creole translator. Instant results, voice playback, and intelligent context understanding powered by Gemini.
            </p>
          </div>
          
          <Translator onNewTranslation={handleNewTranslation} />
        </section>

        <section className="bg-white">
          <History records={history} onClear={handleClearHistory} />
        </section>

        {/* Informational Section */}
        <section className="max-w-5xl mx-auto px-4 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fa-solid fa-bolt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Powered by Gemini 3 Flash, our engine processes translations in milliseconds while maintaining high fidelity.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fa-solid fa-microphone-lines text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Voice Feedback</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Listen to translations in clear, professional English voices to help with pronunciation and learning.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <i className="fa-solid fa-brain text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Context Aware</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our AI understands Kreyol idioms, slang, and cultural nuances for translations that sound truly natural.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
