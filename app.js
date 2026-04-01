// ============================================
// TASBEEH APP - Complete Feature Implementation
// ============================================

// Default Tasbeeh List — text: Arabic, transliteration: Roman English, urdu: Urdu translation
const DEFAULT_TASBEEH = [
  {
    text: "يَا سَلَامُ يَا مُؤْمِنُ يَا اللَّهُ",
    transliteration: "Ya Salam Ya Mu'minu Ya Allah",
    urdu: "اے سلام، اے مومن، اے اللہ",
    target: 100,
  },
  {
    text: "يَا رَحْمَٰنُ يَا رَحِيمُ يَا اللَّهُ",
    transliteration: "Ya Rahman Ya Rahim Ya Allah",
    urdu: "اے رحمان، اے رحیم، اے اللہ",
    target: 100,
  },
  {
    text: "يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    transliteration: "Ya Zal-Jalali Wal-Ikram",
    urdu: "اے ذوالجلال والاکرام",
    target: 100,
  },
  {
    text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    urdu: "اللہ کی ذات کے سوا نہ طاقت ہے نہ کوئی چارہ",
    target: 100,
  },
];

/** Bump when default Arabic/Urdu/Roman copy changes — triggers one-time refresh from localStorage */
const TASBEEH_CONTENT_VERSION = "arabic-urdu-v1";

// Daily Messages (Ayahs and Hadiths)
const DAILY_MESSAGES = [
  { text: "Verily, in the remembrance of Allah do hearts find rest.", source: "Quran 13:28" },
  { text: "Remember Me, and I will remember you.", source: "Quran 2:152" },
  { text: "The best of you are those who remind others of Allah.", source: "Hadith" },
  { text: "Glorify Allah morning and evening.", source: "Quran 33:42" },
  { text: "And whoever relies upon Allah - then He is sufficient for him.", source: "Quran 65:3" },
  { text: "Allah is with those who are patient.", source: "Quran 2:153" },
  { text: "So remember Me; I will remember you.", source: "Quran 2:152" },
  { text: "The tongue is light to move, but heavy on the scale.", source: "Hadith" },
  { text: "He who remembers his Lord and he who does not are like the living and the dead.", source: "Hadith" },
  { text: "And glorify Him morning and afternoon.", source: "Quran 33:42" },
  { text: "Richness is not an abundance of goods; richness is contentment in the soul.", source: "Hadith" },
  { text: "The strong believer is better and more beloved than the weak believer.", source: "Hadith" },
  { text: "Whoever relieves a believer's hardship, Allah will relieve his hardship on the Day of Judgment.", source: "Hadith" },
];

// Ayat of the day — Arabic, Urdu, English, source
const AYAT_OF_THE_DAY = [
  {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    urdu: "خب، اللہ کے ذکر سے دلوں کو اطمینان حاصل ہوتا ہے۔",
    english: "Unquestionably, by the remembrance of Allah hearts are assured.",
    source: "Qur'an 13:28",
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    urdu: "پس تم مجھے یاد کرو، میں تمہیں یاد کروں گا۔",
    english: "So remember Me; I will remember you.",
    source: "Qur'an 2:152",
  },
  {
    arabic: "وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنْفَعُ الْمُؤْمِنِينَ",
    urdu: "اور نصیحت کر، کیونکہ نصیحت مومنوں کو فائده دیتی ہے۔",
    english: "And remind, for indeed reminder benefits the believers.",
    source: "Qur'an 51:55",
  },
  {
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    urdu: "اور تمہارے رب نے فرمایا: مجھے پکارو، میں تمہاری دعا قبول کروں گا۔",
    english: "And your Lord says, \"Call upon Me; I will respond to you.\"",
    source: "Qur'an 40:60",
  },
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    urdu: "یقیناً تنگی کے ساتھ آسانی ہے۔",
    english: "Indeed, with hardship [will be] ease.",
    source: "Qur'an 94:6",
  },
];

// Hadith of the day — Arabic (or classical phrase), Urdu, English, source
const HADITH_OF_THE_DAY = [
  {
    arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
    urdu: "اعمال کا دارومدار نیتوں پر ہے۔",
    english: "Actions are judged by intentions.",
    source: "Sahih al-Bukhari & Muslim",
  },
  {
    arabic: "مَنْ لَا يَشْكُرِ النَّاسَ لَا يَشْكُرُ اللَّهَ",
    urdu: "جو لوگوں کا شکر نہیں ادا کرتا، وہ اللہ کا شکر بھی نہیں کرتا۔",
    english: "Whoever does not thank people has not thanked Allah.",
    source: "Hadith — Tirmidhi",
  },
  {
    arabic: "الطُّهُورُ شَطْرُ الْإِيمَانِ",
    urdu: "پاکیزگی ایمان کا آدھا حصہ ہے۔",
    english: "Purity is half of faith.",
    source: "Sahih Muslim",
  },
  {
    arabic: "لَا تَقُومُ السَّاعَةُ حَتَّى يُقْبَضَ الْعِلْمُ",
    urdu: "قیامت اس وقت تک نہیں آئے گی جب تک علم نہ اٹھا لیا جائے۔",
    english: "Knowledge will be taken away before the Hour.",
    source: "Hadith — Bukhari",
  },
  {
    arabic: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",
    urdu: "صدقے سے مال میں کمی نہیں آتی۔",
    english: "Charity does not decrease wealth.",
    source: "Sahih Muslim",
  },
];

function getDayRotationIndex(len) {
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return dayOfYear % len;
}

// Milestones
const MILESTONES = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000];

// Theme ids — must load before `loadSettings()` runs on first line below
const THEME_ALIASES = {
  dark: "midnight-emerald",
  "night-sky": "night-sky-blue",
  minimal: "pure-minimal",
};

const VALID_THEMES = ["midnight-emerald", "night-sky-blue", "gold-black", "pure-minimal"];

function normalizeTheme(theme) {
  if (!theme) return "midnight-emerald";
  const mapped = THEME_ALIASES[theme] || theme;
  return VALID_THEMES.includes(mapped) ? mapped : "midnight-emerald";
}

// ============================================
// STATE MANAGEMENT
// ============================================

let state = loadState();
let settings = loadSettings();
let tasbeehList = loadTasbeehList();

/** Snapshot for single-step undo (last tap only) */
let lastUndo = null;

let wakeLockSentinel = null;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadState() {
  const saved = JSON.parse(localStorage.getItem("tasbeehState"));
  const today = getToday();
  const freshState = createFreshState(today);

  if (!saved) {
    return freshState;
  }

  // Merge saved state with fresh state to ensure all properties exist
  const mergedState = { ...freshState, ...saved };

  // Reset daily counts if new day
  if (saved.date !== today) {
    mergedState.count = 0;
    mergedState.currentIndex = 0;
    mergedState.date = today;
    mergedState.todayCompleted = 0;
    mergedState.todayRecitations = 0;
  }

  return mergedState;
}

function createFreshState(date) {
  return {
    count: 0,
    currentIndex: 0,
    date: date,
    todayCompleted: 0,
    todayRecitations: 0,
    totalRecitations: 0,
    streak: 0,
    lastActiveDate: null,
    milestonesSeen: [],
    weeklyData: {},
    moodData: [],
    hourlyActivity: {},
  };
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem("tasbeehSettings"));
  const defaults = {
    flowMode: "sequential",
    theme: "midnight-emerald",
    holdMode: false,
    hapticFeedback: true,
    hapticStrength: 20,
    hapticPattern: "each",
    silentMode: false,
    bigNumberMode: false,
    reflectionMode: true,
    focusMode: false,
    thumbZoneMode: false,
    readableArabic: false,
    sessionSummary: true,
    keepScreenAwake: false,
    dailyReminder: false,
    reminderTime: "20:00",
    nightReminder: false,
  };
  if (!saved) return defaults;
  const merged = {
    ...defaults,
    ...saved,
    theme: normalizeTheme(saved.theme),
  };
  if (!["each", "10", "33"].includes(merged.hapticPattern)) {
    merged.hapticPattern = "each";
  }
  return merged;
}

function loadTasbeehList() {
  const saved = JSON.parse(localStorage.getItem("tasbeehList"));
  if (!saved) return DEFAULT_TASBEEH.map((item) => ({ ...item }));
  return saved.map((item) => ({
    text: item.text ?? "",
    transliteration: item.transliteration ?? "",
    urdu: item.urdu ?? "",
    target: typeof item.target === "number" && item.target > 0 ? item.target : 33,
  }));
}

function saveState() {
  localStorage.setItem("tasbeehState", JSON.stringify(state));
}

function saveSettings() {
  localStorage.setItem("tasbeehSettings", JSON.stringify(settings));
}

function saveTasbeehList() {
  localStorage.setItem("tasbeehList", JSON.stringify(tasbeehList));
}

// ============================================
// DOM ELEMENTS
// ============================================

const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const elements = {
  app: $("app"),
  header: document.querySelector(".header"),
  count: $("count"),
  countTarget: $("countTarget"),
  tapBtn: $("tapBtn"),
  tasbeehList: $("tasbeehList"),
  progressCircle: document.querySelector(".progress"),
  celebration: $("celebration"),
  celebrationSubtext: $("celebrationSubtext"),

  // Stats
  streakBadge: $("streakBadge"),
  streakCount: $("streakCount"),
  todayCompleted: $("todayCompleted"),
  totalRecitations: $("totalRecitations"),

  undoBtn: $("undoBtn"),
  focusCurrentPhrase: $("focusCurrentPhrase"),
  focusArabic: $("focusArabic"),
  focusRoman: $("focusRoman"),
  quickTargetRow: $("quickTargetRow"),
  celebrationSession: $("celebrationSession"),

  // Flow mode
  flowModeIndicator: $("flowModeIndicator"),
  flowModeText: $("flowModeText"),

  // Menu
  menuBtn: $("menuBtn"),
  menu: $("menu"),
  menuOverlay: $("menuOverlay"),
  closeMenu: $("closeMenu"),

  // Settings
  settingsBtn: $("settingsBtn"),
  settingsPanel: $("settingsPanel"),
  settingsOverlay: $("settingsOverlay"),
  closeSettings: $("closeSettings"),

  // Modals
  editModal: $("editModal"),
  timerModal: $("timerModal"),
  insightsModal: $("insightsModal"),
  reflectionModal: $("reflectionModal"),
  milestone: $("milestone"),

  // Timer
  focusTimer: $("focusTimer"),
  timerDisplay: $("timerDisplay"),
  timerStop: $("timerStop"),
};

const radius = 80;
const circumference = 2 * Math.PI * radius;

// ============================================
// RENDERING
// ============================================

function renderTasbeehList() {
  elements.tasbeehList.innerHTML = "";

  tasbeehList.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("tasbeeh-item");

    if (index < state.currentIndex) div.classList.add("done");
    else if (index === state.currentIndex) div.classList.add("active");
    else div.classList.add("upcoming");

    const arabic = document.createElement("span");
    arabic.className = "tasbeeh-arabic";
    arabic.dir = "rtl";
    arabic.textContent = item.text || "";

    const meta = document.createElement("div");
    meta.className = "tasbeeh-meta";

    const roman = document.createElement("span");
    roman.className = "tasbeeh-roman";
    roman.textContent = `${item.target || 100}x - ${item.transliteration || ""}`;

    const urdu = document.createElement("span");
    urdu.className = "tasbeeh-urdu";
    urdu.dir = "rtl";
    urdu.lang = "ur";
    urdu.textContent = item.urdu || "";

    meta.append(roman, urdu);
    div.append(arabic, meta);

    elements.tasbeehList.appendChild(div);
  });

  const list = elements.tasbeehList;
  const active = list?.querySelector(".tasbeeh-item.active");
  if (active && list) {
    const listRect = list.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const delta =
      activeRect.top - listRect.top - (list.clientHeight - activeRect.height) / 2;
    list.scrollTop += delta;
  }
}

function updateProgress() {
  const currentTarget = tasbeehList[state.currentIndex]?.target || 100;
  const count = state.count || 0;
  const offset = circumference - (count / currentTarget) * circumference;
  elements.progressCircle.style.strokeDashoffset = offset;
}

function updateCountDisplay() {
  const currentTarget = tasbeehList[state.currentIndex]?.target || 100;
  elements.count.innerText = state.count || 0;
  elements.countTarget.innerText = `/ ${currentTarget}`;
}

function updateStats() {
  elements.streakCount.innerText = state.streak || 0;
  elements.todayCompleted.innerText = state.todayCompleted || 0;
  elements.totalRecitations.innerText = formatNumber(state.totalRecitations || 0);
}

function formatNumber(num) {
  num = num || 0;
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

function updateFlowModeIndicator() {
  const modes = {
    sequential: "Sequential",
    single: "Single Loop",
    random: "Random",
  };
  elements.flowModeText.innerText = modes[settings.flowMode];
}

function updateUI() {
  updateCountDisplay();
  renderTasbeehList();
  updateProgress();
  updateStats();
  updateFlowModeIndicator();
  updateFocusPhrase();
  updateUndoButton();
  updateQuickTargetChips();
  applyExperienceModes();
}

function updateQuickTargetChips() {
  const t = tasbeehList[state.currentIndex]?.target;
  $$(".quick-target-chip").forEach((btn) => {
    btn.classList.toggle("active", parseInt(btn.dataset.target, 10) === t);
  });
}

function applyExperienceModes() {
  document.body.classList.toggle("focus-mode", !!settings.focusMode);
  document.body.classList.toggle("thumb-zone-mode", !!settings.thumbZoneMode);
  document.body.classList.toggle("readable-arabic-mode", !!settings.readableArabic);
}

function updateFocusPhrase() {
  if (!elements.focusArabic || !elements.focusRoman || !elements.focusCurrentPhrase) return;
  const item = tasbeehList[state.currentIndex];
  if (item) {
    elements.focusArabic.textContent = item.text || "";
    elements.focusRoman.textContent = item.transliteration || "";
  }
  elements.focusCurrentPhrase.classList.toggle("hidden", !settings.focusMode);
}

function updateUndoButton() {
  if (!elements.undoBtn) return;
  const can = lastUndo !== null && !settings.holdMode;
  elements.undoBtn.hidden = !can;
  elements.undoBtn.disabled = !can;
}

function openAyatOfDayModal() {
  const item = AYAT_OF_THE_DAY[getDayRotationIndex(AYAT_OF_THE_DAY.length)];
  $("ayatArabic").textContent = item.arabic;
  $("ayatUrdu").textContent = item.urdu;
  $("ayatEnglish").textContent = item.english;
  $("ayatSource").textContent = item.source;
  $("ayatModal").classList.remove("hidden");
  setBodyScrollLocked(true);
  closeMenu();
}

function closeAyatOfDayModal() {
  $("ayatModal").classList.add("hidden");
  setBodyScrollLocked(false);
}

function openHadithOfDayModal() {
  const item = HADITH_OF_THE_DAY[getDayRotationIndex(HADITH_OF_THE_DAY.length)];
  $("hadithArabic").textContent = item.arabic;
  $("hadithUrdu").textContent = item.urdu;
  $("hadithEnglish").textContent = item.english;
  $("hadithSource").textContent = item.source;
  $("hadithModal").classList.remove("hidden");
  setBodyScrollLocked(true);
  closeMenu();
}

function closeHadithOfDayModal() {
  $("hadithModal").classList.add("hidden");
  setBodyScrollLocked(false);
}

function applyQuickTarget(target) {
  const n = parseInt(target, 10);
  if (!n || !tasbeehList[state.currentIndex]) return;
  tasbeehList[state.currentIndex].target = n;
  if (state.count >= n) state.count = 0;
  saveTasbeehList();
  saveState();
  updateUI();
}

// ============================================
// CORE FUNCTIONALITY
// ============================================

function incrementCount() {
  const currentTarget = tasbeehList[state.currentIndex]?.target || 100;

  if (!settings.holdMode) {
    const today = getToday();
    const hour = new Date().getHours();
    lastUndo = {
      count: state.count,
      totalRecitations: state.totalRecitations,
      todayRecitations: state.todayRecitations,
      weeklyToday: state.weeklyData[today] || 0,
      hour,
      hourCount: state.hourlyActivity[hour] || 0,
    };
  }

  state.count = (state.count || 0) + 1;
  state.totalRecitations = (state.totalRecitations || 0) + 1;
  state.todayRecitations = (state.todayRecitations || 0) + 1;

  const hour = new Date().getHours();
  state.hourlyActivity[hour] = (state.hourlyActivity[hour] || 0) + 1;

  const today = getToday();
  state.weeklyData[today] = (state.weeklyData[today] || 0) + 1;

  if (settings.hapticFeedback && navigator.vibrate) {
    const n = state.count;
    const pat = settings.hapticPattern || "each";
    let pulse = false;
    if (pat === "each") pulse = true;
    else if (pat === "10") pulse = n % 10 === 0;
    else if (pat === "33") pulse = n % 33 === 0;
    if (pulse) navigator.vibrate(settings.hapticStrength);
  }

  createRipple();

  if (state.count >= currentTarget) {
    completeTasbeeh();
    return;
  }

  checkMilestones();

  saveState();
  updateUI();
}

function undoLastTap() {
  if (!lastUndo || settings.holdMode) return;
  const u = lastUndo;
  const today = getToday();
  state.count = u.count;
  state.totalRecitations = u.totalRecitations;
  state.todayRecitations = u.todayRecitations;
  state.weeklyData[today] = u.weeklyToday;
  state.hourlyActivity[u.hour] = u.hourCount;
  lastUndo = null;
  saveState();
  updateUI();
}

function completeTasbeeh() {
  lastUndo = null;
  const completedTarget = tasbeehList[state.currentIndex]?.target || 100;
  const phraseLabel = tasbeehList[state.currentIndex]?.transliteration || "Tasbeeh";

  state.count = 0;
  state.todayCompleted++;

  updateStreak();

  moveToNextTasbeeh();

  showCelebration(completedTarget, phraseLabel);

  checkMilestones();
  saveState();
  updateUI();

  if (settings.reflectionMode) {
    setTimeout(() => showReflectionModal(), 1600);
  }
}

function moveToNextTasbeeh() {
  const currentIndex = state.currentIndex || 0;
  switch (settings.flowMode) {
    case "sequential":
      state.currentIndex = (currentIndex + 1) % tasbeehList.length;
      break;
    case "single":
      // Stay on same tasbeeh
      break;
    case "random":
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * tasbeehList.length);
      } while (newIndex === currentIndex && tasbeehList.length > 1);
      state.currentIndex = newIndex;
      break;
  }
}

function updateStreak() {
  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (state.lastActiveDate === yesterday || state.lastActiveDate === today) {
    if (state.lastActiveDate !== today) {
      state.streak = (state.streak || 0) + 1;
    }
  } else if (state.lastActiveDate !== today) {
    state.streak = 1;
  }

  state.lastActiveDate = today;
}

function checkMilestones() {
  for (const milestone of MILESTONES) {
    if (state.totalRecitations >= milestone && !state.milestonesSeen.includes(milestone)) {
      state.milestonesSeen.push(milestone);
      showMilestone(milestone);
      break;
    }
  }
}

// ============================================
// CELEBRATIONS & MODALS
// ============================================

function showCelebration(completedTarget, phraseLabel) {
  const messages = [
    "MashaAllah!",
    "Beautiful!",
    "Keep going!",
    "Barakallah!",
    "Wonderful!",
  ];
  elements.celebrationSubtext.innerText = messages[Math.floor(Math.random() * messages.length)];

  if (elements.celebrationSession && settings.sessionSummary !== false) {
    const short = (phraseLabel || "").length > 40 ? `${(phraseLabel || "").slice(0, 40)}…` : phraseLabel;
    elements.celebrationSession.textContent = `You completed ${completedTarget} — ${short}`;
    elements.celebrationSession.classList.remove("hidden");
  } else if (elements.celebrationSession) {
    elements.celebrationSession.classList.add("hidden");
  }

  elements.celebration.classList.remove("hidden");

  setTimeout(() => {
    elements.celebration.classList.add("hidden");
    if (elements.celebrationSession) elements.celebrationSession.classList.add("hidden");
  }, 1800);
}

function showMilestone(value) {
  $("milestoneValue").innerText = formatNumber(value) + " Recitations!";
  elements.milestone.classList.remove("hidden");
}

function showReflectionModal() {
  elements.reflectionModal.classList.remove("hidden");
}

function saveMood(mood) {
  state.moodData.push({
    mood: mood,
    date: getToday(),
    timestamp: Date.now(),
  });
  // Keep only last 30 entries
  if (state.moodData.length > 30) {
    state.moodData = state.moodData.slice(-30);
  }
  saveState();
  elements.reflectionModal.classList.add("hidden");
}

function createRipple() {
  const ripple = elements.tapBtn.querySelector(".ripple");
  ripple.classList.remove("animate");
  void ripple.offsetWidth; // Trigger reflow
  ripple.classList.add("animate");
}

// ============================================
// MENU & SETTINGS
// ============================================

function setBodyScrollLocked(locked) {
  const v = locked ? "hidden" : "";
  document.documentElement.style.overflow = v;
  document.body.style.overflow = v;
}

function openMenu() {
  elements.menu.classList.add("open");
  elements.menuOverlay.classList.remove("hidden");
  setBodyScrollLocked(true);
}

function closeMenu() {
  elements.menu.classList.remove("open");
  elements.menuOverlay.classList.add("hidden");
  setBodyScrollLocked(false);
}

function openSettings() {
  elements.settingsPanel.scrollTop = 0;
  elements.settingsPanel.classList.add("open");
  elements.settingsOverlay.classList.remove("hidden");
  setBodyScrollLocked(true);
  loadSettingsUI();
}

function closeSettings() {
  elements.settingsPanel.classList.remove("open");
  elements.settingsOverlay.classList.add("hidden");
  setBodyScrollLocked(false);
}

function loadSettingsUI() {
  $("holdMode").checked = settings.holdMode;
  $("hapticFeedback").checked = settings.hapticFeedback;
  $("hapticStrength").value = settings.hapticStrength;
  $("hapticPattern").value = settings.hapticPattern || "each";
  $("silentMode").checked = settings.silentMode;
  $("bigNumberMode").checked = settings.bigNumberMode;
  $("reflectionMode").checked = settings.reflectionMode;
  $("focusMode").checked = !!settings.focusMode;
  $("thumbZoneMode").checked = !!settings.thumbZoneMode;
  $("readableArabic").checked = !!settings.readableArabic;
  $("sessionSummary").checked = settings.sessionSummary !== false;
  $("keepScreenAwake").checked = !!settings.keepScreenAwake;
  $("dailyReminder").checked = settings.dailyReminder;
  $("reminderTime").value = settings.reminderTime;
  $("nightReminder").checked = settings.nightReminder;

  const hapticOn = settings.hapticFeedback;
  $("hapticStrengthSetting").style.display = hapticOn ? "flex" : "none";
  $("hapticPatternSetting").style.display = hapticOn ? "flex" : "none";
  $("reminderTimeSetting").style.display = settings.dailyReminder ? "flex" : "none";

  const tid = normalizeTheme(settings.theme);
  $$(".theme-btn").forEach(btn => {
    const on = btn.dataset.theme === tid;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function getThemeColorMeta() {
  return document.querySelector('meta[name="theme-color"]');
}

function applyTheme(theme) {
  const id = normalizeTheme(theme);
  document.body.setAttribute("data-theme", id);
  settings.theme = id;
  saveSettings();

  const meta = getThemeColorMeta();
  if (meta) {
    const map = {
      "midnight-emerald": "#0B0F0E",
      "night-sky-blue": "#0A0F1C",
      "gold-black": "#000000",
      "pure-minimal": "#000000",
    };
    meta.setAttribute("content", map[id] || "#0B0F0E");
  }

  $$(".theme-btn").forEach(btn => {
    const on = btn.dataset.theme === id;
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function applyBigNumberMode(enabled) {
  document.body.classList.toggle("big-number-mode", enabled);
}

async function syncWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    if (settings.keepScreenAwake && document.visibilityState === "visible") {
      if (wakeLockSentinel) await wakeLockSentinel.release();
      wakeLockSentinel = await navigator.wakeLock.request("screen");
    } else if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch (e) {
    wakeLockSentinel = null;
  }
}

// ============================================
// EDIT TASBEEH
// ============================================

let editingTasbeeh = [];

function openEditModal() {
  editingTasbeeh = JSON.parse(JSON.stringify(tasbeehList));
  renderTasbeehEditor();
  elements.editModal.classList.remove("hidden");
  closeMenu();
}

function renderTasbeehEditor() {
  const editor = $("tasbeehEditor");
  editor.innerHTML = "";

  editingTasbeeh.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "editor-item";

    const inputsWrap = document.createElement("div");
    inputsWrap.className = "editor-inputs";

    const ar = document.createElement("input");
    ar.type = "text";
    ar.className = "editor-arabic";
    ar.placeholder = "Arabic";
    ar.value = item.text || "";
    ar.dir = "rtl";

    const tr = document.createElement("input");
    tr.type = "text";
    tr.className = "editor-translit";
    tr.placeholder = "Roman / English transliteration";
    tr.value = item.transliteration || "";

    const ur = document.createElement("input");
    ur.type = "text";
    ur.className = "editor-urdu";
    ur.placeholder = "Urdu translation";
    ur.value = item.urdu || "";
    ur.dir = "rtl";
    ur.lang = "ur";

    const num = document.createElement("input");
    num.type = "number";
    num.className = "editor-count";
    num.min = "1";
    num.max = "1000";
    num.value = String(item.target ?? 33);

    inputsWrap.append(ar, tr, ur, num);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-tasbeeh";
    del.dataset.index = String(index);
    del.setAttribute("aria-label", "Remove");
    del.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>`;

    div.append(inputsWrap, del);
    editor.appendChild(div);
  });
}

function addNewTasbeeh() {
  editingTasbeeh.push({ text: "", transliteration: "", urdu: "", target: 33 });
  renderTasbeehEditor();

  // Focus on new input
  const inputs = $$(".editor-arabic");
  inputs[inputs.length - 1]?.focus();
}

function saveEditedTasbeeh() {
  // Collect values from inputs
  $$(".editor-item").forEach((item, index) => {
    const textInput = item.querySelector(".editor-arabic");
    const translitInput = item.querySelector(".editor-translit");
    const urduInput = item.querySelector(".editor-urdu");
    const countInput = item.querySelector(".editor-count");

    editingTasbeeh[index] = {
      text: textInput.value.trim() || editingTasbeeh[index].text,
      transliteration: translitInput.value.trim() || editingTasbeeh[index].transliteration,
      urdu: urduInput ? urduInput.value.trim() : "",
      target: parseInt(countInput.value, 10) || 33,
    };
  });

  // Filter out empty entries
  tasbeehList = editingTasbeeh.filter(t => t.text && t.transliteration);

  if (tasbeehList.length === 0) {
    tasbeehList = DEFAULT_TASBEEH;
  }

  // Reset if current index is out of bounds
  if (state.currentIndex >= tasbeehList.length) {
    state.currentIndex = 0;
    state.count = 0;
  }

  saveTasbeehList();
  saveState();
  updateUI();
  elements.editModal.classList.add("hidden");
}

// ============================================
// FOCUS TIMER
// ============================================

let timerInterval = null;
let timerSeconds = 0;

function openTimerModal() {
  elements.timerModal.classList.remove("hidden");
  closeMenu();
}

function startFocusTimer(minutes) {
  timerSeconds = minutes * 60;
  elements.timerModal.classList.add("hidden");
  elements.focusTimer.classList.remove("hidden");
  elements.tapBtn.classList.add("timer-active");

  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      endFocusTimer();
      showTimerComplete();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  elements.timerDisplay.innerText = `${mins}:${secs.toString().padStart(2, "0")}`;
}

function endFocusTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  elements.focusTimer.classList.add("hidden");
  elements.tapBtn.classList.remove("timer-active");
}

function showTimerComplete() {
  elements.celebrationSubtext.innerText = "Session complete!";
  elements.celebration.querySelector(".celebration-text").innerText = "Well done!";
  elements.celebration.classList.remove("hidden");

  setTimeout(() => {
    elements.celebration.classList.add("hidden");
    elements.celebration.querySelector(".celebration-text").innerText = "Tasbeeh Completed!";
  }, 2000);

  if (settings.reflectionMode) {
    setTimeout(() => showReflectionModal(), 2100);
  }
}

// ============================================
// INSIGHTS
// ============================================

function openInsights() {
  renderInsights();
  elements.insightsModal.classList.remove("hidden");
  closeMenu();
}

function renderInsights() {
  // Weekly total
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  let weeklyTotal = 0;

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekAgo.getTime() + i * 86400000).toISOString().split("T")[0];
    weeklyTotal += state.weeklyData[date] || 0;
  }

  $("weeklyTotal").innerText = formatNumber(weeklyTotal);
  $("currentStreak").innerText = state.streak + " days";

  // Best time
  let bestHour = null;
  let maxActivity = 0;

  for (const [hour, count] of Object.entries(state.hourlyActivity)) {
    if (count > maxActivity) {
      maxActivity = count;
      bestHour = parseInt(hour);
    }
  }

  if (bestHour !== null) {
    const period = bestHour >= 12 ? "PM" : "AM";
    const displayHour = bestHour % 12 || 12;
    $("bestTime").innerText = `${displayHour} ${period}`;
  }

  // Weekly chart
  renderWeeklyChart();

  // Mood chart
  renderMoodChart();
}

function renderWeeklyChart() {
  const chartContainer = $("weeklyChart");
  chartContainer.innerHTML = "";

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    days.push(state.weeklyData[date] || 0);
  }

  const maxVal = Math.max(...days, 1);

  days.forEach((val, i) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.height = `${(val / maxVal) * 100}%`;
    bar.title = `${val} recitations`;
    if (i === 6) bar.classList.add("today");
    chartContainer.appendChild(bar);
  });
}

function renderMoodChart() {
  const moodContainer = $("moodChart");
  moodContainer.innerHTML = "";

  const moodCounts = { great: 0, calm: 0, neutral: 0, low: 0 };
  const recentMoods = state.moodData.slice(-14); // Last 2 weeks

  recentMoods.forEach(m => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const total = recentMoods.length || 1;
  const moodEmojis = { great: "😊", calm: "😌", neutral: "😐", low: "😔" };

  for (const [mood, count] of Object.entries(moodCounts)) {
    const item = document.createElement("div");
    item.className = "mood-item";
    item.innerHTML = `
      <span class="mood-emoji">${moodEmojis[mood]}</span>
      <div class="mood-bar-container">
        <div class="mood-bar" style="width: ${(count / total) * 100}%"></div>
      </div>
      <span class="mood-count">${count}</span>
    `;
    moodContainer.appendChild(item);
  }
}

// ============================================
// HOLD MODE
// ============================================

let holdInterval = null;

function setupHoldMode() {
  elements.tapBtn.addEventListener("mousedown", startHold);
  elements.tapBtn.addEventListener("touchstart", startHold);
  elements.tapBtn.addEventListener("mouseup", endHold);
  elements.tapBtn.addEventListener("touchend", endHold);
  elements.tapBtn.addEventListener("mouseleave", endHold);
}

function startHold(e) {
  if (!settings.holdMode) return;
  e.preventDefault();

  holdInterval = setInterval(() => {
    incrementCount();
  }, 200);
}

function endHold() {
  if (holdInterval) {
    clearInterval(holdInterval);
    holdInterval = null;
  }
}

// ============================================
// NOTIFICATIONS
// ============================================

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function scheduleReminders() {
  // This would typically use service worker for background notifications
  // For now, we'll show a simple reminder when the app is open

  if (settings.dailyReminder) {
    const [hours, minutes] = settings.reminderTime.split(":").map(Number);
    const now = new Date();
    const reminderTime = new Date(now);
    reminderTime.setHours(hours, minutes, 0, 0);

    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeout = reminderTime - now;
    setTimeout(() => {
      showNotification("Time for Zikr", "Take 2 minutes for your tasbeeh");
    }, timeout);
  }
}

function showNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/icon-192.png" });
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Main tap
  elements.tapBtn.addEventListener("click", (e) => {
    if (!settings.holdMode) {
      incrementCount();
    }
  });

  // Menu
  elements.menuBtn.addEventListener("click", openMenu);
  elements.closeMenu.addEventListener("click", closeMenu);
  elements.menuOverlay.addEventListener("click", closeMenu);

  // Settings
  elements.settingsBtn.addEventListener("click", openSettings);
  $("closeSettings").addEventListener("click", closeSettings);
  $("settingsOverlay").addEventListener("click", closeSettings);

  // Flow mode
  $$('input[name="flowMode"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      settings.flowMode = e.target.value;
      saveSettings();
      updateFlowModeIndicator();
    });
  });

  // Theme buttons
  $$(".theme-btn").forEach(btn => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  // Settings toggles
  $("holdMode").addEventListener("change", (e) => {
    settings.holdMode = e.target.checked;
    if (settings.holdMode) lastUndo = null;
    elements.tapBtn.querySelector(".tap-text").innerText = settings.holdMode ? "Hold" : "Tap";
    updateUndoButton();
    saveSettings();
  });

  $("hapticFeedback").addEventListener("change", (e) => {
    settings.hapticFeedback = e.target.checked;
    const on = e.target.checked;
    $("hapticStrengthSetting").style.display = on ? "flex" : "none";
    $("hapticPatternSetting").style.display = on ? "flex" : "none";
    saveSettings();
  });

  $("hapticPattern").addEventListener("change", (e) => {
    settings.hapticPattern = e.target.value;
    saveSettings();
  });

  $("hapticStrength").addEventListener("input", (e) => {
    settings.hapticStrength = parseInt(e.target.value, 10);
    saveSettings();
  });

  $("silentMode").addEventListener("change", (e) => {
    settings.silentMode = e.target.checked;
    saveSettings();
  });

  $("bigNumberMode").addEventListener("change", (e) => {
    settings.bigNumberMode = e.target.checked;
    applyBigNumberMode(e.target.checked);
    saveSettings();
  });

  $("reflectionMode").addEventListener("change", (e) => {
    settings.reflectionMode = e.target.checked;
    saveSettings();
  });

  $("focusMode").addEventListener("change", (e) => {
    settings.focusMode = e.target.checked;
    applyExperienceModes();
    saveSettings();
  });

  $("thumbZoneMode").addEventListener("change", (e) => {
    settings.thumbZoneMode = e.target.checked;
    applyExperienceModes();
    saveSettings();
  });

  $("readableArabic").addEventListener("change", (e) => {
    settings.readableArabic = e.target.checked;
    applyExperienceModes();
    saveSettings();
  });

  $("sessionSummary").addEventListener("change", (e) => {
    settings.sessionSummary = e.target.checked;
    saveSettings();
  });

  $("keepScreenAwake").addEventListener("change", async (e) => {
    settings.keepScreenAwake = e.target.checked;
    saveSettings();
    await syncWakeLock();
  });

  elements.undoBtn.addEventListener("click", () => undoLastTap());

  $$(".quick-target-chip").forEach((btn) => {
    btn.addEventListener("click", () => applyQuickTarget(btn.dataset.target));
  });

  $("ayatOfDayBtn").addEventListener("click", openAyatOfDayModal);
  $("closeAyatModal").addEventListener("click", closeAyatOfDayModal);
  $("hadithOfDayBtn").addEventListener("click", openHadithOfDayModal);
  $("closeHadithModal").addEventListener("click", closeHadithOfDayModal);

  $("dailyReminder").addEventListener("change", (e) => {
    settings.dailyReminder = e.target.checked;
    $("reminderTimeSetting").style.display = e.target.checked ? "flex" : "none";
    if (e.target.checked) requestNotificationPermission();
    saveSettings();
  });

  $("reminderTime").addEventListener("change", (e) => {
    settings.reminderTime = e.target.value;
    saveSettings();
  });

  $("nightReminder").addEventListener("change", (e) => {
    settings.nightReminder = e.target.checked;
    if (e.target.checked) requestNotificationPermission();
    saveSettings();
  });

  $("openThemeFromMenu").addEventListener("click", () => {
    closeMenu();
    openSettings();
  });

  $("resetDataBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      localStorage.clear();
      location.reload();
    }
  });

  // Edit Modal
  $("editTasbeehBtn").addEventListener("click", openEditModal);
  $("closeEditModal").addEventListener("click", () => elements.editModal.classList.add("hidden"));
  $("cancelEdit").addEventListener("click", () => elements.editModal.classList.add("hidden"));
  $("saveEdit").addEventListener("click", saveEditedTasbeeh);
  $("addTasbeehBtn").addEventListener("click", addNewTasbeeh);

  // Editor delegation
  $("tasbeehEditor").addEventListener("click", (e) => {
    if (e.target.closest(".delete-tasbeeh")) {
      const index = parseInt(e.target.closest(".delete-tasbeeh").dataset.index);
      editingTasbeeh.splice(index, 1);
      renderTasbeehEditor();
    }
  });

  // Timer Modal
  $("focusTimerBtn").addEventListener("click", openTimerModal);
  $("cancelTimer").addEventListener("click", () => elements.timerModal.classList.add("hidden"));
  $("timerStop").addEventListener("click", endFocusTimer);

  $$(".timer-option").forEach(btn => {
    btn.addEventListener("click", () => startFocusTimer(parseInt(btn.dataset.minutes)));
  });

  // Insights
  $("insightsBtn").addEventListener("click", openInsights);
  $("closeInsights").addEventListener("click", () => elements.insightsModal.classList.add("hidden"));

  // Reflection
  $$(".mood-btn").forEach(btn => {
    btn.addEventListener("click", () => saveMood(btn.dataset.mood));
  });
  $("skipReflection").addEventListener("click", () => elements.reflectionModal.classList.add("hidden"));

  // Milestone
  $("milestoneClose").addEventListener("click", () => {
    elements.milestone.classList.add("hidden");
    saveState();
  });

  // Close modals on overlay click
  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        if (modal.id === "ayatModal" || modal.id === "hadithModal") {
          setBodyScrollLocked(false);
        }
      }
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && settings.keepScreenAwake) {
      syncWakeLock();
    }
  });

  // Keyboard shortcut
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !e.target.matches("input, textarea, select")) {
      e.preventDefault();
      incrementCount();
    }
    if (
      (e.key === "z" || e.key === "Z") &&
      (e.metaKey || e.ctrlKey) &&
      !e.target.matches("input, textarea, select")
    ) {
      e.preventDefault();
      undoLastTap();
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
  // Set up progress circle
  elements.progressCircle.style.strokeDasharray = circumference;

  // Apply saved theme
  applyTheme(settings.theme);

  // Apply big number mode if enabled
  if (settings.bigNumberMode) {
    applyBigNumberMode(true);
  }

  // Update hold mode button text
  if (settings.holdMode) {
    elements.tapBtn.querySelector(".tap-text").innerText = "Hold";
  }

  // Set flow mode radio (avoid throwing — otherwise no click handlers run)
  const flowVal = ["sequential", "single", "random"].includes(settings.flowMode)
    ? settings.flowMode
    : "sequential";
  if (settings.flowMode !== flowVal) {
    settings.flowMode = flowVal;
    saveSettings();
  }
  const flowRadio = document.querySelector(`input[name="flowMode"][value="${flowVal}"]`);
  if (flowRadio) flowRadio.checked = true;

  applyExperienceModes();

  // Initial render
  updateUI();

  // Setup events
  setupEventListeners();
  setupHoldMode();
  setupHeaderScroll();

  // Schedule reminders
  scheduleReminders();

  setupInstallPrompt();

  if (settings.keepScreenAwake) {
    syncWakeLock();
  }
}

function isStandalonePWA() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function setupHeaderScroll() {
  const header = elements.header;
  if (!header) return;

  const scrollY = () => {
    const root = document.scrollingElement;
    if (root) return root.scrollTop;
    return window.scrollY || document.documentElement.scrollTop || 0;
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    header.classList.toggle("header--scrolled", scrollY() > 8);
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function setupInstallPrompt() {
  if (isStandalonePWA()) return;
  if (localStorage.getItem("pwaInstallDismissed") === "1") return;

  const modal = $("installPromptModal");
  const bodyEl = $("installPromptBody");
  const btnInstall = $("installPromptInstall");
  const btnDismiss = $("installPromptDismiss");
  if (!modal || !bodyEl || !btnInstall || !btnDismiss) return;

  let deferredPrompt = null;
  let iosTimer = null;

  const closeModal = () => {
    modal.classList.add("hidden");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  const dismiss = () => {
    if (iosTimer) {
      clearTimeout(iosTimer);
      iosTimer = null;
    }
    closeModal();
    localStorage.setItem("pwaInstallDismissed", "1");
  };

  const openModal = () => {
    modal.classList.remove("hidden");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (iosTimer) {
      clearTimeout(iosTimer);
      iosTimer = null;
    }
    bodyEl.textContent =
      "Install Tasbeeh on your home screen for quick access and a calm, full-screen experience.";
    btnInstall.classList.remove("hidden");
    openModal();
  });

  if (isIOS && !window.navigator.standalone) {
    btnInstall.classList.add("hidden");
    bodyEl.innerHTML =
      "To install on iPhone or iPad: tap <strong>Share</strong> in the toolbar, then <strong>Add to Home Screen</strong>.";
    iosTimer = window.setTimeout(() => {
      if (localStorage.getItem("pwaInstallDismissed") === "1") return;
      openModal();
    }, 2800);
  }

  btnInstall.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btnInstall.classList.add("hidden");
    dismiss();
  });

  btnDismiss.addEventListener("click", dismiss);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) dismiss();
  });

  window.addEventListener("appinstalled", () => {
    if (iosTimer) clearTimeout(iosTimer);
    closeModal();
    localStorage.setItem("pwaInstallDismissed", "1");
  });
}

// Migration: Clear old data format if needed
function migrateData() {
  const version = localStorage.getItem("tasbeehVersion");

  if (version !== "2" && version !== "3") {
    localStorage.clear();
    localStorage.setItem("tasbeehVersion", "3");
    localStorage.setItem("tasbeehContentVersion", TASBEEH_CONTENT_VERSION);
    state = createFreshState(getToday());
    tasbeehList = DEFAULT_TASBEEH.map((item) => ({ ...item }));
    localStorage.setItem("tasbeehList", JSON.stringify(tasbeehList));
    saveState();
    settings = loadSettings();
    return;
  }

  if (version === "2") {
    localStorage.setItem("tasbeehVersion", "3");
  }

  upgradeTasbeehContentIfNeeded();
}

function upgradeTasbeehContentIfNeeded() {
  if (localStorage.getItem("tasbeehContentVersion") === TASBEEH_CONTENT_VERSION) {
    return;
  }
  tasbeehList = DEFAULT_TASBEEH.map((item) => ({ ...item }));
  localStorage.setItem("tasbeehList", JSON.stringify(tasbeehList));
  localStorage.setItem("tasbeehContentVersion", TASBEEH_CONTENT_VERSION);
  if (state.currentIndex >= tasbeehList.length) {
    state.currentIndex = 0;
    state.count = 0;
  }
  saveState();
}

// Service worker — register and check for updates so new assets load
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then((reg) => {
    reg.update();
  });
}

// Start app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    migrateData();
    init();
  });
} else {
  migrateData();
  init();
}
