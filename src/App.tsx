import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Heart, Wand2, Gamepad2, Info, Settings, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateFemboyIndex, getCommentByScore, haptics, AppMode, THEMES, MODES, Lang, TRANSLATIONS } from './utils';
import { ProgressBar } from './components/ProgressBar';
import { FemboyTraining } from './components/FemboyTraining';
import { LoadingOverlay } from './components/LoadingOverlay';
import { SettingsModal } from './components/SettingsModal';
import { VisualEffects } from './components/VisualEffects';
import { EntryScreen } from './components/EntryScreen';
import { ResourceHub } from './components/ResourceHub';
import { AboutModal } from './components/AboutModal';
import { playSound, setMasterVolume } from './audio';

const App: React.FC = () => {
  // --- State ---
  // Entry Gate
  const [hasAgreed, setHasAgreed] = useState<boolean>(() => localStorage.getItem('app_agreed') === 'true');

  const [name, setName] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0); 
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modals
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showWiki, setShowWiki] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // --- Persistent Settings ---
  const [mode, setMode] = useState<AppMode>(() => (localStorage.getItem('app_mode') as AppMode) || 'femboy');
  const [volume, setVolume] = useState<number>(() => parseInt(localStorage.getItem('app_volume') || '50', 10));
  const [bgAnim, setBgAnim] = useState<boolean>(() => localStorage.getItem('app_bg_anim') !== 'false');
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('app_lang') as Lang) || 'zh');

  // --- Effects ---
  // Sync Audio Volume
  useEffect(() => {
    setMasterVolume(volume / 100);
    localStorage.setItem('app_volume', volume.toString());
  }, [volume]);

  // Sync Mode
  useEffect(() => {
    localStorage.setItem('app_mode', mode);
    if (showResult) handleReset();
  }, [mode]);

  // Sync BG Anim
  useEffect(() => {
    localStorage.setItem('app_bg_anim', bgAnim.toString());
  }, [bgAnim]);

  // Sync Lang
  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  const currentTheme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  // Number counting animation & Heartbeat sound
  useEffect(() => {
    if (showResult && result !== null) {
      playSound.score(); 
      haptics.success();

      let start = 0;
      const end = result;
      const duration = 1500;
      const incrementTime = duration / end;
      
      const timer = setInterval(() => {
        start += 1;
        setDisplayScore(start);
        if (result > 60 && start % 10 === 0) {
           playSound.type(); 
           haptics.soft();
        }
        if (start === end) clearInterval(timer);
      }, result === 0 ? 1000 : incrementTime);

      if (result > 80) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: mode === 'enby' ? ['#FFFF00', '#9C27B0', '#000000'] : ['#f472b6', '#60a5fa', '#ffffff']
          });
        }, 800);
      }
      
      if (result > 90) {
        const heartInterval = setInterval(() => {
             playSound.heartbeat();
             haptics.heartbeat();
        }, 1000);
        return () => {
            clearInterval(timer);
            clearInterval(heartInterval);
        };
      }

      return () => clearInterval(timer);
    }
  }, [showResult, result, mode]);

  const handleCalculate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playSound.click(); 
    haptics.soft();
    setLoading(true);
    setShowResult(false);
    setDisplayScore(0);
    playSound.magic(); 

    // Artificial delay
    setTimeout(async () => {
      const score = await calculateFemboyIndex(name);
      setResult(score);
      setLoading(false);
      setShowResult(true);
    }, 2500);
  }, [name]);

  const handleReset = () => {
    playSound.click();
    haptics.soft();
    setName('');
    setShowResult(false);
    setResult(null);
    setDisplayScore(0);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      playSound.type();
      if (Math.random() > 0.7) haptics.soft(); 
  };

  const handleAgreement = () => {
    localStorage.setItem('app_agreed', 'true');
    setHasAgreed(true);
  };

  // --- RENDER ---

  // 1. Entry Screen Check
  if (!hasAgreed) {
    return (
      <EntryScreen 
        onEnter={handleAgreement} 
        mode={mode} 
        lang={lang} 
        onLangChange={setLang} 
      />
    );
  }

  const isHighValue = result !== null && result > 90;

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans text-gray-800 transition-colors duration-1000 bg-gradient-to-br ${currentTheme.gradient}`}>
      
      {/* Visual Effects Layer */}
      <VisualEffects mode={mode} enabled={bgAnim} />
      
      {/* High Score Overlay */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${isHighValue ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-gradient-to-r ${mode === 'femboy' ? 'from-red-400/20 to-red-400/20' : 'from-white/20 to-white/20'} mix-blend-overlay animate-pulse`}></div>
      </div>

      {/* --- MODALS --- */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        volume={volume}
        onVolumeChange={setVolume}
        mode={mode}
        onModeChange={setMode}
        backgroundAnim={bgAnim}
        onBackgroundAnimChange={setBgAnim}
        lang={lang}
        onLangChange={setLang}
      />

      {showGame && <FemboyTraining onClose={() => setShowGame(false)} mode={mode} lang={lang} />}
      {showWiki && <ResourceHub onClose={() => setShowWiki(false)} mode={mode} lang={lang} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} mode={mode} lang={lang} />}

      {/* --- TOP BAR BUTTONS --- */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        {/* About Button (New) */}
        <button 
          onClick={() => { playSound.click(); setShowAbout(true); }}
          className="p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-600 hover:text-blue-500"
          title={t.aboutBtn}
        >
          <Info size={24} />
        </button>

        {/* Wiki Button */}
        <button 
          onClick={() => { playSound.click(); setShowWiki(true); }}
          className="p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-600 hover:text-blue-600"
          title={t.wikiBtn}
        >
          <BookOpen size={24} />
        </button>

        {/* Settings Button */}
        <button 
          onClick={() => { playSound.click(); setShowSettings(true); }}
          className="p-3 bg-white/50 backdrop-blur-md rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all text-gray-600 hover:text-gray-900"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* --- MAIN CARD --- */}
      <div className={`w-full max-w-md glass-card rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-500 z-10 hover:shadow-2xl ${isHighValue ? `border-${currentTheme.accent.split('-')[1]}-400 ring-4 ring-${currentTheme.accent.split('-')[1]}-200` : ''}`}>
        
        {loading && <LoadingOverlay lang={lang} />}

        {/* Decorative Header Blob - Dynamic Color */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 ${currentTheme.primary} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse`}></div>
        <div className={`absolute -bottom-24 -left-24 w-64 h-64 ${currentTheme.secondary} rounded-full mix-blend-multiply filter blur-3xl opacity-40`}></div>

        <div className="relative z-10 p-8 flex flex-col items-center text-center">
          
          {/* Logo/Header */}
          <div className="mb-8 relative group cursor-pointer" onClick={() => { playSound.click(); haptics.soft(); confetti({ particleCount: 30, spread: 50, origin: { y: 0.3 } }); }}>
             <div className="relative">
                <Heart className={`w-16 h-16 ${currentTheme.accent} drop-shadow-md ${isHighValue ? 'animate-ping duration-[1000ms]' : 'animate-bounce'}`} fill="currentColor" fillOpacity={0.2} />
                {isHighValue && <Heart className={`absolute inset-0 w-16 h-16 text-red-500 animate-pulse`} />}
                <Sparkles className="absolute -top-2 -right-4 text-yellow-400 w-8 h-8 animate-spin-slow" />
             </div>
             <h1 className={`text-4xl font-black mt-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.textGradient} drop-shadow-sm`}>
               {mode === 'femboy' ? t.appTitle : MODES[mode].name[lang]}
             </h1>
             <div className="flex items-center justify-center gap-1 mt-1 text-gray-400 text-xs uppercase tracking-widest font-bold">
               <span>{MODES[mode].desc[lang]}</span>
             </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleCalculate} className="w-full space-y-5">
            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={handleInput}
                placeholder={t.inputPlaceholder}
                className={`w-full px-6 py-5 rounded-2xl bg-white/50 border-2 border-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-${currentTheme.accent.split('-')[1]}-400 focus:bg-white focus:ring-4 focus:ring-opacity-20 focus:ring-${currentTheme.accent.split('-')[1]}-400 transition-all text-center text-xl font-bold shadow-inner`}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className={`w-full py-4 rounded-2xl font-black text-white text-lg shadow-xl transform transition-all duration-200 relative overflow-hidden group
                ${!name.trim() || loading 
                  ? 'bg-gray-300 cursor-not-allowed grayscale' 
                  : `bg-gradient-to-r ${currentTheme.textGradient} hover:scale-[1.02] active:scale-[0.98]`
                }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Wand2 size={24} className={loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'} /> 
                {isHighValue ? t.retryBtn : t.startBtn}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>

          {/* Result Section */}
          <div className={`w-full transition-all duration-700 ease-in-out ${showResult ? 'mt-8 opacity-100 max-h-[600px]' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {result !== null && (
              <div className={`bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-lg relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${currentTheme.textGradient}`}></div>
                
                <p className="text-gray-500 text-sm mb-1 font-medium">{t.resultLabel}</p>
                <p className="text-xl font-bold text-gray-800 mb-4">{name}</p>
                
                <div className="flex items-baseline justify-center mb-2">
                  <span className={`text-7xl font-black tabular-nums tracking-tighter filter drop-shadow-sm ${currentTheme.accent}`}>
                    {displayScore}
                  </span>
                  <span className={`text-3xl font-bold ml-1 opacity-50`}>%</span>
                </div>

                <div className="mb-6 px-2">
                  <ProgressBar percentage={displayScore} mode={mode} />
                </div>

                <div className={`bg-white/50 rounded-xl p-4 mb-4 border border-white/60 relative`}>
                   {isHighValue && <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🥵</div>}
                  <p className={`text-lg font-bold leading-relaxed text-gray-700`}>
                    {getCommentByScore(result, mode, lang)}
                  </p>
                </div>

                <button 
                  onClick={handleReset}
                  className={`text-sm ${currentTheme.accent} font-bold transition-colors flex items-center justify-center gap-1 mx-auto hover:underline`}
                >
                  <Sparkles size={14} /> {t.resetBtn}
                </button>
              </div>
            )}
          </div>
          
          {/* Game Button */}
          {!showResult && !loading && (
             <button 
               onClick={() => { playSound.click(); haptics.soft(); setShowGame(true); }}
               className={`mt-8 group flex items-center gap-2 px-5 py-2 rounded-full bg-white/40 hover:bg-white/80 border border-white/50 ${currentTheme.accent} font-bold text-sm transition-all hover:shadow-md hover:-translate-y-0.5`}
             >
               <Gamepad2 size={18} />
               <span>{t.gamesBtn}</span>
               <span className={`${currentTheme.primary} text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 animate-pulse`}>{t.gamesCount}</span>
             </button>
          )}

        </div>
      </div>
      
      <div className="fixed bottom-4 flex flex-col items-center gap-1 text-center z-50">
         <button 
           onClick={() => { playSound.click(); setShowAbout(true); }}
           className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1 opacity-70 hover:opacity-100 hover:text-gray-600 transition-all"
         >
            <Info size={10} /> {t.secureMsg}
         </button>
      </div>
    </div>
  );
};

export default App;