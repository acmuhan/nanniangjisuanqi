import React, { useState } from 'react';
import { Shield, CheckCircle2, ChevronRight, FileText, Lock, Code2 } from 'lucide-react';
import { AppMode, THEMES, Lang, TRANSLATIONS } from '../utils';
import { playSound } from '../audio';

interface EntryScreenProps {
  onEnter: () => void;
  mode: AppMode;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onEnter, mode, lang, onLangChange }) => {
  const [agreed, setAgreed] = useState(false);
  const theme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  const handleEnter = () => {
    if (agreed) {
      playSound.magic();
      onEnter();
    } else {
      playSound.badItem();
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-gradient-to-br ${theme.gradient} animate-in fade-in duration-500`}>
      
      {/* Language Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-20 flex bg-white/40 backdrop-blur-md rounded-full p-1 shadow-sm border border-white/50">
        <button onClick={() => onLangChange('zh')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'zh' ? 'bg-white shadow-sm' : 'opacity-50'}`}>中文</button>
        <button onClick={() => onLangChange('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-white shadow-sm' : 'opacity-50'}`}>EN</button>
      </div>

      <div className="w-full max-w-lg bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header Image/Icon Area */}
        <div className={`h-32 ${theme.primary} flex items-center justify-center relative overflow-hidden`}>
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
           <Shield className="text-white w-16 h-16 relative z-10 drop-shadow-md" />
        </div>

        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <h1 className="text-2xl font-black text-gray-800 mb-2 text-center">{t.entryWelcome}</h1>
          <p className="text-center text-gray-600 mb-8 font-medium text-sm leading-relaxed">{t.entryDesc}</p>

          <div className="space-y-4">
             {/* Section 1: Intro */}
             <div className="bg-white/50 rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold">
                   <FileText size={16} className={theme.accent} />
                   <span>Project Intro</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{t.legal.intro}</p>
             </div>

             {/* Section 2: Privacy */}
             <div className="bg-white/50 rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold">
                   <Lock size={16} className={theme.accent} />
                   <span>Privacy Policy</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{t.legal.privacy}</p>
             </div>

             {/* Section 3: License */}
             <div className="bg-white/50 rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2 text-gray-800 font-bold">
                   <Code2 size={16} className={theme.accent} />
                   <span>Open Source (MIT)</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{t.legal.license}</p>
             </div>
          </div>
        </div>

        {/* Footer / Action Area */}
        <div className="p-6 bg-white/40 border-t border-white/50">
           <label className="flex items-center gap-3 mb-4 cursor-pointer group select-none">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${agreed ? `${theme.primary} border-transparent` : 'border-gray-400 group-hover:border-gray-600'}`}>
                 {agreed && <CheckCircle2 size={16} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={agreed} onChange={(e) => { playSound.click(); setAgreed(e.target.checked); }} />
              <span className={`text-sm font-bold transition-colors ${agreed ? 'text-gray-800' : 'text-gray-500'}`}>{t.entryAgree}</span>
           </label>

           <button 
             onClick={handleEnter}
             disabled={!agreed}
             className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2
               ${agreed 
                 ? `${theme.primary} hover:scale-[1.02] active:scale-[0.98]` 
                 : 'bg-gray-400 cursor-not-allowed grayscale opacity-50'}`}
           >
             {t.entryEnter} <ChevronRight size={20} />
           </button>
        </div>

      </div>
      
      <div className="mt-6 text-[10px] text-gray-400 font-mono">
         Build v2.1.0 • Deterministic Secure Algo
      </div>
    </div>
  );
};