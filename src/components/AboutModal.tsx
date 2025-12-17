import React from 'react';
import { X, Info, Heart, Shield, Gamepad2, BookOpen } from 'lucide-react';
import { AppMode, THEMES, Lang, TRANSLATIONS } from '../utils';
import { playSound } from '../audio';

interface AboutModalProps {
  onClose: () => void;
  mode: AppMode;
  lang: Lang;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, mode, lang }) => {
  const theme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className={`bg-white/90 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden ${theme.border} border-4 flex flex-col relative max-h-[85vh]`}>
        
        {/* Header */}
        <div className={`${theme.primary} p-5 flex justify-between items-center text-white z-20 shadow-md`}>
           <div className="flex items-center gap-3">
             <Info size={24} />
             <h2 className="font-black text-xl tracking-tight">{t.aboutTitle}</h2>
           </div>
           <button onClick={() => { playSound.click(); onClose(); }} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors backdrop-blur-sm"><X size={20} /></button>
        </div>

        <div className={`flex-1 p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b ${theme.gradient}`}>
          
          <div className="flex flex-col items-center mb-6">
            <div className={`p-4 rounded-full bg-white shadow-md mb-4 ${theme.accent}`}>
               <Heart size={48} fill="currentColor" className="animate-pulse" />
            </div>
            <h3 className={`text-2xl font-black ${theme.accent} mb-2`}>{t.appTitle}</h3>
            <p className="text-sm text-gray-600 text-center leading-relaxed font-medium">
              {t.aboutDesc}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.featuresTitle}</h4>
            
            <div className="bg-white/60 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
               <Shield className={`flex-shrink-0 ${theme.accent}`} size={20} />
               <p className="text-sm text-gray-700 font-bold">{t.feature1}</p>
            </div>
            
            <div className="bg-white/60 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
               <Gamepad2 className={`flex-shrink-0 ${theme.accent}`} size={20} />
               <p className="text-sm text-gray-700 font-bold">{t.feature2}</p>
            </div>

            <div className="bg-white/60 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
               <BookOpen className={`flex-shrink-0 ${theme.accent}`} size={20} />
               <p className="text-sm text-gray-700 font-bold">{t.feature3}</p>
            </div>
          </div>

          <div className="text-center border-t border-gray-200/50 pt-6">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.creditsTitle}</h4>
             <p className="text-xs text-gray-500 leading-relaxed max-w-[80%] mx-auto">
               {t.creditsDesc}
             </p>
             <p className="text-[10px] text-gray-300 mt-4 font-mono">v2.2.0 • Open Source MIT</p>
          </div>

        </div>
      </div>
    </div>
  );
};