
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <i className="fa-solid fa-language text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">KreyolTranslator</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Empowering global communication with fast, accurate Haitian Creole to English translations using cutting-edge AI.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Gemini API Integration</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Kreyol Vocabulary</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-slate-500 hover:text-blue-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Kreyol Translator Pro. Built with Gemini AI.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors"><i className="fa-brands fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
