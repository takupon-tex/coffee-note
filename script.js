// ローカルストレージキー
const STORAGE_KEY = "coffeeBrews";

// DOM取得
const brewListEl = document.getElementById("brewList");
const cupCountEl = document.getElementById("cupCount");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const overlayEl = document.getElementById("brewFormOverlay");
const brewForm = document.getElementById("brewForm");

// 初期データ（初回のみ使う）
const defaultBrews = [
  {
    name: "Ethiopia Yirgacheffe",
    roaster: "Coffee Collective",
    method: "V60",
    rating: 5,
    notes: ["Floral", "Citrus", "Honey"],
    date: "2023-10-27",
  },
  {
    name: "Kenya AA",
    roaster: "Coffee Collective",
    method: "V60",
    rating: 4,
    notes: ["Floral", "Citrus"],
    date: "2023-10-25",
  },
  {
    name: "Kenya AA",
    roaster: "Fuglen",
    method: "Aeropress",
    rating: 5,
    notes: ["Plum", "Juicy", "Blackcurrant", "Honey"],
    date: "2023-10-20",
  },
];

// データ取得
function loadBrews() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultBrews;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return defaultBrews;
  } catch {
    return defaultBrews;
  }
}

// データ保存
function saveBrews(brews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(brews));
}

// レーティングの★表示
function renderStars(rating) {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return full + empty;
}

// カード描画
function renderBrews() {
  const brews = loadBrews().slice().reverse(); // 新しい順で表示
  brewListEl.innerHTML = "";

  let monthCount = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  brews.forEach((brew) => {
    const card = document.createElement("article");
    card.className = "brew-card";

    // 日付をDateにパースして今月カウント
    if (brew.date) {
      const d = new Date(brew.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        monthCount++;
      }
    }

    const notes = Array.isArray(brew.notes)
      ? brew.notes
      : typeof brew.notes === "string"
      ? brew.notes.split(",").map((n) => n.trim()).filter(Boolean)
      : [];

    card.innerHTML = `
      <
