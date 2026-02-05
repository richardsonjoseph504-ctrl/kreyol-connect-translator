import React from 'react';

export default function Header() {
  return (
    <header style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
      <h1>Kreyòl Connect – Translator</h1>
    </header>
  );
}


import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fa-solid fa-language text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Kreyol<span className="text-blue-600">Translator</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Translator</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About Kreyol</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">API</a>
        </nav>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
          Get Started
        </button>
      </div>
    </header>
  );
};

Fix Header Export
