/**
 * Calculates a deterministic index (0-100) based on an input string.
 * Uses SHA-256 via the Web Crypto API.
 */
export async function calculateFemboyIndex(input: string): Promise<number> {
  if (!input) return 0;

  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Calculate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Use the first 4 bytes to form a 32-bit integer for better distribution
  const dataView = new DataView(hashBuffer);
  const intValue = Math.abs(dataView.getInt32(0));
  
  // Modulo 101 to get a range of 0-100
  return intValue % 101;
}

export type AppMode = 'femboy' | 'mtf' | 'ftm' | 'enby';
export type Lang = 'zh' | 'en';

export const TRANSLATIONS = {
  zh: {
    appTitle: "男娘指数",
    inputPlaceholder: "请输入名字/昵称...",
    startBtn: "开始测试",
    retryBtn: "再次深入测试",
    resetBtn: "测测其他名字",
    resultLabel: "测试对象",
    gamesBtn: "进入乐园",
    gamesCount: "6个游戏",
    wikiBtn: "知识宝库",
    settings: "个性化设置",
    secureMsg: "安全 & 确定性算法",
    modeLabel: "计算模式 / 身份",
    volumeLabel: "音效音量",
    visualLabel: "视觉效果",
    particleLabel: "动态背景粒子",
    langLabel: "语言 / Language",
    autoSave: "设置会自动保存到本地设备",
    score: "得分",
    time: "时间",
    startGame: "开始游戏",
    playAgain: "再来一次",
    exit: "退出",
    back: "返回",
    loading: "加载中...",
    gachaPull: "单抽 (免费)",
    gachaPulling: "祈愿中...",
    leave: "离开",
    triviaCorrect: "正确!",
    triviaWrong: "错误",
    nextQ: "下一题",
    viewResult: "查看结果",
    triviaFinish: "测试完成!",
    triviaScore: "最终得分",
    menuTitle: "选择游玩项目",
    gameCatch: "收集挑战",
    gamePat: "极限互动",
    gameMem: "记忆翻牌",
    gameReflex: "反应测试",
    gameGacha: "幸运抽卡",
    gameTrivia: "知识问答",
    // Entry Screen
    entryWelcome: "欢迎来到多元宇宙",
    entryDesc: "这是一个探索自我、娱乐与科普并存的空间。在进入之前，请阅读并签署以下协议。",
    entryAgree: "我已阅读并同意上述条款",
    entryEnter: "签署协议并进入",
    policyTitle: "隐私与开源协议",
    tabWiki: "推荐WIKI",
    wikiDesc: "收录了跨性别、非二元及相关亚文化的硬核科普资源。",
    visit: "访问",
    // About Us
    aboutBtn: "关于我们",
    aboutTitle: "关于本应用",
    aboutDesc: "男娘指数计算器是一个集娱乐、自我探索与科普为一体的现代化网页应用。我们致力于构建一个包容、多元且有趣的数字空间。",
    featuresTitle: "核心功能",
    feature1: "🔮 确定性算法：基于名字哈希的唯一结果，绝无随机。",
    feature2: "🎮 互动乐园：包含6款精心设计的解压小游戏。",
    feature3: "📚 知识宝库：精选 Wiki 链接，提供硬核科普。",
    creditsTitle: "关于开发者",
    creditsDesc: "本项目由开源社区驱动，旨在消除偏见，传递快乐。",
    legal: {
      intro: "本项目是一个开源的娱乐与科普应用。所有的计算逻辑均在您的浏览器本地完成。",
      privacy: "隐私政策：我们承诺不收集任何用户输入的名字、测试结果或行为数据。所有的设置仅保存在您本地浏览器的 LocalStorage 中。",
      license: "开源协议 (MIT)：本软件按“原样”提供，不提供任何形式的明示或暗示保证。开发者不对使用本软件产生的任何后果负责。"
    }
  },
  en: {
    appTitle: "Femboy Index",
    inputPlaceholder: "Enter name/nickname...",
    startBtn: "Start Test",
    retryBtn: "Test Again Deeply",
    resetBtn: "Test Another Name",
    resultLabel: "Subject",
    gamesBtn: "Enter Playground",
    gamesCount: "6 GAMES",
    wikiBtn: "Knowledge Hub",
    settings: "Settings",
    secureMsg: "Secure & Deterministic Algorithm",
    modeLabel: "Mode / Identity",
    volumeLabel: "SFX Volume",
    visualLabel: "Visual Effects",
    particleLabel: "Background Particles",
    langLabel: "Language / 语言",
    autoSave: "Settings are saved automatically",
    score: "Score",
    time: "Time",
    startGame: "Start Game",
    playAgain: "Play Again",
    exit: "Exit",
    back: "Back",
    loading: "Loading...",
    gachaPull: "Pull (Free)",
    gachaPulling: "Praying...",
    leave: "Leave",
    triviaCorrect: "Correct!",
    triviaWrong: "Wrong",
    nextQ: "Next Question",
    viewResult: "View Result",
    triviaFinish: "Quiz Finished!",
    triviaScore: "Final Score",
    menuTitle: "Select Game",
    gameCatch: "Catch Challenge",
    gamePat: "Headpat Extreme",
    gameMem: "Memory Flip",
    gameReflex: "Reflex Test",
    gameGacha: "Lucky Gacha",
    gameTrivia: "Knowledge Quiz",
    // Entry Screen
    entryWelcome: "Welcome to the Multiverse",
    entryDesc: "A space for self-discovery, fun, and education. Please read and sign the agreement below before entering.",
    entryAgree: "I have read and agree to the terms",
    entryEnter: "Sign & Enter",
    policyTitle: "Privacy & Open Source",
    tabWiki: "Recommended Wikis",
    wikiDesc: "Curated hardcore resources for Trans, Non-Binary, and subcultures.",
    visit: "Visit",
    // About Us
    aboutBtn: "About Us",
    aboutTitle: "About App",
    aboutDesc: "Femboy Index is a modern web app combining entertainment, self-discovery, and education. We aim to build an inclusive, diverse, and fun digital space.",
    featuresTitle: "Core Features",
    feature1: "🔮 Deterministic Algo: Unique results based on name hash.",
    feature2: "🎮 Playground: 6 carefully designed mini-games.",
    feature3: "📚 Knowledge Hub: Curated Wiki links for education.",
    creditsTitle: "Credits",
    creditsDesc: "Powered by the open-source community to spread joy and reduce bias.",
    legal: {
      intro: "This project is an open-source entertainment and educational app. All calculations are done locally in your browser.",
      privacy: "Privacy Policy: We pledge NOT to collect any input names, test results, or behavioral data. All settings are stored locally in your browser's LocalStorage.",
      license: "License (MIT): This software is provided 'as is', without warranty of any kind. The developers are not liable for any consequences of using this software."
    }
  }
};

export const MODES: Record<AppMode, { name: Record<Lang, string>; emoji: string; desc: Record<Lang, string> }> = {
  femboy: { 
    name: { zh: "男娘/伪娘", en: "Femboy" }, 
    emoji: "🎀", 
    desc: { zh: "Femboy Detector", en: "Femboy Detector" } 
  },
  mtf: { 
    name: { zh: "MtF (跨女)", en: "MtF (Transfem)" }, 
    emoji: "🏳️‍⚧️", 
    desc: { zh: "MtF Resonance", en: "MtF Resonance" } 
  },
  ftm: { 
    name: { zh: "FtM (跨男)", en: "FtM (Transmasc)" }, 
    emoji: "🦈", 
    desc: { zh: "FtM Energy", en: "FtM Energy" } 
  },
  enby: { 
    name: { zh: "非二元", en: "Non-Binary" }, 
    emoji: "👽", 
    desc: { zh: "Non-Binary Vibe", en: "Non-Binary Vibe" } 
  },
};

export const THEMES: Record<AppMode, {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradient: string;
  textGradient: string;
  border: string;
  ring: string;
  glass: string;
}> = {
  femboy: {
    primary: "bg-pink-500",
    secondary: "bg-pink-100",
    accent: "text-pink-500",
    background: "bg-pink-50",
    gradient: "from-pink-50 via-purple-50 to-blue-50",
    textGradient: "from-pink-500 to-purple-600",
    border: "border-pink-300",
    ring: "ring-pink-200",
    glass: "bg-pink-500/10 hover:bg-pink-500/20",
  },
  mtf: {
    primary: "bg-blue-400",
    secondary: "bg-pink-100",
    accent: "text-blue-400",
    background: "bg-blue-50",
    gradient: "from-blue-100 via-pink-100 to-white",
    textGradient: "from-blue-400 via-pink-400 to-blue-500",
    border: "border-blue-300",
    ring: "ring-pink-200",
    glass: "bg-blue-400/10 hover:bg-blue-400/20",
  },
  ftm: {
    primary: "bg-cyan-600",
    secondary: "bg-blue-100",
    accent: "text-cyan-700",
    background: "bg-slate-50",
    gradient: "from-cyan-50 via-blue-100 to-slate-100",
    textGradient: "from-cyan-700 to-blue-700",
    border: "border-cyan-500",
    ring: "ring-cyan-200",
    glass: "bg-cyan-600/10 hover:bg-cyan-600/20",
  },
  enby: {
    primary: "bg-purple-500",
    secondary: "bg-yellow-100",
    accent: "text-purple-600",
    background: "bg-purple-50",
    gradient: "from-yellow-50 via-purple-50 to-gray-50",
    textGradient: "from-yellow-500 to-purple-600",
    border: "border-purple-400",
    ring: "ring-yellow-200",
    glass: "bg-purple-500/10 hover:bg-purple-500/20",
  }
};

const COMMENTS: Record<AppMode, Record<Lang, (score: number) => string>> = {
  femboy: {
    zh: (score) => {
      if (score === 0) return "纯度极高的雄性...太无聊了。💤";
      if (score < 20) return "看起来很正经，但私下里会穿女装吗？👔👀";
      if (score < 40) return "勉强能看...要不要姐姐帮你化个妆？💄";
      if (score < 60) return "这种羞涩的感觉...嗯，很适合被调教呢~💋";
      if (score < 80) return "好棒的身体...穿上白丝绝对会让人把持不住...👙🥵";
      if (score < 95) return "极品男娘！这种骚气的眼神，想把你锁在房间里...⛓️💗";
      return "啊...受不了了...你是魅魔吗？想把你彻底吃干抹净...💦👑🔞";
    },
    en: (score) => {
      if (score === 0) return "100% Pure Male... Boring. 💤";
      if (score < 20) return "Looks straight, but maybe wears a skirt at home? 👔👀";
      if (score < 40) return "Not bad... want me to do your makeup? 💄";
      if (score < 60) return "That shy look... perfect for training~ 💋";
      if (score < 80) return "Amazing body... irresistible in thigh highs... 👙🥵";
      if (score < 95) return "God-tier Femboy! Those eyes make me want to lock you up... ⛓️💗";
      return "Ah... I can't take it... Are you a succubus? I want to devour you... 💦👑🔞";
    }
  },
  mtf: {
    zh: (score) => {
      if (score === 0) return "毫无波动的顺性别雷达。";
      if (score < 20) return "也许只是错觉？还是蛋壳太厚了？🥚";
      if (score < 40) return "HRT在召唤你吗？有些许少女感溢出哦。💊";
      if (score < 60) return "这股甜妹气息...是用什么洗发水腌入味的？🌸";
      if (score < 80) return "好可爱的女孩子！裙子转起来一定很美~💃🏳️‍⚧️";
      if (score < 95) return "完全是公主殿下！不仅是外表，灵魂也是粉色的！👑💖";
      return "这就是传说中的天选之女！甚至不需要吃糖就已经是完全体了！🤯✨";
    },
    en: (score) => {
      if (score === 0) return "Cisgender radar shows flatline.";
      if (score < 20) return "Just an illusion? Or is the eggshell too thick? 🥚";
      if (score < 40) return "Is HRT calling? A hint of girliness detected. 💊";
      if (score < 60) return "Sweet girl vibes... what shampoo do you use? 🌸";
      if (score < 80) return "Such a cute girl! Spinning in a skirt must look great~ 💃🏳️‍⚧️";
      if (score < 95) return "Absolute Princess! Pink soul and appearance! 👑💖";
      return "The Chosen One! You don't even need E to be perfect! 🤯✨";
    }
  },
  ftm: {
    zh: (score) => {
      if (score === 0) return "怎么看都是可爱的女孩子呢... (大概?)";
      if (score < 20) return "有点假小子的感觉，但还不够硬朗哦。🧢";
      if (score < 40) return "兄弟，你的束胸是不是勒太紧了？有点那味了。🎽";
      if (score < 60) return "这帅气的眼神，已经能迷倒不少人了吧？😎";
      if (score < 80) return "好A！这种阳刚之气简直溢出屏幕了！💪🦁";
      if (score < 95) return "真正的猛男！Alpha气息爆棚，想喊你一声大哥！🔥🏍️";
      return "顶级Alpha Male！这雄性荷尔蒙简直要让人窒息了！👑🤴💥";
    },
    en: (score) => {
      if (score === 0) return "Looks like a cute girl... (Maybe?)";
      if (score < 20) return "Tomboy vibes, but not tough enough yet. 🧢";
      if (score < 40) return "Bro, is your binder too tight? Getting there. 🎽";
      if (score < 60) return "That handsome look could charm anyone. 😎";
      if (score < 80) return "So Alpha! Masculinity overflowing! 💪🦁";
      if (score < 95) return "True Chad! Alpha energy exploding, Big Bro! 🔥🏍️";
      return "Top G! The testosterone is suffocating! 👑🤴💥";
    }
  },
  enby: {
    zh: (score) => {
      if (score === 0) return "非常...二元的生物。";
      if (score < 20) return "还在探索性别的边界吗？有点模糊不清呢。🌫️";
      if (score < 40) return "既不是男也不是女，这种感觉...很奇妙。🌌";
      if (score < 60) return "打破了传统的枷锁，你的灵魂是自由的。🕊️";
      if (score < 80) return "神秘而迷人，无法被定义的存在！🔮✨";
      if (score < 95) return "超越性别的究极生物！你就是你，独一无二！🛸🌟";
      return "这是什么神仙气质？已经飞升到由于概念之外了！🤯🌈♾️";
    },
    en: (score) => {
      if (score === 0) return "Very... binary creature.";
      if (score < 20) return "Exploring gender boundaries? A bit blurry. 🌫️";
      if (score < 40) return "Neither male nor female... fascinating. 🌌";
      if (score < 60) return "Breaking traditions, your soul is free. 🕊️";
      if (score < 80) return "Mysterious and charming, undefined! 🔮✨";
      if (score < 95) return "Ultimate Being beyond gender! Unique! 🛸🌟";
      return "Godly aura? Ascended beyond concepts! 🤯🌈♾️";
    }
  }
};

export function getCommentByScore(score: number, mode: AppMode, lang: Lang): string {
  return COMMENTS[mode][lang](score);
}

export function getColorByScore(score: number, mode: AppMode): string {
  if (mode === 'femboy' || mode === 'mtf') {
    if (score < 20) return "bg-slate-400";
    if (score < 50) return "bg-blue-400";
    if (score < 80) return "bg-pink-400";
    return "bg-rose-600";
  } else if (mode === 'ftm') {
    if (score < 20) return "bg-pink-300";
    if (score < 50) return "bg-purple-400";
    if (score < 80) return "bg-cyan-500";
    return "bg-blue-700";
  } else {
    if (score < 20) return "bg-gray-400";
    if (score < 50) return "bg-yellow-400";
    if (score < 80) return "bg-purple-500";
    return "bg-black";
  }
}

/**
 * Game Assets & Quiz Data
 */
export const GAME_ASSETS: Record<AppMode, {
  goodItems: string[];
  badItems: string[];
  gacha: { name: Record<Lang, string>; rarity: string; icon: string }[];
  quiz: { q: Record<Lang, string>; a: Record<Lang, string[]>; correct: number; expl: Record<Lang, string> }[];
}> = {
  femboy: {
    goodItems: ['🦈', '👙', '🎀', '😽', '💍', '🍼', '🧦', '💄', '🍑'],
    badItems: ['🧔', '🏋️', '🍺', '🧱', '👔'],
    gacha: [
      { name: { zh: "白棉袜", en: "White Socks" }, rarity: "N", icon: "🧦" },
      { name: { zh: "猫耳", en: "Cat Ears" }, rarity: "R", icon: "🐱" },
      { name: { zh: "绝对领域", en: "Zettai Ryouiki" }, rarity: "SSR", icon: "🦵" },
      { name: { zh: "女仆装", en: "Maid Outfit" }, rarity: "SSR", icon: "👗" },
    ],
    quiz: [
      { q: { zh: "“绝对领域”是指哪个部位？", en: "What is 'Zettai Ryouiki'?" }, a: { zh: ["锁骨", "膝盖以上的长筒袜与短裙之间", "后颈", "脚踝"], en: ["Collarbone", "Thigh between sock and skirt", "Nape", "Ankle"] }, correct: 1, expl: { zh: "绝对领域是指过膝袜和短裙之间那段神圣的裸露皮肤！", en: "The sacred bare skin between the thigh-high socks and the skirt!" } },
      { q: { zh: "Blahaj 是指什么？", en: "What is Blahaj?" }, a: { zh: ["一种药物", "宜家鲨鱼玩偶", "一种编程语言", "一种食物"], en: ["Medicine", "IKEA Shark", "Programming Language", "Food"] }, correct: 1, expl: { zh: "Blahaj 是宜家的鲨鱼抱枕，是跨性别和男娘社群的标志性吉祥物。", en: "Blahaj is the IKEA shark plushie, an icon of the community." } },
      { q: { zh: "为了保护皮肤，刮毛后应该？", en: "After shaving, you should..." }, a: { zh: ["直接暴晒", "涂抹润肤露/芦荟胶", "用力揉搓", "喷洒酒精"], en: ["Sunbathe", "Apply Moisturizer", "Rub hard", "Spray Alcohol"] }, correct: 1, expl: { zh: "刮毛后皮肤敏感，需要保湿镇静。", en: "Skin is sensitive after shaving, moisturize it." } }
    ]
  },
  mtf: {
    goodItems: ['💊', '💉', '🏳️‍⚧️', '🦈', '👗', '👠', '🌸'],
    badItems: ['🧔', '🏋️', '🏈', '👔', '📉'],
    gacha: [
      { name: { zh: "螺内酯", en: "Spiro" }, rarity: "N", icon: "💊" },
      { name: { zh: "补佳乐", en: "Estradiol" }, rarity: "R", icon: "🍬" },
      { name: { zh: "SRS手术单", en: "SRS Letter" }, rarity: "UR", icon: "📄" },
      { name: { zh: "Blahaj", en: "Blahaj" }, rarity: "SSR", icon: "🦈" },
    ],
    quiz: [
      { q: { zh: "MtF 是什么的缩写？", en: "What does MtF stand for?" }, a: { zh: ["Male to Female", "More than Friends", "My true Face", "Make the Future"], en: ["Male to Female", "More than Friends", "My true Face", "Make the Future"] }, correct: 0, expl: { zh: "Male to Female，指跨性别女性。", en: "Male to Female, referring to transgender women." } },
      { q: { zh: "HRT 在跨性别语境下指？", en: "What is HRT?" }, a: { zh: ["高分辨率纹理", "激素替代疗法", "人力资源团队", "心率训练"], en: ["High Res Texture", "Hormone Replacement Therapy", "Human Resource Team", "Heart Rate Training"] }, correct: 1, expl: { zh: "Hormone Replacement Therapy，激素替代疗法。", en: "Hormone Replacement Therapy." } },
      { q: { zh: "嗓音训练的重点通常不包括？", en: "Voice training focuses less on?" }, a: { zh: ["音高 (Pitch)", "共鸣 (Resonance)", "音量 (Volume)", "语调 (Intonation)"], en: ["Pitch", "Resonance", "Volume", "Intonation"] }, correct: 2, expl: { zh: "虽然音量有影响，但改变性别的声音听感主要靠共鸣和音高。", en: "Volume is less critical than resonance and pitch for gender perception." } }
    ]
  },
  ftm: {
    goodItems: ['💉', '🏋️', '🧢', '🎽', '🥊', '🦁', '🩹'],
    badItems: ['👙', '👠', '💄', '👗', '🎀'],
    gacha: [
      { name: { zh: "束胸", en: "Binder" }, rarity: "R", icon: "🎽" },
      { name: { zh: "睾酮凝胶", en: "T-Gel" }, rarity: "SR", icon: "🧴" },
      { name: { zh: "胡须", en: "Beard" }, rarity: "SSR", icon: "🧔" },
      { name: { zh: "平胸手术", en: "Top Surgery" }, rarity: "UR", icon: "✂️" },
    ],
    quiz: [
      { q: { zh: "FtM 是什么的缩写？", en: "What does FtM stand for?" }, a: { zh: ["Free the Mind", "Female to Male", "Full time Man", "Face to Mask"], en: ["Free the Mind", "Female to Male", "Full time Man", "Face to Mask"] }, correct: 1, expl: { zh: "Female to Male，指跨性别男性。", en: "Female to Male." } },
      { q: { zh: "佩戴束胸 (Binder) 的注意事项？", en: "Safety rule for Binders?" }, a: { zh: ["可以穿着睡觉", "尽量长时间佩戴", "运动时必须佩戴", "每天不宜超过8小时"], en: ["Sleep in it", "Wear as long as possible", "Must wear for sports", "Max 8 hours a day"] }, correct: 3, expl: { zh: "为了胸部和肋骨健康，每天佩戴不应超过8小时。", en: "For rib health, do not exceed 8 hours." } },
      { q: { zh: "T 在 FtM 语境下通常指？", en: "What is 'T'?" }, a: { zh: ["Time", "Tea", "Testosterone (睾酮)", "Trainer"], en: ["Time", "Tea", "Testosterone", "Trainer"] }, correct: 2, expl: { zh: "T 是 Testosterone 的简称，即雄性激素。", en: "T stands for Testosterone." } }
    ]
  },
  enby: {
    goodItems: ['🐸', '🍄', '🪐', '🛹', '🎨', '🔮', '👽'],
    badItems: ['🚻', '👮', '📦', '🏷️', '🚫'],
    gacha: [
      { name: { zh: "青蛙", en: "Frog" }, rarity: "N", icon: "🐸" },
      { name: { zh: "森林", en: "Forest" }, rarity: "R", icon: "🌲" },
      { name: { zh: "宇宙能量", en: "Cosmic Energy" }, rarity: "SSR", icon: "🌌" },
      { name: { zh: "性别虚无", en: "Gender Void" }, rarity: "UR", icon: "😶‍🌫️" },
    ],
    quiz: [
      { q: { zh: "非二元 (Non-Binary) 指的是？", en: "Non-Binary means?" }, a: { zh: ["不喜欢计算机二进制", "不完全属于男性或女性", "拥有两种性别", "没有任何性别"], en: ["Hating binary code", "Not strictly male or female", "Both genders", "No gender"] }, correct: 1, expl: { zh: "非二元是一个伞状术语，指性别认同不单纯是男或女的人群。", en: "Umbrella term for identities outside the male-female binary." } },
      { q: { zh: "代词 They/Them 可以用于单数吗？", en: "Can They/Them be singular?" }, a: { zh: ["不可以，只能复数", "可以，指代非二元人士", "只有在古代英语可以", "语法错误"], en: ["No, plural only", "Yes, for NB people", "Only in old English", "Grammar error"] }, correct: 1, expl: { zh: "在现代英语中，They/Them 常被用作非二元人士的单数代词。", en: "Yes, standard for non-binary individuals." } },
      { q: { zh: "Enby 是哪个词的可爱发音？", en: "Enby comes from?" }, a: { zh: ["NB (Non-Binary)", "Enemy", "Energy", "Nobody"], en: ["NB (Non-Binary)", "Enemy", "Energy", "Nobody"] }, correct: 0, expl: { zh: "Enby 来源于 Non-Binary 的缩写 NB 的发音。", en: "Phonetic pronunciation of NB." } }
    ]
  }
};

/**
 * WIKI LINKS & RESOURCES
 */
export const WIKI_RESOURCES = [
  { name: "MtF Wiki", url: "https://mtf.wiki/", desc: { zh: "跨性别女性综合指南", en: "Comprehensive guide for Transfeminine people" } },
  { name: "FtM Wiki", url: "https://ftm.wiki/", desc: { zh: "跨性别男性综合指南", en: "Comprehensive guide for Transmasculine people" } },
  { name: "伪娘百科", url: "https://zh.moegirl.org.cn/伪娘", desc: { zh: "萌娘百科：伪娘条目", en: "Moegirl Wiki: Femboy Entry" } },
  { name: "Gender Dysphoria Bible", url: "https://genderdysphoria.fyi/", desc: { zh: "性别烦躁指南 (圣经)", en: "The Gender Dysphoria Bible" } },
  { name: "Nonbinary Wiki", url: "https://nonbinary.wiki/", desc: { zh: "非二元性别百科", en: "Wiki for Non-binary identities" } },
  { name: "Transfem Science", url: "https://transfemscience.org/", desc: { zh: "跨性别女性激素科学", en: "Scientific articles on MtF HRT" } },
  { name: "DIY HRT Directory", url: "https://diyhrt.wiki/", desc: { zh: "HRT 获取指南", en: "Guide to DIY HRT" } },
  { name: "Project Trans", url: "https://2345.lgbt/", desc: { zh: "跨性别相关工具箱", en: "Transgender Toolkit" } },
  { name: "WPATH", url: "https://www.wpath.org/", desc: { zh: "世界跨性别健康专业协会", en: "World Professional Association for Transgender Health" } },
  { name: "Transmasc Wiki", url: "https://transmasc.wiki/", desc: { zh: "跨性别男性资源站", en: "Resource hub for transmasculine folks" } },
];

/**
 * Haptic feedback patterns
 */
export const haptics = {
  soft: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  },
  success: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
  },
  impact: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(40);
    }
  },
  heartbeat: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 100, 50]);
    }
  }
};