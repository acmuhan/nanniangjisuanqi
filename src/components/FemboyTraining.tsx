import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Trophy, Play, Hand, Brain, Zap, Sparkles, Shirt, ChevronLeft, GraduationCap, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../audio';
import { haptics, AppMode, THEMES, GAME_ASSETS, MODES, TRANSLATIONS, Lang } from '../utils';

// --- Shared Types & Props ---
interface GameProps {
  onClose: () => void;
  onBackToMenu: () => void;
  mode: AppMode;
  lang: Lang;
}

// --- GAME 1: CATCH (Beautified) ---
const CatchGame: React.FC<GameProps> = ({ onBackToMenu, mode, lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [items, setItems] = useState<{id: number, x: number, type: 'good' | 'bad', emoji: string, speed: number}[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastSpawnTime = useRef<number>(0);
  const t = TRANSLATIONS[lang];

  const theme = THEMES[mode];
  const assets = GAME_ASSETS[mode];

  const spawnItem = useCallback(() => {
    const isGood = Math.random() > 0.3;
    const list = isGood ? assets.goodItems : assets.badItems;
    const emoji = list[Math.floor(Math.random() * list.length)];
    setItems(prev => [...prev, {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      type: isGood ? 'good' : 'bad',
      emoji,
      speed: Math.random() * 0.5 + 0.3
    }]);
  }, [assets]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          setIsPlaying(false);
          playSound.score();
          haptics.success();
          if (score > 10) confetti({ particleCount: 100, origin: { y: 0.6 } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const gameLoop = (time: number) => {
      if (time - lastSpawnTime.current > 800) {
        spawnItem();
        lastSpawnTime.current = time;
      }
      requestRef.current = requestAnimationFrame(gameLoop);
    };
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      clearInterval(timer);
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, gameOver, spawnItem, score]);

  const handleItemClick = (id: number, type: 'good' | 'bad', e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'good') {
      playSound.goodItem();
      haptics.impact();
      setScore(s => s + 1);
    } else {
      playSound.badItem();
      haptics.soft();
      setScore(s => Math.max(0, s - 5));
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`flex-1 relative w-full h-full overflow-hidden rounded-3xl shadow-inner border border-white/40 bg-white/30 backdrop-blur-md`}>
      <div className={`absolute top-4 left-4 z-20 bg-white/70 backdrop-blur-md rounded-2xl px-6 py-2 font-black shadow-sm ${theme.accent} flex gap-4 text-sm border border-white`}>
         <span>{t.score}: {score}</span>
         <span className="opacity-50">|</span>
         <span>{t.time}: {timeLeft}s</span>
      </div>
      
      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/40 backdrop-blur-sm p-8 text-center">
          <div className={`p-6 rounded-full ${theme.secondary} mb-6 animate-bounce shadow-xl`}>
             <Shirt size={48} className={theme.accent} />
          </div>
          <button onClick={() => { setIsPlaying(true); setScore(0); setTimeLeft(30); setItems([]); setGameOver(false); playSound.click(); }} 
            className={`w-full max-w-xs ${theme.primary} text-white py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg`}>
            <Play fill="currentColor" size={20} /> {t.startGame}
          </button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 backdrop-blur-md p-8">
           <Trophy size={64} className="text-yellow-400 mb-4 drop-shadow-md animate-bounce" />
           <p className="text-3xl font-black text-gray-700 mb-8">{t.triviaScore}: {score}</p>
           <div className="flex flex-col gap-3 w-full max-w-xs">
             <button onClick={() => { setIsPlaying(true); setScore(0); setTimeLeft(30); setItems([]); setGameOver(false); }} className={`${theme.primary} text-white py-3 rounded-xl font-bold shadow-lg`}>{t.playAgain}</button>
             <button onClick={onBackToMenu} className="bg-white text-gray-600 border-2 border-gray-200 py-3 rounded-xl font-bold hover:bg-gray-50">{t.exit}</button>
           </div>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} className="absolute text-5xl select-none cursor-pointer hover:scale-110 transition-transform active:scale-90" style={{ left: `${item.x}%`, animation: `fall ${4/item.speed}s linear forwards`, top: '-60px' }} onMouseDown={(e) => handleItemClick(item.id, item.type, e)}>
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

// --- GAME 2: HEADPAT (Beautified) ---
const HeadpatGame: React.FC<GameProps> = ({ onBackToMenu, mode, lang }) => {
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [active, setActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [scale, setScale] = useState(1);
  const theme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (active && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (active && timeLeft === 0) {
      setActive(false);
      setFinished(true);
      playSound.score();
      if (count > 50) confetti({ particleCount: 150, origin: { y: 0.6 } });
    }
  }, [active, timeLeft, count]);

  const pat = () => {
    if (finished) return;
    if (!active) setActive(true);
    setCount(c => c + 1);
    playSound.squish();
    haptics.impact();
    setScale(0.9);
    setTimeout(() => setScale(1), 50);
  };

  const getReaction = () => {
    if (count < 10) return "😐";
    if (count < 30) return "😳";
    if (count < 50) return "😣";
    if (count < 70) return "🥵";
    return "🤤"; 
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center relative p-4 rounded-3xl bg-white/30 backdrop-blur-md shadow-inner border border-white/50`}>
      <div className="absolute top-6 font-black text-gray-400 text-lg uppercase tracking-widest">{t.time}: {timeLeft}s</div>
      {!finished ? (
         <>
          <div className="text-8xl mb-12 transition-transform duration-75 drop-shadow-xl filter" style={{ transform: `scale(${scale})` }}>
            {getReaction()}
          </div>
          <button 
            onMouseDown={pat}
            onTouchStart={(e) => { e.preventDefault(); pat(); }} 
            className={`w-56 h-56 ${theme.primary} rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] active:shadow-inner active:translate-y-2 transition-all flex flex-col items-center justify-center text-white font-black text-3xl border-[6px] border-white/20 relative overflow-hidden group`}
          >
            <span className="relative z-10">{active ? "Pat!" : "Start"}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            <div className="text-sm font-medium opacity-80 mt-2 relative z-10 bg-black/20 px-3 py-1 rounded-full">{count}</div>
          </button>
         </>
      ) : (
        <div className="text-center animate-in zoom-in w-full max-w-xs">
           <div className="text-8xl mb-6">💦</div>
           <h3 className={`text-2xl font-black ${theme.accent} mb-2`}>So Fast...</h3>
           <p className="mb-8 text-gray-600 font-bold">{t.score}: {count}</p>
           <button onClick={onBackToMenu} className="w-full bg-white border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50">{t.back}</button>
        </div>
      )}
    </div>
  );
};

// --- GAME 3: MEMORY (Beautified) ---
const MemoryGame: React.FC<GameProps> = ({ onBackToMenu, mode, lang }) => {
  const assets = GAME_ASSETS[mode];
  const theme = THEMES[mode];
  const ITEMS = assets.goodItems.slice(0, 6); 
  const [cards, setCards] = useState<{id: number, content: string, flipped: boolean, matched: boolean}[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const deck = [...ITEMS, ...ITEMS]
      .sort(() => Math.random() - 0.5)
      .map((content, i) => ({ id: i, content, flipped: false, matched: false }));
    setCards(deck);
  }, [mode]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].content === cards[second].content) {
        setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, matched: true } : c));
        setFlipped([]);
        playSound.goodItem();
        haptics.success();
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
          setFlipped([]);
          playSound.badItem();
        }, 800);
      }
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setSolved(true);
      playSound.score();
      confetti({ particleCount: 100, spread: 60 });
    }
  }, [cards]);

  const handleFlip = (index: number) => {
    if (flipped.length >= 2 || cards[index].flipped || cards[index].matched) return;
    playSound.flip();
    haptics.soft();
    setCards(prev => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
    setFlipped(prev => [...prev, index]);
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-4 rounded-3xl bg-white/30 backdrop-blur-md shadow-inner border border-white/50`}>
      {solved ? (
        <div className="text-center w-full max-w-xs">
          <Brain className={`w-20 h-20 ${theme.accent} mx-auto mb-6 animate-bounce`} />
          <h2 className={`text-3xl font-black ${theme.accent} mb-8`}>Genius! 🧠</h2>
          <button onClick={onBackToMenu} className={`w-full ${theme.primary} text-white py-4 rounded-2xl font-bold shadow-xl`}>{t.back}</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 w-full max-w-[300px]">
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              onClick={() => handleFlip(index)}
              className={`aspect-square rounded-2xl flex items-center justify-center text-4xl cursor-pointer transition-all duration-300 transform shadow-sm
                ${card.flipped || card.matched 
                  ? 'rotate-y-180 bg-white shadow-md border border-white' 
                  : `${theme.secondary} border-2 border-white/50 hover:brightness-95`
                }`}
              style={{ perspective: '1000px' }}
            >
              {(card.flipped || card.matched) ? <span className="animate-in zoom-in">{card.content}</span> : <span className="opacity-20 text-2xl">?</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- GAME 4: REFLEX (Beautified) ---
const ReflexGame: React.FC<GameProps> = ({ onBackToMenu, mode, lang }) => {
  const theme = THEMES[mode];
  const [state, setState] = useState<'waiting' | 'ready' | 'go' | 'tooEarly' | 'result'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [ms, setMs] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const t = TRANSLATIONS[lang];

  const startLevel = () => {
    setState('waiting');
    const delay = 1000 + Math.random() * 3000;
    timeoutRef.current = window.setTimeout(() => {
      setState('go');
      setStartTime(Date.now());
      playSound.magic();
    }, delay);
  };

  useEffect(() => { startLevel(); return () => { if (timeoutRef.current !== null) clearTimeout(timeoutRef.current); }; }, []);

  const handleClick = () => {
    if (state === 'waiting') {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      setState('tooEarly');
      haptics.soft();
      playSound.badItem();
    } else if (state === 'go') {
      const diff = Date.now() - startTime;
      setMs(diff);
      setState('result');
      playSound.goodItem();
      haptics.impact();
    }
  };

  return (
    <div 
      onMouseDown={handleClick}
      className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none rounded-3xl shadow-inner border border-white/50 m-1 relative overflow-hidden
        ${state === 'waiting' ? 'bg-gray-100 hover:bg-gray-200' : 
          state === 'go' ? `${theme.primary} scale-[1.02] shadow-xl ring-4 ring-white/50` : 
          state === 'tooEarly' ? 'bg-red-500' : 'bg-green-500'}`}
    >
      {state === 'waiting' && <p className="text-xl font-bold text-gray-500 animate-pulse flex flex-col items-center gap-2"><Zap /> Wait for color...</p>}
      {state === 'go' && <p className="text-6xl font-black text-white scale-125 animate-ping-short">CLICK!</p>}
      {state === 'tooEarly' && (
        <div className="text-center text-white">
          <p className="text-3xl font-black mb-6">Too Early!</p>
          <button onClick={(e) => { e.stopPropagation(); startLevel(); }} className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-bold backdrop-blur-sm transition-colors">{t.playAgain}</button>
        </div>
      )}
      {state === 'result' && (
        <div className="text-center text-white">
          <p className="text-white/80 font-bold mb-2 uppercase tracking-widest">{t.time}</p>
          <p className={`text-7xl font-black mb-8 drop-shadow-md`}>{ms}<span className="text-3xl">ms</span></p>
          <div className="flex gap-3 justify-center">
             <button onClick={(e) => { e.stopPropagation(); startLevel(); }} className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">{t.playAgain}</button>
             <button onClick={(e) => { e.stopPropagation(); onBackToMenu(); }} className="bg-black/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-black/30 transition-colors">{t.exit}</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- GAME 5: GACHA (Beautified) ---
const GachaGame: React.FC<GameProps> = ({ onBackToMenu, mode, lang }) => {
  const [pulling, setPulling] = useState(false);
  const [item, setItem] = useState<{name: Record<Lang, string>, rarity: string, icon: string} | null>(null);
  const theme = THEMES[mode];
  const items = GAME_ASSETS[mode].gacha;
  const t = TRANSLATIONS[lang];

  const pull = () => {
    if (pulling) return;
    setPulling(true);
    setItem(null);
    playSound.magic();
    
    setTimeout(() => {
      const rand = Math.random();
      let selected;
      if (rand > 0.95) selected = items[3] || items[0]; // UR/SSR
      else if (rand > 0.80) selected = items[2] || items[0]; // SSR
      else if (rand > 0.50) selected = items[1] || items[0]; // R
      else selected = items[0]; // N

      setItem(selected);
      setPulling(false);
      playSound.gacha();
      haptics.success();
      if (selected.rarity === 'SSR' || selected.rarity === 'UR') {
        confetti({ particleCount: 200, spread: 100 });
      }
    }, 1500);
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 rounded-3xl bg-white/30 backdrop-blur-md shadow-inner border border-white/50 text-center relative overflow-hidden`}>
      {/* Light Burst Effect */}
      {item && (item.rarity === 'SSR' || item.rarity === 'UR') && (
        <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0 pointer-events-none"></div>
      )}

      <div className={`mb-10 transition-all duration-500 relative z-10 ${pulling ? 'scale-110 animate-pulse' : 'scale-100'}`}>
         {item ? (
           <div className="animate-in zoom-in duration-300">
             <div className="text-[8rem] mb-6 filter drop-shadow-2xl animate-bounce">{item.icon}</div>
             <div className={`inline-block px-4 py-1 rounded-full text-white font-black text-xl shadow-lg mb-4 
               ${item.rarity === 'UR' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                 item.rarity === 'SSR' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                 item.rarity === 'SR' ? 'bg-blue-400' : 
                 item.rarity === 'R' ? 'bg-green-500' : 'bg-gray-400'}`}>
               {item.rarity}
             </div>
             <div className="text-2xl font-black text-gray-800 tracking-tight">{item.name[lang]}</div>
           </div>
         ) : (
           <div className="text-[8rem] opacity-80 filter drop-shadow-md">🎁</div>
         )}
      </div>

      <button 
        onClick={pull} 
        disabled={pulling}
        className={`w-full max-w-xs ${theme.primary} text-white font-black text-lg py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden z-10`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
           <Sparkles size={20} className={pulling ? 'animate-spin' : ''} />
           {pulling ? t.gachaPulling : t.gachaPull}
        </span>
        <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
      </button>
      
      <button onClick={onBackToMenu} className="mt-6 text-gray-500 font-bold hover:text-gray-800 text-sm transition-colors z-10 relative">{t.leave}</button>
    </div>
  );
};

// --- GAME 6: TRIVIA (Beautified) ---
const TriviaGame: React.FC<GameProps> = ({ onBackToMenu, mode, lang }) => {
  const theme = THEMES[mode];
  const questions = GAME_ASSETS[mode].quiz;
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const t = TRANSLATIONS[lang];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[currentQ].correct) {
      playSound.goodItem();
      haptics.success();
      setScore(s => s + 1);
    } else {
      playSound.badItem();
      haptics.soft();
    }
  };

  const nextQ = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
      if (score === questions.length) confetti({ particleCount: 150 });
    }
  };

  if (showResult) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-3xl bg-white/30 backdrop-blur-md shadow-inner border border-white/50 text-center`}>
        <GraduationCap size={64} className={`${theme.accent} mb-4`} />
        <h2 className="text-3xl font-black text-gray-800 mb-2">{t.triviaFinish}</h2>
        <div className="text-gray-500 font-bold mb-8 uppercase tracking-widest">{t.triviaScore}</div>
        <p className={`text-8xl font-black ${theme.accent} mb-8 drop-shadow-sm`}>{score}<span className="text-3xl text-gray-400">/{questions.length}</span></p>
        <button onClick={onBackToMenu} className={`w-full max-w-xs ${theme.primary} text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform`}>{t.back}</button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className={`flex-1 flex flex-col p-6 overflow-y-auto rounded-3xl bg-white/30 backdrop-blur-md shadow-inner border border-white/50`}>
      <div className="flex justify-between items-center mb-8">
         <div className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-white">Q {currentQ + 1} / {questions.length}</div>
         <div className={`font-black ${theme.accent}`}>{t.score}: {score}</div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed min-h-[3.5rem]">{q.q[lang]}</h3>
      
      <div className="space-y-3">
        {q.a[lang].map((opt, i) => {
          let bg = "bg-white/60 hover:bg-white/90";
          let border = "border-transparent";
          let icon = null;
          
          if (selected !== null) {
            if (i === q.correct) {
              bg = "bg-green-100/90";
              border = "border-green-400";
              icon = <CheckCircle2 className="text-green-600 w-5 h-5" />;
            } else if (i === selected) {
              bg = "bg-red-100/90";
              border = "border-red-400";
              icon = <XCircle className="text-red-500 w-5 h-5" />;
            } else {
              bg = "bg-white/30 opacity-50";
            }
          }
          
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`w-full p-4 rounded-2xl border-2 ${border} ${bg} text-left font-bold text-gray-700 transition-all flex items-center justify-between shadow-sm active:scale-[0.98]`}
            >
              {opt}
              {icon}
            </button>
          );
        })}
      </div>

      <div className={`mt-auto pt-6 transition-all duration-300 ${selected !== null ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="bg-white/50 p-4 rounded-2xl text-sm text-gray-600 border border-white/60 mb-4 shadow-sm">
           <span className="font-bold">💡 Note:</span> {q.expl[lang]}
        </div>
        <button onClick={nextQ} className={`w-full ${theme.primary} text-white py-4 rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all`}>
          {currentQ < questions.length - 1 ? t.nextQ : t.viewResult}
        </button>
      </div>
    </div>
  );
};

// --- MAIN HUB ---
export const FemboyTraining: React.FC<{onClose: () => void, mode: AppMode, lang: Lang}> = ({ onClose, mode, lang }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'catch' | 'pat' | 'memory' | 'reflex' | 'gacha' | 'trivia'>('menu');
  const theme = THEMES[mode];
  const t = TRANSLATIONS[lang];

  const GAMES = [
    { id: 'catch', name: t.gameCatch, icon: <Shirt />, color: theme.secondary },
    { id: 'pat', name: t.gamePat, icon: <Hand />, color: theme.secondary },
    { id: 'memory', name: t.gameMem, icon: <Brain />, color: theme.secondary },
    { id: 'reflex', name: t.gameReflex, icon: <Zap />, color: theme.secondary },
    { id: 'gacha', name: t.gameGacha, icon: <Sparkles />, color: theme.secondary },
    { id: 'trivia', name: t.gameTrivia, icon: <GraduationCap />, color: theme.secondary },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className={`bg-white/80 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden ${theme.border} border-4 flex flex-col relative h-[700px] transition-colors duration-500`}>
        
        {/* Header */}
        <div className={`${theme.primary} p-5 flex justify-between items-center text-white z-20 shadow-md`}>
           <div className="flex items-center gap-3">
             {activeGame !== 'menu' && (
               <button onClick={() => setActiveGame('menu')} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors backdrop-blur-sm"><ChevronLeft size={20} /></button>
             )}
             <h2 className="font-black text-xl tracking-tight">
               {activeGame === 'menu' ? `🎡 ${MODES[mode].name[lang]}` : GAMES.find(g => g.id === activeGame)?.name}
             </h2>
           </div>
           <button onClick={() => { playSound.click(); onClose(); }} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors backdrop-blur-sm"><X size={20} /></button>
        </div>

        {/* Content Container with dynamic background */}
        <div className={`flex-1 p-4 relative overflow-hidden bg-gradient-to-b ${theme.gradient} flex flex-col`}>
          
          {activeGame === 'menu' ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <h3 className="text-center text-gray-500/80 mb-6 font-bold uppercase tracking-widest text-sm mt-4">{t.menuTitle}</h3>
              <div className="grid grid-cols-2 gap-4 pb-4">
                {GAMES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { playSound.click(); setActiveGame(g.id as any); }}
                    className={`${theme.glass} border border-white/40 p-6 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all aspect-square text-gray-800 group`}
                  >
                    <div className={`p-4 rounded-2xl bg-white/60 shadow-inner ${theme.accent} group-hover:scale-110 transition-transform duration-300`}>{g.icon}</div>
                    <span className="font-bold text-sm">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
              {activeGame === 'catch' && <CatchGame onClose={onClose} onBackToMenu={() => setActiveGame('menu')} mode={mode} lang={lang} />}
              {activeGame === 'pat' && <HeadpatGame onClose={onClose} onBackToMenu={() => setActiveGame('menu')} mode={mode} lang={lang} />}
              {activeGame === 'memory' && <MemoryGame onClose={onClose} onBackToMenu={() => setActiveGame('menu')} mode={mode} lang={lang} />}
              {activeGame === 'reflex' && <ReflexGame onClose={onClose} onBackToMenu={() => setActiveGame('menu')} mode={mode} lang={lang} />}
              {activeGame === 'gacha' && <GachaGame onClose={onClose} onBackToMenu={() => setActiveGame('menu')} mode={mode} lang={lang} />}
              {activeGame === 'trivia' && <TriviaGame onClose={onClose} onBackToMenu={() => setActiveGame('menu')} mode={mode} lang={lang} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};