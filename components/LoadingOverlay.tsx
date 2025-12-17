import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Lang } from '../utils';

const MESSAGES = {
  zh: [
    "正在测量绝对领域...",
    "分析腿部线条中...",
    "计算声音甜度...",
    "检测衣柜里的女装含量...",
    "正在连接二次元数据库...",
    "寻找失散多年的 Blahaj...",
    "校准可爱探测器...",
    "扫描潜在的猫娘基因...",
    "正在分析荷尔蒙波动...",
    "计算灵魂契合度...",
    "正在咨询裙子之神...",
    "检测绝对音感...",
    "分析双马尾适配性...",
    "正在读取异世界存档...",
    "计算白丝透气性...",
    "正在给程序员买女装...",
    "加载神秘的魔法代码...",
    "正在试图理解你的xp...",
    "检测到高能反应...",
    "同步多维宇宙数据...",
    "正在解开封印...",
    "观测量子叠加态性别...",
    "正在向魅魔学习...",
    "补充每日份的可爱能量...",
    "正在从虚空中提取数据..."
  ],
  en: [
    "Measuring Zettai Ryouiki...",
    "Analyzing leg contours...",
    "Calculating voice sweetness...",
    "Scanning wardrobe for skirts...",
    "Connecting to Anime Database...",
    "Searching for lost Blahaj...",
    "Calibrating Cuteness Detector...",
    "Scanning for Catgirl genes...",
    "Analyzing hormone fluctuations...",
    "Calculating Soul Resonance...",
    "Consulting the God of Skirts...",
    "Checking absolute pitch...",
    "Analyzing Twin-tail compatibility...",
    "Loading Isekai save file...",
    "Calculating thigh-high breathability...",
    "Buying programmer socks...",
    "Loading magic code...",
    "Trying to understand your kinks...",
    "High energy reaction detected...",
    "Syncing multiverse data...",
    "Unsealing the seal...",
    "Observing quantum gender...",
    "Learning from Succubus...",
    "Refilling daily cute energy...",
    "Extracting data from the Void..."
  ]
};

export const LoadingOverlay: React.FC<{ lang?: Lang }> = ({ lang = 'zh' }) => {
  const msgs = MESSAGES[lang];
  // Initialize with a random message
  const [currentMessage, setCurrentMessage] = useState(() => msgs[Math.floor(Math.random() * msgs.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Pick a random message every 800ms
      setCurrentMessage(prev => {
        let next;
        do {
          next = msgs[Math.floor(Math.random() * msgs.length)];
        } while (next === prev); // Avoid showing the same message twice in a row
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [lang, msgs]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl animate-in fade-in duration-200">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-pink-400 animate-spin relative z-10" />
        <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-bounce z-10" />
      </div>
      <p className="mt-6 text-gray-600 font-bold text-lg animate-pulse text-center px-4 select-none">
        {currentMessage}
      </p>
    </div>
  );
};