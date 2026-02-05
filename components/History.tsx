
import React, { useState } from 'react';
import { TranslationRecord } from '../types';

interface HistoryProps {
  records: TranslationRecord[];
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ records, onClear }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (records.length === 0) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
            <i className="fa-solid fa-clock-rotate-left text-sm"></i>
          </span>
          Recent Translations
        </h2>
        <button 
          onClick={onClear}
          className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <i className="fa-solid fa-trash-can mr-2 text-xs"></i>
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <div key={record.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="space-y-4 mb-6 flex-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source</span>
                  <p className="text-sm text-slate-600 line-clamp-2 font-medium italic">"{record.sourceText}"</p>
                </div>
                <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">English</span>
                  <p className="text-sm text-slate-900 line-clamp-3 font-bold leading-relaxed">{record.translatedText}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                  {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button 
                  onClick={() => handleCopy(record.id, record.translatedText)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    copiedId === record.id 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                  }`}
                >
                  <i className={`fa-solid ${copiedId === record.id ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copiedId === record.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
