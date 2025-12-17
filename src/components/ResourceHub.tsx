import React from 'react';
import { X, ExternalLink, BookOpen, ShieldCheck } from 'lucide-react';
import { AppMode, THEMES, Lang, TRANSLATIONS, WIKI_RESOURCES } from '../utils';
import { playSound } from '../audio';

interface ResourceHubProps {
  onClose: () => void;
  mode: AppMode;
  lang: Lang;
}

export const ResourceHub: React.FC<ResourceHubProps> = ({ onClose, mode, lang }) => {
  const theme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className={`bg-white/90 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden ${theme.border} border-4 flex flex-col relative max-h-[85vh]`}>
        
        {/* Header */}
        <div className={`${theme.primary} p-5 flex justify-between items-center text-white z-20 shadow-md`}>
           <div className="flex items-center gap-3">
             <BookOpen size={24} />
             <h2 className="font-black text-xl tracking-tight">{t.wikiBtn}</h2>
           </div>
           <button onClick={() => { playSound.click(); onClose(); }} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors backdrop-blur-sm"><X size={20} /></button>
        </div>

        <div className={`flex-1 p-6 overflow-y-auto custom-scrollbar bg-gradient-to-b ${theme.gradient}`}>
          
          <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl mb-6 border border-white/50 shadow-sm flex items-start gap-3">
             <ShieldCheck className={`flex-shrink-0 ${theme.accent}`} />
             <p className="text-sm text-gray-700 font-bold leading-relaxed">{t.wikiDesc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WIKI_RESOURCES.map((wiki, index) => (
              <a 
                key={index}
                href={wiki.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound.click()}
                className={`group block p-5 rounded-3xl bg-white/40 hover:bg-white border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity ${theme.accent}`}>
                  <ExternalLink size={20} />
                </div>
                
                <h3 className={`font-black text-lg mb-1 ${theme.accent}`}>{wiki.name}</h3>
                <p className="text-xs text-gray-500 font-bold">{wiki.url.replace('https://', '')}</p>
                <p className="mt-3 text-sm text-gray-700 font-medium leading-snug">{wiki.desc[lang]}</p>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Knowledge is Power • Education is Freedom</p>
          </div>

        </div>
      </div>
    </div>
  );
};