import React from 'react';
import { X, Volume2, Monitor, Palette, User, Globe } from 'lucide-react';
import { AppMode, MODES, THEMES, Lang, TRANSLATIONS } from '../utils';
import { playSound } from '../audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  volume: number;
  onVolumeChange: (val: number) => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  backgroundAnim: boolean;
  onBackgroundAnimChange: (val: boolean) => void;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, volume, onVolumeChange, mode, onModeChange, backgroundAnim, onBackgroundAnimChange, lang, onLangChange
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl m-4 relative overflow-hidden">
        {/* Decorative Header Background */}
        <div className={`absolute top-0 left-0 w-full h-24 ${currentTheme.gradient} opacity-50 z-0`}></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
              <Palette className="w-6 h-6" /> {t.settings}
            </h2>
            <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Language Selection */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Globe size={12} /> {t.langLabel}
              </h3>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                 <button 
                    onClick={() => { playSound.click(); onLangChange('zh'); }}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'zh' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   中文
                 </button>
                 <button 
                    onClick={() => { playSound.click(); onLangChange('en'); }}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${lang === 'en' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   English
                 </button>
              </div>
            </section>

            {/* Mode Selection */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={12} /> {t.modeLabel}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(MODES) as AppMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { playSound.click(); onModeChange(m); }}
                    className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-left
                      ${mode === m 
                        ? `border-${currentTheme.accent.split('-')[1]}-400 bg-gray-50 ring-2 ring-${currentTheme.accent.split('-')[1]}-200` 
                        : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <span className="text-2xl">{MODES[m].emoji}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-gray-800 truncate">{MODES[m].name[lang]}</div>
                      <div className="text-[10px] text-gray-400 font-mono truncate">{MODES[m].desc[lang]}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Volume Control */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Volume2 size={12} /> {t.volumeLabel}
              </h3>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume} 
                  onChange={(e) => {
                     const val = Number(e.target.value);
                     onVolumeChange(val);
                     if (val % 10 === 0) playSound.type();
                  }}
                  className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${currentTheme.accent.split('-')[1]}-500`}
                />
                <span className="font-mono font-bold w-12 text-right text-gray-600">{volume}%</span>
              </div>
            </section>

            {/* Visual Settings */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Monitor size={12} /> {t.visualLabel}
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700 text-sm">{t.particleLabel}</span>
                <button 
                  onClick={() => { playSound.click(); onBackgroundAnimChange(!backgroundAnim); }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${backgroundAnim ? currentTheme.primary : 'bg-gray-300'}`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${backgroundAnim ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </section>
          </div>
        </div>
        
        <div className="mt-8 text-center text-[10px] text-gray-400">
           {t.autoSave}
        </div>
      </div>
    </div>
  );
};