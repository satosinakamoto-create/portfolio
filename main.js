/* ============================================================
   ZAKI Portfolio — main.js
   構成:
     1. Loader
     2. Custom Cursor
     3. Progress Bar
     4. Navigation (scroll + active link)
     5. Scroll Reveal
     6. Count Up Animation
     7. Work Filter
     8. Mobile Menu
     9. Smooth Scroll
    10. Init
   ============================================================ */

/* ============================================================
   1. LOADER
   ページ読み込み時に文字が1文字ずつ表示されるアニメーション
   ============================================================ */
function initLoader() {
  const loaderEl = document.getElementById("loader");
  const textEl = document.getElementById("loader-text");
  const word = "ZAKI.DEV";
  const charDelay = 60; // 文字ごとの遅延 (ms)
  const hideDelay = 1800; // ローダーを消すまでの時間 (ms)

  // 1文字ずつ span を生成して追加
  word.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.className = "loader-char";
    span.textContent = char;
    textEl.appendChild(span);

    // 少し遅らせてスライドイン
    setTimeout(() => span.classList.add("in"), 100 + index * charDelay);
  });

  // 一定時間後にローダーをフェードアウト
  setTimeout(() => loaderEl.classList.add("done"), hideDelay);
}

/* ============================================================
   2. CUSTOM CURSOR
   マウスに追従するカスタムカーソル。
   ドットは即時追従、リングはゆっくり追従（ラグ感を演出）。
   ============================================================ */
function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  // 現在のマウス座標
  let mouseX = 0;
  let mouseY = 0;

  // リングの補間座標
  let ringX = 0;
  let ringY = 0;

  // マウス移動でドットをすぐに追従
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  // リングはなめらかに補間しながら追従
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // インタラクティブな要素に hover 時はカーソルを変形
  const hoverTargets = document.querySelectorAll(
    "a, button, .work-item, .stat, .filter-btn",
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      document.body.classList.add("cursor-hover"),
    );
    el.addEventListener("mouseleave", () =>
      document.body.classList.remove("cursor-hover"),
    );
  });
}

/* ============================================================
   3. PROGRESS BAR
   ページをスクロールした割合をバーで表示
   ============================================================ */
function initProgressBar() {
  const bar = document.getElementById("progress-bar");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    bar.style.width = scrollPercent + "%";
  });
}

/* ============================================================
   4. NAVIGATION
   - スクロールで背景を表示
   - 現在表示中のセクションのリンクをアクティブにする
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-links a[data-section]");
  const sections = document.querySelectorAll("section[id]");

  // スクロール量に応じてナビの背景を切り替え
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 60);
  });

  // IntersectionObserver でセクションの表示を検知してアクティブリンクを切り替え
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // 全リンクをリセットしてアクティブなものだけ強調
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(
          `.nav-links a[data-section="${entry.target.id}"]`,
        );
        if (activeLink) activeLink.classList.add("active");
      });
    },
    { threshold: 0.3 },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   5. SCROLL REVEAL
   .reveal クラスを持つ要素が画面内に入ったらフェードインで表示
   ============================================================ */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // 一度表示したら監視を外す
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px", // 画面下端より少し上で発火
    },
  );

  targets.forEach((el) => observer.observe(el));
}

/* ============================================================
   6. COUNT UP ANIMATION
   [data-count] を持つ要素が画面に入ったら数字をカウントアップ
   data-suffix に文字列を指定すると数字の後に付与（例: "+"）
   ============================================================ */
function initCountUp() {
  const targets = document.querySelectorAll("[data-count]");

  function countUp(el, targetNum, duration = 1000) {
    const suffix = el.dataset.suffix || "";
    const steps = duration / 16; // 約60fps
    const increment = targetNum / steps;
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(current + increment, targetNum);
      el.textContent = Math.floor(current) + suffix;

      if (current >= targetNum) clearInterval(timer);
    }, 16);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = Number(entry.target.dataset.count);
        countUp(entry.target, target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  targets.forEach((el) => observer.observe(el));
}

/* ============================================================
   7. WORK FILTER
   フィルターボタンのクリックで作品カードを絞り込み表示
   ============================================================ */
function initWorkFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const workItems = document.querySelectorAll(".work-item, .work-featured");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedFilter = btn.dataset.filter;

      // アクティブボタンを切り替え
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // カテゴリが一致する作品のみ表示
      workItems.forEach((item) => {
        const category = item.dataset.category;
        const isVisible =
          selectedFilter === "all" || category === selectedFilter;
        item.classList.toggle("hidden", !isVisible);
      });
    });
  });
}

/* ============================================================
   8. BEFORE / AFTER SLIDER
   .before-after-wrap の中でドラッグ or タッチで
   Before/Afterの境界線を動かすインタラクション。
   ============================================================ */
function initBeforeAfter() {
  const wraps = document.querySelectorAll(
    ".work-item-wide-img.before-after-wrap",
  );

  wraps.forEach((wrap) => {
    const before = wrap.querySelector(".ba-before");
    const handle = wrap.querySelector(".ba-handle");
    if (!before || !handle) return;

    let isDragging = false;
    let dragMoved = false;

    function setPosition(ratio) {
      const pct = Math.min(Math.max(ratio * 100, 0), 100);
      before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      handle.style.left = pct + "%";
    }

    function getRatio(clientX) {
      const rect = wrap.getBoundingClientRect();
      return (clientX - rect.left) / rect.width;
    }

    handle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDragging = true;
      dragMoved = false;
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      dragMoved = true;
      setPosition(getRatio(e.clientX));
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // ドラッグ後にclickが発火しないよう抑制
    wrap.addEventListener(
      "click",
      (e) => {
        if (dragMoved) {
          e.stopPropagation();
          dragMoved = false;
        }
      },
      true,
    );

    handle.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
        isDragging = true;
        dragMoved = false;
      },
      { passive: true },
    );
    document.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        dragMoved = true;
        setPosition(getRatio(e.touches[0].clientX));
      },
      { passive: true },
    );
    document.addEventListener("touchend", () => {
      isDragging = false;
    });
  });
}

/* ============================================================
   9. BEFORE/AFTER LIGHTBOX (撮影3セット＋空間デザイン対応)
   openBeforeAfterLightbox('photo')   → 撮影ディレクション（3セット切り替え）
   openBeforeAfterLightbox('spatial') → 空間デザイン（単体）
   ============================================================ */
function initBeforeAfterLightbox() {
  let currentSet = 0;
  let activeSets = BA_SETS;

  function setBaPosition(ratio) {
    const wrap = document.getElementById("lb-ba-wrap");
    const before = document.getElementById("lb-ba-before");
    const handle = wrap.querySelector(".ba-handle");
    const pct = Math.min(Math.max(ratio * 100, 0), 100);
    before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + "%";
  }

  (function () {
    let dragging = false;
    function lbRatio(clientX) {
      const w = document.getElementById("lb-ba-wrap");
      if (!w) return 0.5;
      const r = w.getBoundingClientRect();
      return (clientX - r.left) / r.width;
    }
    function lbHandle() {
      const w = document.getElementById("lb-ba-wrap");
      return w ? w.querySelector(".ba-handle") : null;
    }
    document.addEventListener("mousedown", (e) => {
      const h = lbHandle();
      if (h && h.contains(e.target)) {
        e.preventDefault();
        dragging = true;
      }
    });
    document.addEventListener("mousemove", (e) => {
      if (dragging) setBaPosition(lbRatio(e.clientX));
    });
    document.addEventListener("mouseup", () => {
      dragging = false;
    });
    document.addEventListener(
      "touchstart",
      (e) => {
        const h = lbHandle();
        if (h && h.contains(e.target)) dragging = true;
      },
      { passive: true },
    );
    document.addEventListener(
      "touchmove",
      (e) => {
        if (dragging) setBaPosition(lbRatio(e.touches[0].clientX));
      },
      { passive: true },
    );
    document.addEventListener("touchend", () => {
      dragging = false;
    });
  })();

  // サムネイル一覧を描画（通常ギャラリーと同じデザイン）
  function renderThumbs() {
    const thumbsEl = document.getElementById("lb-ba-thumbs");
    if (!thumbsEl) return;
    thumbsEl.innerHTML = "";

    activeSets.forEach((set, i) => {
      // After 画像をサムネイルに使用
      const isPlaceholder = set.after.startsWith("YOUR_") || !set.after;

      if (isPlaceholder) {
        const ph = document.createElement("div");
        ph.className = `lightbox-thumb-ph${i === currentSet ? " active" : ""}`;
        ph.textContent = String(i + 1);
        ph.onclick = () => loadSet(i);
        thumbsEl.appendChild(ph);
      } else {
        const thumb = document.createElement("img");
        thumb.className = `lightbox-thumb${i === currentSet ? " active" : ""}`;
        thumb.src = set.after;
        thumb.alt = set.title;
        thumb.onclick = () => loadSet(i);
        thumbsEl.appendChild(thumb);
      }
    });
  }

  function loadSet(index) {
    currentSet = index;
    const set = activeSets[index];
    const before = document.getElementById("lb-ba-before");
    const after = document.getElementById("lb-ba-after");

    before.style.opacity = "0";
    after.style.opacity = "0";

    setTimeout(() => {
      before.src = set.before;
      after.src = set.after;
      before.style.clipPath = "inset(0 50% 0 0)";
      setBaPosition(0.5);
      before.style.opacity = "1";
      after.style.opacity = "1";
    }, 150);

    // セットボタンのアクティブ状態
    document.querySelectorAll(".ba-set-btn").forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });

    // サムネイルのアクティブ状態
    document
      .querySelectorAll(
        "#lb-ba-thumbs .lightbox-thumb, #lb-ba-thumbs .lightbox-thumb-ph",
      )
      .forEach((el, i) => el.classList.toggle("active", i === index));

    document.getElementById("lb-ba-caption").textContent = set.title;
    document.getElementById("lb-ba-counter").textContent =
      `${index + 1} / ${activeSets.length}`;

    const prevBtn = document.getElementById("lb-ba-prev");
    const nextBtn = document.getElementById("lb-ba-next");
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === activeSets.length - 1;
  }

  // type: 'photo' または 'spatial'
  // photo の場合: カードの data-ba-sets 属性から画像セットを読み取る（HTML で一括管理）
  // spatial の場合: カード内の img src を動的に読み取る
  window.openBeforeAfterLightbox = function (type = "photo") {
    if (type === "photo") {
      // HTML の data-ba-sets から読み込む
      const card = document.querySelector(".expandable-ba[data-ba-sets]");
      const rawSets = card ? card.dataset.baSets : null;
      if (rawSets) {
        try {
          const parsed = JSON.parse(rawSets);
          // BA_SETS を HTML の値で上書き
          parsed.forEach((s, i) => {
            if (BA_SETS[i]) {
              BA_SETS[i].title = s.title || BA_SETS[i].title;
              BA_SETS[i].before = s.before || BA_SETS[i].before;
              BA_SETS[i].after = s.after || BA_SETS[i].after;
            }
          });
        } catch (e) {
          console.warn("data-ba-sets の JSON が不正です:", e);
        }
      }
    }

    if (type === "spatial") {
      // カード内の img src を動的に読み取る
      const card = document.querySelector(
        '.work-item-wide[data-category="spatial"]',
      );
      const afterEl = card ? card.querySelector(".ba-after") : null;
      const beforeEl = card ? card.querySelector(".ba-before") : null;
      BA_SPATIAL_SETS[0].after =
        afterEl && afterEl.src ? afterEl.src : BA_SPATIAL_SETS[0].after;
      BA_SPATIAL_SETS[0].before =
        beforeEl && beforeEl.src ? beforeEl.src : BA_SPATIAL_SETS[0].before;
    }

    activeSets = type === "spatial" ? BA_SPATIAL_SETS : BA_SETS;
    currentSet = 0;

    // 単体セット（空間）は前後ボタンを非表示
    const prevBtn = document.getElementById("lb-ba-prev");
    const nextBtn = document.getElementById("lb-ba-next");
    if (prevBtn)
      prevBtn.style.visibility = activeSets.length <= 1 ? "hidden" : "";
    if (nextBtn)
      nextBtn.style.visibility = activeSets.length <= 1 ? "hidden" : "";

    renderThumbs();
    document.getElementById("lb-ba").classList.add("open");
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
    loadSet(0);
  };

  window.closeLbBa = function () {
    document.getElementById("lb-ba").classList.remove("open");
    document.body.classList.remove("lightbox-open"); // ← カーソルを黒に戻す
    document.body.style.overflow = "";
  };

  window.closeLbBaOnBackdrop = function (e) {
    if (e.target === document.getElementById("lb-ba")) closeLbBa();
  };

  window.prevBaSet = function () {
    if (currentSet > 0) loadSet(currentSet - 1);
  };

  window.nextBaSet = function () {
    if (currentSet < activeSets.length - 1) loadSet(currentSet + 1);
  };

  window.loadSetPublic = function (index) {
    loadSet(index);
  };

  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("lb-ba");
    if (!lb.classList.contains("open")) return;
    if (e.key === "ArrowLeft") prevBaSet();
    if (e.key === "ArrowRight") nextBaSet();
    if (e.key === "Escape") closeLbBa();
  });
}

/* ============================================================
   10. LIGHTBOX GALLERY
   クリックで作品画像を拡大表示するギャラリー機能。
   openGallery('poster') / openGallery('menu') で呼び出す。
   画像をCloudinaryにアップ後、下の GALLERY_DATA のURLを差し替える。
   ============================================================ */

// ── 画像データ ────────────────────────────────
// 画像はローカルの場合: images/{カテゴリ}/{ファイル名}
// Cloudinaryの場合:    https://res.cloudinary.com/...
const GALLERY_DATA = {
  // Webアプリ スクリーンショット（単体）
  "manga-app": [
    {
      src: "images/web/スクリーンショット 2026-03-27 190559.png",
      caption: "自炊漫画リーダー — トップ画面",
    },
    {
      src: "images/web/スクリーンショット 2026-03-28 232713.png",
      caption: "自炊漫画リーダー — ライブラリ画面",
    },
    {
      src: "images/web/スクリーンショット 2026-03-28 232804.png",
      caption: "自炊漫画リーダー — 閲覧画面",
    },
  ],
  // 店舗HP スクリーンショット（単体）
  "store-hp": [
    {
      src: "images/web/slide2.jpg",
      caption: "店舗Webサイト — スクリーンショット",
    },
  ],
  poster: [
    {
      src: "images/poster/poster_01_takoyaki-a1.jpg",
      caption: "A1ポスター — 米粉のたこ焼き",
    },
    {
      src: "images/poster/poster_02_shufuku.jpg",
      caption: "A1ポスター — 至福の一品 2023-2024",
    },
    {
      src: "images/poster/poster_03_grand-menu.jpg",
      caption: "A1ポスター — グランドメニュー お品書き一例",
    },
  ],
  menu: [
    {
      src: "images/menu/menu_01_grand-inside.jpg",
      caption: "グランドメニュー — 中面",
    },
    {
      src: "images/menu/menu_02_grand-outside.jpg",
      caption: "グランドメニュー — 外面",
    },
  ],
  logo: [
    {
      src: "images/logo/logo_01_takosuke-v1.jpg",
      caption: "ロゴデザイン — たこ助 バリエーション案 Vol.1",
    },
    {
      src: "images/logo/logo_02_takosuke-v2.jpg",
      caption: "ロゴデザイン — たこ助 バリエーション案 Vol.2",
    },
  ],
};

// Before/After ライトボックス用 — 撮影ディレクション 3セット
const BA_SETS = [
  {
    title: "セット 1 / 3",
    before: "images/Direction/DSC02973.JPG", // レタッチ前
    after: "images/Direction/co_DSC02973.jpg", // レタッチ後
  },
  {
    title: "セット 2 / 3",
    before: "images/Direction/DSC03327.JPG",
    after: "images/Direction/co_DSC03327.jpg",
  },
  {
    title: "セット 3 / 3",
    before: "images/Direction/DSC03561.JPG",
    after: "images/Direction/co_DSC03561.jpg",
  },
];

// Before/After ライトボックス用 — 空間デザイン
// 複数セットに増やしたい場合は配列に追加してください
const BA_SPATIAL_SETS = [
  {
    title: "空間デザイン",
    before: "images/spatial/spatial_before.jpg",
    after: "images/spatial/spatial_after.jpg",
  },
];
// ─────────────────────────────────────────────

// 現在表示中のギャラリーと画像インデックスを管理
let currentGallery = [];
let currentIndex = 0;

function initLightbox() {
  // グローバルに公開してHTMLのonclickから呼べるようにする
  window.openGallery = function (key) {
    currentGallery = GALLERY_DATA[key] || [];
    currentIndex = 0;

    if (currentGallery.length === 0) return;

    renderLightbox();
    document.getElementById("lightbox").classList.add("open");
    document.body.classList.add("lightbox-open"); // ← カーソルを白に

    // スクロール禁止
    document.body.style.overflow = "hidden";
  };

  window.closeLightbox = function () {
    document.getElementById("lightbox").classList.remove("open");
    document.body.classList.remove("lightbox-open"); // ← カーソルを黒に戻す
    document.body.style.overflow = "";
  };

  // 背景クリックで閉じる
  window.closeLightboxOnBackdrop = function (e) {
    if (e.target === document.getElementById("lightbox")) {
      closeLightbox();
    }
  };

  window.prevImage = function () {
    currentIndex =
      (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxImage();
  };

  window.nextImage = function () {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxImage();
  };

  // キーボード操作
  document.addEventListener("keydown", (e) => {
    const lb = document.getElementById("lightbox");
    if (!lb.classList.contains("open")) return;

    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "Escape") closeLightbox();
  });
}

// ライトボックスを初期描画
function renderLightbox() {
  const item = currentGallery[currentIndex];
  const img = document.getElementById("lightbox-img");
  const thumbsEl = document.getElementById("lightbox-thumbs");

  // メイン画像
  img.src = item.src;

  // カウンターとキャプション
  document.getElementById("lightbox-counter").textContent =
    `${currentIndex + 1} / ${currentGallery.length}`;
  document.getElementById("lightbox-caption").textContent = item.caption;

  // サムネイル一覧を生成
  thumbsEl.innerHTML = "";
  currentGallery.forEach((galleryItem, i) => {
    // CloudinaryのURLが設定されていれば img、未設定ならプレースホルダー
    const isPlaceholder = galleryItem.src.startsWith("YOUR_");

    if (isPlaceholder) {
      // プレースホルダー表示
      const ph = document.createElement("div");
      ph.className = `lightbox-thumb-ph${i === currentIndex ? " active" : ""}`;
      ph.textContent = `${i + 1}`;
      ph.onclick = () => jumpToImage(i);
      thumbsEl.appendChild(ph);
    } else {
      // サムネイル画像
      const thumb = document.createElement("img");
      thumb.className = `lightbox-thumb${i === currentIndex ? " active" : ""}`;
      thumb.src = galleryItem.src;
      thumb.alt = galleryItem.caption;
      thumb.onclick = () => jumpToImage(i);
      thumbsEl.appendChild(thumb);
    }
  });
}

// 画像切り替え（フェードアニメーション付き）
function updateLightboxImage() {
  const img = document.getElementById("lightbox-img");

  img.classList.add("fade");

  setTimeout(() => {
    const item = currentGallery[currentIndex];
    img.src = item.src;
    img.classList.remove("fade");

    // カウンターとキャプション更新
    document.getElementById("lightbox-counter").textContent =
      `${currentIndex + 1} / ${currentGallery.length}`;
    document.getElementById("lightbox-caption").textContent = item.caption;

    // サムネイルのアクティブ状態を更新
    document
      .querySelectorAll(".lightbox-thumb, .lightbox-thumb-ph")
      .forEach((el, i) => {
        el.classList.toggle("active", i === currentIndex);
      });
  }, 200);
}

// サムネイルクリックで直接ジャンプ
function jumpToImage(index) {
  currentIndex = index;
  updateLightboxImage();
}

/* ============================================================
   9. MOBILE MENU
   ハンバーガーボタンでフルスクリーンメニューを開閉
   ============================================================ */
function initMobileMenu() {
  // グローバルに公開して HTML の onclick から呼べるようにする
  window.toggleMobileMenu = function () {
    const nav = document.getElementById("nav");
    const menu = document.getElementById("mobile-menu");
    const burger = document.getElementById("burger");
    const isOpen = menu.classList.toggle("open");

    nav.classList.toggle("menu-open", isOpen);
    burger.setAttribute("aria-expanded", isOpen);
    burger.setAttribute(
      "aria-label",
      isOpen ? "メニューを閉じる" : "メニューを開く",
    );
  };

  window.closeMobileMenu = function () {
    const nav = document.getElementById("nav");
    const menu = document.getElementById("mobile-menu");
    const burger = document.getElementById("burger");

    menu.classList.remove("open");
    nav.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "メニューを開く");
  };
}

/* ============================================================
   9. SMOOTH SCROLL
   ページ内リンク（#anchor）のスムーズスクロール
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetSelector = anchor.getAttribute("href");
      const targetEl = document.querySelector(targetSelector);

      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ============================================================
   10. INIT
   DOMが読み込まれてから全機能を起動
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initCursor();
  initProgressBar();
  initNavigation();
  initScrollReveal();
  initCountUp();
  initWorkFilter();
  initBeforeAfter();
  initBeforeAfterLightbox();
  initLightbox();
  initMobileMenu();
  initSmoothScroll();
});
