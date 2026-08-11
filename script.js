/* ==========================================================================
   CHANGE THESE ONLY (CUSTOMIZATION CONFIGURATION)
   ========================================================================== */
const CONFIG = {
  // Girlfriend's Name & Nickname
  girlfriendName: "Sanu",
  nickname: "My Princess",

  // Birthday Date (YYYY-MM-DD)
  birthdayDate: "2026-08-17",

  // Relationship Start Date (YYYY-MM-DDTHH:MM:SS)
  relationshipStartDate: "2026-06-06T00:00:00",

  // Background Music URL (Romantic MP3)
  bgMusicUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",

  // Handwritten Birthday Letter
  letterText: `My Dearest Sanu,

Happy Birthday to the one who stole my heart and transformed my world into something infinitely beautiful. 

Every single moment by your side feels like a dream I never want to wake up from. Your laughter is my favorite melody, your smile is my brightest light, and your kind soul inspires me every day.

On this special day, I want to remind you how deeply and endlessly you are loved. May this year bring you endless joy, laughter, and all the magical moments your heart desires.

Forever & Always Yours ❤️`,

  // Memory Gallery Items
  memories: [
    {
      title: "2nd meet",
      date: "Jul 4, 2026",
      desc: "First time dropping you.",
      image: "1.jpg"
    },
    {
      title: "Clicking randoms pics",
      date: "Aug 9, 2026",
      desc: "Warm Hugs, endless laughs, and butterflies in my chest.",
      image: "2.jpeg"
    },
    {
      title: "Kissing",
      date: "Aug 9, 2026",
      desc: "Holding hands kissing & comforting eachother.",
      image: "3.jpeg"
    },
    {
      title: "Trying to something new",
      date: "Aug 9, 2026",
      desc: "Enjoying every moment with eachother.",
      image: "4.jpg"
    },
    {
      title: "Worlcup meet",
      date: "Jul 6, 2026",
      desc: "1st kiss ",
      image: "5.jpg"
    }
  ],

  // 30 Reasons Why I Love You
  reasons: [
    "You are you", "Your gentle heart", "Your bright twinkling eyes",
    "Your comforting hugs", "Your inspiring passion", "Your silly adorable giggle",
    "Your radiant smiled", "Making simple days magical", "Your endless kindness",
    "Your happy food dance", "Your attention to small details", "Your unwavering support",
    "Your soft voice", "Your cute excitement", "Your sweet empathy",
    "How you look at me", "Your effortless grace", "How safe I feel with you",
    "Your quick-witted humor", "Your lovely scent", "How you brighten dark days",
    "Your warm bear hugs", "How easily you cheer me up", "Your unconditional love",
    "How cute you are in cozy clothes", "Our secret inside jokes", "Your brave heart",
    "Your sweet goodnight texts", "How proud I am of you", "Everything about you ❤️"
  ],

  // Sacramental Promises
  promises: [
    "I promise to always listen and support your dreams.",
    "I promise to make you smile, especially on hard days.",
    "I promise to hold your hand through life's highs and lows.",
    "I promise to celebrate you every day, not just today.",
    "I promise to love you endlessly and unconditionally."
  ],

  // Hidden Gift Box Message
  giftMessage: "You are my greatest gift in this life. My best friend, my soulmate, and my forever home. I will choose you today, tomorrow, and for all eternity. ❤️"
};

/* ==========================================================================
   APP STATE & DOM ELEMENTS
   ========================================================================== */
let currentPage = 1;
const totalPages = 10;
let audioContext = null;

// DOM References
const loaderEl = document.getElementById('loader');
const bgCanvas = document.getElementById('bg-canvas');
const fxCanvas = document.getElementById('fx-canvas');
const bgCtx = bgCanvas.getContext('2d');
const fxCtx = fxCanvas.getContext('2d');

const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const volumeSlider = document.getElementById('volume-slider');

const prevPageBtn = document.getElementById('prev-page-btn');
const nextPageBtn = document.getElementById('next-page-btn');
const navDotsContainer = document.getElementById('nav-dots');
const currentPageNum = document.getElementById('current-page-num');
const totalPagesNum = document.getElementById('total-pages-num');

/* ==========================================================================
   AUDIO & SYNTHESIS FX ENGINE (Web Audio API)
   ========================================================================== */
function initAudioEngine() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSynthSound(type) {
  try {
    initAudioEngine();
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'chime') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'blow') {
      // Noise buffer synthesis for candle blow out
      const bufferSize = audioContext.sampleRate * 0.4;
      const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioContext.createBufferSource();
      noise.buffer = buffer;
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      noise.connect(filter);
      filter.connect(gain);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      noise.start(now);
    }
  } catch (e) {
    console.warn("Web Audio playback error:", e);
  }
}

/* ==========================================================================
   CANVAS PARTICLE ENGINE (Stars, Hearts, Confetti, Fireworks)
   ========================================================================== */
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function resizeCanvases() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  bgCanvas.width = screenWidth;
  bgCanvas.height = screenHeight;
  fxCanvas.width = screenWidth;
  fxCanvas.height = screenHeight;
}

window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// Ambient Background Particles
const ambientParticles = [];
class AmbientParticle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * screenWidth;
    this.y = Math.random() * screenHeight;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 0.5 + 0.1;
    this.opacity = Math.random() * 0.7 + 0.2;
    this.isHeart = Math.random() > 0.6;
  }
  update() {
    this.y -= this.speedY;
    if (this.y < -10) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.isHeart ? 'rgba(255, 77, 141, ' + this.opacity + ')' : 'rgba(255, 255, 255, ' + this.opacity + ')';
    if (this.isHeart) {
      ctx.font = `${this.size * 3}px serif`;
      ctx.fillText('❤️', this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 40; i++) ambientParticles.push(new AmbientParticle());

function animateBackground() {
  bgCtx.clearRect(0, 0, screenWidth, screenHeight);
  ambientParticles.forEach(p => {
    p.update();
    p.draw(bgCtx);
  });
  requestAnimationFrame(animateBackground);
}
animateBackground();

// Explosive FX Canvas Particles
const fxParticles = [];

class ConfettiParticle {
  constructor(x, y) {
    this.x = x || screenWidth / 2;
    this.y = y || screenHeight / 2;
    this.size = Math.random() * 8 + 4;
    this.vx = (Math.random() - 0.5) * 12;
    this.vy = (Math.random() - 0.8) * 14;
    this.color = ['#9D4EDD', '#C084FC', '#E9D5FF', '#FBBF24', '#7C3AED'][Math.floor(Math.random() * 5)];
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 10;
    this.gravity = 0.25;
    this.alpha = 1;
  }
  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    this.alpha -= 0.012;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function triggerConfettiExplosion(x, y, count = 80) {
  playSynthSound('chime');
  for (let i = 0; i < count; i++) {
    fxParticles.push(new ConfettiParticle(x, y));
  }
}

function animateFX() {
  fxCtx.clearRect(0, 0, screenWidth, screenHeight);
  for (let i = fxParticles.length - 1; i >= 0; i--) {
    const p = fxParticles[i];
    p.update();
    p.draw(fxCtx);
    if (p.alpha <= 0) fxParticles.splice(i, 1);
  }
  requestAnimationFrame(animateFX);
}
animateFX();

/* ==========================================================================
   NAVIGATION & PAGE CONTROL
   ========================================================================== */
function initNavigation() {
  totalPagesNum.textContent = totalPages;

  // Render Navigation Dots
  navDotsContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 1 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToPage(i));
    navDotsContainer.appendChild(dot);
  }

  prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
}

function goToPage(pageIndex) {
  if (pageIndex < 1 || pageIndex > totalPages) return;

  playSynthSound('click');

  const currentSection = document.getElementById(`page-${currentPage}`);
  const nextSection = document.getElementById(`page-${pageIndex}`);

  if (currentSection) currentSection.classList.remove('active');
  if (nextSection) nextSection.classList.add('active');

  currentPage = pageIndex;
  currentPageNum.textContent = currentPage;

  // Update Nav Controls
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;

  const dots = navDotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentPage - 1);
  });

  // Page specific entrance callbacks
  onPageEnter(currentPage);
}

function onPageEnter(page) {
  if (page === 2) {
    triggerConfettiExplosion(screenWidth / 2, screenHeight / 3, 100);
  } else if (page === 6) {
    startLoveCounter();
  } else if (page === 9) {
    animatePromises();
  } else if (page === 10) {
    triggerConfettiExplosion(screenWidth / 2, screenHeight / 2, 60);
  }
}

/* ==========================================================================
   PAGE-SPECIFIC LOGIC
   ========================================================================== */

// Page 1: Typewriter & Start
function initPage1() {
  const text = `Someone very special has a surprise waiting... Are you ready to see it, ${CONFIG.girlfriendName}? ❤️`;
  const container = document.getElementById('typewriter-text');
  let idx = 0;

  function type() {
    if (idx < text.length) {
      container.textContent += text.charAt(idx);
      idx++;
      setTimeout(type, 45);
    }
  }

  setTimeout(type, 600);

  document.getElementById('start-btn').addEventListener('click', () => {
    goToPage(2);
    if (bgMusic.paused) toggleAudio();
  });
}

// Page 2: Celebration
function initPage2() {
  document.getElementById('bday-gf-name').textContent = CONFIG.girlfriendName;
  document.getElementById('retrigger-confetti-btn').addEventListener('click', (e) => {
    triggerConfettiExplosion(e.clientX, e.clientY, 80);
  });
}

// Page 3: Envelope & Letter
function initPage3() {
  document.getElementById('letter-gf-name').textContent = CONFIG.girlfriendName;
  const envelope = document.getElementById('interactive-envelope');
  const letterModal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('close-letter-btn');
  const letterBody = document.getElementById('letter-body');

  envelope.addEventListener('click', () => {
    playSynthSound('chime');
    letterModal.classList.add('active');
    typewriteLetter();
  });

  closeBtn.addEventListener('click', () => {
    letterModal.classList.remove('active');
  });

  let letterTyped = false;
  function typewriteLetter() {
    if (letterTyped) return;
    letterTyped = true;
    let index = 0;
    const fullText = CONFIG.letterText;
    letterBody.textContent = '';

    function typeChar() {
      if (index < fullText.length) {
        letterBody.textContent += fullText.charAt(index);
        index++;
        setTimeout(typeChar, 25);
      }
    }
    typeChar();
  }
}

// Page 4: Memory Timeline & Lightbox
function initPage4() {
  const container = document.getElementById('memory-timeline');
  container.innerHTML = '';

  CONFIG.memories.forEach((mem) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    card.innerHTML = `
      <img src="${mem.image}" alt="${mem.title}" class="polaroid-img" />
      <div class="polaroid-caption">${mem.title}</div>
      <div class="polaroid-date">${mem.date}</div>
      <div class="polaroid-desc">${mem.desc}</div>
    `;

    card.addEventListener('click', () => openLightbox(mem.image, `${mem.title} - ${mem.date}`));
    container.appendChild(card);
  });

  // Lightbox handlers
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    playSynthSound('click');
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
  }

  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
}

// Page 5: Why I Love You Grid
function initPage5() {
  const grid = document.getElementById('reasons-grid');
  grid.innerHTML = '';

  CONFIG.reasons.forEach((reason, index) => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          <span class="reason-num">#${index + 1}</span>
          <span class="reason-heart">❤️</span>
        </div>
        <div class="flip-card-back">
          <span>${reason}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      playSynthSound('click');
      card.classList.toggle('flipped');
    });

    grid.appendChild(card);
  });
}

// Page 6: Live Relationship Counter
let counterInterval = null;
function startLoveCounter() {
  if (counterInterval) clearInterval(counterInterval);

  const startDate = new Date(CONFIG.relationshipStartDate).getTime();

  function updateCounter() {
    const now = new Date().getTime();
    const diff = now - startDate;

    if (diff < 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('count-days').textContent = String(days).padStart(3, '0');
    document.getElementById('count-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('count-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('count-seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCounter();
  counterInterval = setInterval(updateCounter, 1000);
}

// Page 7: Birthday Cake & Candles
function initPage7() {
  const candles = document.querySelectorAll('.candle');
  const wishMessage = document.getElementById('wish-message');
  let blownCount = 0;

  candles.forEach((candle) => {
    candle.addEventListener('click', () => {
      if (!candle.classList.contains('out')) {
        candle.classList.add('out');
        playSynthSound('blow');
        blownCount++;

        if (blownCount === candles.length) {
          setTimeout(() => {
            wishMessage.classList.remove('hidden');
            triggerConfettiExplosion(screenWidth / 2, screenHeight / 2, 90);
          }, 500);
        }
      }
    });
  });
}

// Page 8: Gift Box Reveal
function initPage8() {
  const giftBox = document.getElementById('gift-box');
  const giftMessageBox = document.getElementById('gift-message-box');
  const giftText = document.getElementById('gift-message-text');

  giftText.textContent = CONFIG.giftMessage;

  giftBox.addEventListener('click', () => {
    if (!giftBox.classList.contains('opened')) {
      giftBox.classList.add('opened');
      playSynthSound('chime');
      triggerConfettiExplosion(screenWidth / 2, screenHeight / 2, 80);

      setTimeout(() => {
        giftMessageBox.classList.remove('hidden');
      }, 600);
    }
  });
}

// Page 9: Promises Animation
function initPage9() {
  const container = document.getElementById('promises-container');
  container.innerHTML = '';

  CONFIG.promises.forEach((promise) => {
    const card = document.createElement('div');
    card.className = 'promise-card';
    card.innerHTML = `
      <span class="promise-icon">💖</span>
      <span>${promise}</span>
    `;
    container.appendChild(card);
  });
}

function animatePromises() {
  const cards = document.querySelectorAll('.promise-card');
  cards.forEach((card, idx) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, idx * 400);
  });
}

// Page 10: Final Hug & Grand Finale
function initPage10() {
  document.getElementById('final-gf-name').textContent = CONFIG.nickname;
  const hugBtn = document.getElementById('hug-btn');

  hugBtn.addEventListener('click', (e) => {
    // Grand Celebration FX Trigger
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        triggerConfettiExplosion(
          Math.random() * screenWidth,
          Math.random() * (screenHeight / 2),
          100
        );
      }, i * 300);
    }
  });
}

/* ==========================================================================
   AUDIO PLAYER CONTROLLER
   ========================================================================== */
function initAudioPlayer() {
  bgMusic.src = CONFIG.bgMusicUrl;
  bgMusic.volume = 0.7;

  musicBtn.addEventListener('click', () => {
    toggleAudio();
  });

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
  });
}

function toggleAudio() {
  initAudioEngine();
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      musicBtn.classList.add('playing');
      musicBtn.innerHTML = '🎵';
    }).catch(err => console.log("Audio play blocked by browser:", err));
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicBtn.innerHTML = '🔇';
  }
}

/* ==========================================================================
   INITIALIZATION ENTRY POINT
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  // Update GF Name in navigation Header
  document.getElementById('nav-gf-name').textContent = CONFIG.nickname;

  // Initialize Modules
  initNavigation();
  initAudioPlayer();

  initPage1();
  initPage2();
  initPage3();
  initPage4();
  initPage5();
  initPage7();
  initPage8();
  initPage9();
  initPage10();

  // Hide Screen Loader
  setTimeout(() => {
    loaderEl.classList.add('hidden');
  }, 800);
});