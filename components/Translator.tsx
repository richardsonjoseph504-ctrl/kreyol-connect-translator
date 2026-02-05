
import React, { useState, useCallback, useEffect } from 'react';
import { translateKreyolToEnglish, speakEnglishText } from '../services/geminiService';
import { TranslationStatus, TranslationRecord } from '../types';

interface TranslatorProps {
  onNewTranslation: (record: TranslationRecord) => void;
}

const Translator: React.FC<TranslatorProps> = ({ onNewTranslation }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [status, setStatus] = useState<TranslationStatus>(TranslationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isMonospace, setIsMonospace] = useState(false);
  
  // Feedback states for copy buttons
  const [copiedSource, setCopiedSource] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    setStatus(TranslationStatus.LOADING);
    setError(null);
    
    try {
      const result = await translateKreyolToEnglish(sourceText);
      setTranslatedText(result);
      setStatus(TranslationStatus.SUCCESS);
      
      onNewTranslation({
        id: Math.random().toString(36).substr(2, 9),
        sourceText,
        translatedText: result,
        timestamp: Date.now()
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setStatus(TranslationStatus.ERROR);
    }
  }, [sourceText, onNewTranslation]);

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
    setStatus(TranslationStatus.IDLE);
    setError(null);
  };

  const handleCopy = async (text: string, type: 'source' | 'result') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'source') {
        setCopiedSource(true);
        setTimeout(() => setCopiedSource(false), 2000);
      } else {
        setCopiedResult(true);
        setTimeout(() => setCopiedResult(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSpeak = () => {
    if (translatedText) {
      speakEnglishText(translatedText);
    }
  };

  // Debounce simple auto-translation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText.length > 5 && status !== TranslationStatus.LOADING && status !== TranslationStatus.SUCCESS) {
        handleTranslate();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [sourceText, handleTranslate, status]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Side (Kreyol) */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Haitian Creole</span>
            <button 
              onClick={handleClear}
              className="text-xs font-medium text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="relative group">
            <textarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                if (status === TranslationStatus.SUCCESS) setStatus(TranslationStatus.IDLE);
              }}
              placeholder="Antre tèks la..."
              className="w-full min-h-[220px] p-6 text-lg bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
            />
            {sourceText && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button 
                  onClick={() => handleCopy(sourceText, 'source')}
                  className={`px-3 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
                    copiedSource ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Copy to clipboard"
                >
                  <i className={`fa-solid ${copiedSource ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copiedSource ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Translation Side (English) */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">English</span>
              {translatedText && (
                <button 
                  onClick={() => setIsMonospace(!isMonospace)}
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition-colors ${isMonospace ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'}`}
                >
                  {isMonospace ? 'Monospace ON' : 'Monospace OFF'}
                </button>
              )}
            </div>
            <div className="flex space-x-4">
               {status === TranslationStatus.LOADING && (
                 <span className="text-xs text-blue-600 animate-pulse flex items-center">
                   <i className="fa-solid fa-circle-notch fa-spin mr-1"></i> Translating...
                 </span>
               )}
            </div>
          </div>
          <div className="relative">
            <div className={`w-full min-h-[220px] p-6 text-lg bg-slate-50 border border-slate-200 rounded-2xl shadow-inner transition-all flex flex-col ${status === TranslationStatus.ERROR ? 'border-red-200' : ''}`}>
              {status === TranslationStatus.LOADING && !translatedText ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : translatedText ? (
                <p className={`text-slate-800 whitespace-pre-wrap flex-1 ${isMonospace ? 'font-mono text-base bg-white/50 p-2 rounded border border-slate-100' : ''}`}>
                  {translatedText}
                </p>
              ) : (
                <p className="text-slate-400 italic flex-1 flex items-center justify-center">Translation will appear here</p>
              )}
              
              {translatedText && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSpeak}
                      className="p-3 bg-white text-blue-600 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
                      title="Listen"
                    >
                      <i className="fa-solid fa-volume-high group-active:scale-95"></i>
                    </button>
                    <button 
                      onClick={() => handleCopy(translatedText, 'result')}
                      className={`px-4 py-2 rounded-xl border font-bold text-sm transition-all flex items-center space-x-2 ${
                        copiedResult 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md'
                      }`}
                      title="Copy result"
                    >
                      <i className={`fa-solid ${copiedResult ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copiedResult ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                     <button 
                        className="text-slate-400 hover:text-blue-500 transition-colors p-2"
                        title="Give Feedback"
                     >
                       <i className="fa-regular fa-thumbs-up"></i>
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex items-center">
            <i className="fa-solid fa-circle-exclamation text-red-500 mr-3"></i>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <button
          onClick={handleTranslate}
          disabled={status === TranslationStatus.LOADING || !sourceText.trim()}
          className="group relative inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 shadow-xl shadow-blue-500/30"
        >
          {status === TranslationStatus.LOADING ? (
            <i className="fa-solid fa-circle-notch fa-spin mr-3"></i>
          ) : null}
          {status === TranslationStatus.LOADING ? 'Translating...' : 'Translate to English'}
          <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>
    </div>
  );
};

export default Translator;
