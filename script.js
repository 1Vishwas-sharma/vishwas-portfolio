/* ========================================================
   VISHWA SHARMA - PORTFOLIO INTERACTION & GRAPHICS SYSTEM (V2)
   - High-Contrast Monochromatic Background Engine:
     * Mode 1: Silk Waves & Luminous Auroras (Apple Silicon Waveform style)
     * Mode 2: Interactive Constellation Network (Connected Node Grid)
     * Mode 3: Radial Quantum Mesh
   - Interactive Background Preset Switcher
   - Code Playground Simulator & Execution Engine
   - Google Omnibar / Command Palette (Ctrl+K)
   - Live Jaipur Clock & Athletic Metric Switcher
   ======================================================== */

// --- 1. DYNAMIC MONOCHROMATIC AMBIENT ENGINE & REPULSIVE STARFIELD ---
const canvas = document.getElementById('mesh-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouse = { x: null, y: null, targetX: 0, targetY: 0, radius: 160 };
let bgMode = 0; // 0: Interactive Starfield & Titanium Aura, 1: Pure Cosmic Stars, 2: Ambient Moonlight
const bgModes = [
  { name: "Repulsive Starfield & Aura", icon: "sparkles" },
  { name: "Pure Cosmic Stars", icon: "star" },
  { name: "Ambient Moonlight", icon: "disc" }
];

let stars = [];
let animTime = 0;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initStars();
}

// Interactive Star with Physics-based Mouse Repulsion
class InteractiveStar {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    // Ambient floating drift
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.baseVx = this.vx;
    this.baseVy = this.vy;
    // Star appearance
    this.size = Math.random() * 2.4 + 1.0;
    this.baseAlpha = Math.random() * 0.55 + 0.35;
    this.twinkleSpeed = Math.random() * 0.04 + 0.015;
    this.twinklePhase = Math.random() * Math.PI * 2;
    // 30% of larger stars feature a 4-point sparkle cross flare
    this.isSparkle = Math.random() > 0.70;
  }

  update() {
    // 1. Move by current velocity
    this.x += this.vx;
    this.y += this.vy;

    // 2. Physics-based cursor repulsion: when mouse comes near, push star away!
    if (mouse.x !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelDistance = 145; // radius of influence

      if (dist < repelDistance && dist > 0.01) {
        // Force is strongest when cursor is closest (quadratic falloff)
        const force = (repelDistance - dist) / repelDistance;
        const pushPower = force * force * 5.5;

        // Push outward away from mouse
        this.vx += (dx / dist) * pushPower;
        this.vy += (dy / dist) * pushPower;
      }
    }

    // 3. Friction damping: smoothly slows down after being pushed
    this.vx *= 0.93;
    this.vy *= 0.93;

    // 4. Preserve subtle ambient floating drift when calm
    if (Math.abs(this.vx) < 0.15) this.vx += this.baseVx * 0.08;
    if (Math.abs(this.vy) < 0.15) this.vy += this.baseVy * 0.08;

    // 5. Wrap around screen edges smoothly
    if (this.x < -15) this.x = width + 15;
    if (this.x > width + 15) this.x = -15;
    if (this.y < -15) this.y = height + 15;
    if (this.y > height + 15) this.y = -15;
  }

  draw(time) {
    // Twinkling brightness
    const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
    const alpha = Math.min(1, Math.max(0.18, this.baseAlpha + twinkle * 0.35));

    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowBlur = this.size * 4;
    ctx.shadowColor = `rgba(255, 255, 255, ${alpha * 0.8})`;

    if (this.isSparkle && this.size > 1.8) {
      // 4-point sparkle cross
      const arm = this.size * 2.6;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - arm);
      ctx.quadraticCurveTo(this.x, this.y, this.x + arm, this.y);
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + arm);
      ctx.quadraticCurveTo(this.x, this.y, this.x - arm, this.y);
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - arm);
      ctx.fill();
    } else {
      // Circular glowing star
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function initStars() {
  stars = [];
  // Calculate healthy star density based on screen dimensions
  const starCount = Math.min(180, Math.max(90, Math.floor((width * height) / 9500)));
  for (let i = 0; i < starCount; i++) {
    stars.push(new InteractiveStar());
  }
}

// Background Aura Clouds (Pure Organic Light)
function drawTitaniumAura() {
  const auraNodes = [
    { x: width * 0.18 + Math.sin(animTime * 0.007) * 90, y: height * 0.22 + Math.cos(animTime * 0.005) * 60, r: 400, alpha: 0.12 },
    { x: width * 0.82 + Math.cos(animTime * 0.006) * 110, y: height * 0.32 + Math.sin(animTime * 0.007) * 70, r: 450, alpha: 0.10 },
    { x: width * 0.50 + Math.sin(animTime * 0.005) * 80, y: height * 0.68 + Math.cos(animTime * 0.006) * 80, r: 460, alpha: 0.09 },
    { x: width * 0.86 + Math.sin(animTime * 0.006) * 60, y: height * 0.88 + Math.cos(animTime * 0.005) * 55, r: 360, alpha: 0.08 }
  ];

  auraNodes.forEach(node => {
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r);
    grad.addColorStop(0, `rgba(255, 255, 255, ${node.alpha})`);
    grad.addColorStop(0.5, `rgba(220, 225, 245, ${node.alpha * 0.3})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderCanvas() {
  animTime += 1;
  ctx.clearRect(0, 0, width, height);

  // 1. Interactive cursor glow
  if (mouse.x !== null) {
    mouse.targetX += (mouse.x - mouse.targetX) * 0.12;
    mouse.targetY += (mouse.y - mouse.targetY) * 0.12;

    const spotlight = ctx.createRadialGradient(
      mouse.targetX, mouse.targetY, 0,
      mouse.targetX, mouse.targetY, 320
    );
    spotlight.addColorStop(0, "rgba(255, 255, 255, 0.08)");
    spotlight.addColorStop(0.5, "rgba(255, 255, 255, 0.015)");
    spotlight.addColorStop(1, "transparent");
    ctx.fillStyle = spotlight;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Render background ambient aura if in mode 0 or 2
  if (bgMode === 0 || bgMode === 2) {
    drawTitaniumAura();
  }

  // 3. Update & render all interactive stars with cursor repulsion
  stars.forEach(star => {
    star.update();
    star.draw(animTime);
  });

  requestAnimationFrame(renderCanvas);
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

resizeCanvas();
renderCanvas();

window.cycleBackgroundMode = function() {
  bgMode = (bgMode + 1) % bgModes.length;
  const label = document.getElementById('bg-mode-label');
  if (label) {
    label.textContent = `Design: ${bgModes[bgMode].name}`;
  }
  showToast(`Background Art: ${bgModes[bgMode].name}`);
};

// --- 2. PROJECT FILTER TABS ---
const projectCards = document.querySelectorAll('.project-card');
const filterChips = document.querySelectorAll('.filter-chip');

filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const filter = chip.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category.includes(filter)) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// --- 4. GOOGLE OMNIBAR / COMMAND PALETTE (CTRL+K) ---
const cmdOverlay = document.getElementById('cmd-palette');
const cmdInput = document.getElementById('cmd-input');
const cmdItems = document.querySelectorAll('.cmd-item');

function openCommandPalette() {
  if (!cmdOverlay) return;
  cmdOverlay.classList.remove('hidden');
  cmdOverlay.classList.add('flex');
  setTimeout(() => cmdInput.focus(), 50);
}

function closeCommandPalette() {
  if (!cmdOverlay) return;
  cmdOverlay.classList.add('hidden');
  cmdOverlay.classList.remove('flex');
  cmdInput.value = '';
  filterCmdItems('');
}

function filterCmdItems(query) {
  const q = query.toLowerCase().trim();
  cmdItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (!q || text.includes(q)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

if (cmdInput) {
  cmdInput.addEventListener('input', (e) => filterCmdItems(e.target.value));
}

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdOverlay.classList.contains('hidden')) {
      openCommandPalette();
    } else {
      closeCommandPalette();
    }
  }
  if (e.key === 'Escape' && !cmdOverlay.classList.contains('hidden')) {
    closeCommandPalette();
  }
});

// Click outside to close
if (cmdOverlay) {
  cmdOverlay.addEventListener('click', (e) => {
    if (e.target === cmdOverlay) closeCommandPalette();
  });
}

// Navigation triggers
document.querySelectorAll('[data-open-cmd]').forEach(el => {
  el.addEventListener('click', openCommandPalette);
});

cmdItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.target;
    closeCommandPalette();
    if (target) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- 5. LIVE JAIPUR CLOCK ---
function updateJaipurClock() {
  const clockEl = document.getElementById('jaipur-clock');
  if (!clockEl) return;
  try {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    clockEl.textContent = formatter.format(new Date()) + " IST (Jaipur, RJ)";
  } catch (err) {
    clockEl.textContent = "Jaipur, India";
  }
}
setInterval(updateJaipurClock, 1000);
updateJaipurClock();

// --- 6. VOLLEYBALL INTERACTIVE SIMULATOR CARD ---
const volleyStats = {
  spike: {
    title: "Outside Hitter & Spiker",
    stat: "94.5 km/h",
    desc: "High vertical leap and cross-court precision. Reads defensive blocks before making contact in mid-air."
  },
  dsa: {
    title: "Algorithmic Reaction Speed",
    stat: "O(1) Instincts",
    desc: "Just like reading a volleyball trajectory in fractions of a second, competitive programming builds instant pattern recognition for complex data structures."
  },
  team: {
    title: "SKIT Team Synergy",
    stat: "6-Player Cohesion",
    desc: "Volleyball cannot be won by an individual spike without flawless sets and digs. Applied to software architecture: clean modular design and peer collaboration."
  }
};

window.switchVolleyCard = function(type) {
  const data = volleyStats[type];
  if (!data) return;
  const target = document.getElementById('volley-interactive-desc');
  const title = document.getElementById('volley-interactive-title');
  const stat = document.getElementById('volley-interactive-stat');
  
  if (target) target.textContent = data.desc;
  if (title) title.textContent = data.title;
  if (stat) stat.textContent = data.stat;

  document.querySelectorAll('.volley-tab-btn').forEach(b => {
    if (b.dataset.volley === type) {
      b.classList.add('bg-white', 'text-black');
      b.classList.remove('bg-white/5', 'text-white/70');
    } else {
      b.classList.remove('bg-white', 'text-black');
      b.classList.add('bg-white/5', 'text-white/70');
    }
  });
};

// --- 7. COPY CONTACT INFO & TOAST ---
function showToast(msg) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'fixed bottom-8 right-8 z-50 px-5 py-3 rounded-full bg-white text-black font-semibold shadow-2xl flex items-center gap-2 transform translate-y-10 opacity-0 transition-all duration-300';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg class="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
    </svg>
    <span>${msg}</span>
  `;
  toast.classList.remove('translate-y-10', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3200);
}

window.copyEmail = function(emailStr) {
  navigator.clipboard.writeText(emailStr).then(() => {
    showToast(`Email copied: ${emailStr}`);
  }).catch(() => {
    showToast(`Contact: ${emailStr}`);
  });
};


