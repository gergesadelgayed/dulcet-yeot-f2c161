// ===== FIREBASE CONFIG =====
// Replace these values with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCwXxq3oLkh-HSehS9TOeil2P9jLMQjShI",
  authDomain: "elfla7en.firebaseapp.com",
  databaseURL: "https://elfla7en-default-rtdb.firebaseio.com",
  projectId: "elfla7en",
  storageBucket: "elfla7en.firebasestorage.app",
  messagingSenderId: "321009240746",
  appId: "1:321009240746:web:e4b8aad6983c087b441ed3",
  measurementId: "G-XXZJVPVSBP"
};

let db = null;
let auth = null;

function initFirebase() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
      db = firebase.database();
      auth = firebase.auth();
    }
  } catch(e) { /* running in local mode */ }
}

// ===== SECURITY: XSS PREVENTION =====
function sanitize(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

function safeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  try {
    const p = new URL(url);
    return (p.protocol === 'http:' || p.protocol === 'https:') ? p.href : '#';
  } catch (_) { return '#'; }
}

// ===== SECURITY: BRUTE-FORCE RATE LIMITER =====
const RateLimiter = {
  KEY: 'fla7_rl',
  MAX: 5,
  WINDOW: 15 * 60 * 1000,

  check() {
    try {
      const raw = sessionStorage.getItem(this.KEY);
      const d = raw ? JSON.parse(raw) : { c: 0, t: Date.now() };
      if (Date.now() - d.t > this.WINDOW) {
        sessionStorage.setItem(this.KEY, JSON.stringify({ c: 1, t: Date.now() }));
        return true;
      }
      if (d.c >= this.MAX) return false;
      d.c++;
      sessionStorage.setItem(this.KEY, JSON.stringify(d));
      return true;
    } catch (_) { return true; }
  },

  remaining() {
    try {
      const raw = sessionStorage.getItem(this.KEY);
      if (!raw) return this.MAX;
      const d = JSON.parse(raw);
      return Date.now() - d.t > this.WINDOW ? this.MAX : Math.max(0, this.MAX - d.c);
    } catch (_) { return this.MAX; }
  },

  lockoutMs() {
    try {
      const raw = sessionStorage.getItem(this.KEY);
      if (!raw) return 0;
      const d = JSON.parse(raw);
      if (d.c < this.MAX) return 0;
      const rem = this.WINDOW - (Date.now() - d.t);
      return rem > 0 ? rem : 0;
    } catch (_) { return 0; }
  }
};

// ===== SECURITY: SESSION (8h TTL) =====
const SESSION_TTL = 8 * 60 * 60 * 1000;

function getSession() {
  try {
    const raw = sessionStorage.getItem('fla7_session');
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || !d.role || !d.loginTime) return null;
    if (Date.now() - d.loginTime > SESSION_TTL) { clearSession(); return null; }
    return d;
  } catch { clearSession(); return null; }
}

function setSession(data) {
  sessionStorage.setItem('fla7_session', JSON.stringify({
    role: data.role,
    username: sanitize(data.username || ''),
    email: sanitize(data.email || ''),
    uid: data.uid || null,
    loginTime: Date.now()
  }));
}

function clearSession() {
  sessionStorage.removeItem('fla7_session');
}

// ===== SECURITY: SAFE REDIRECT =====
function safeRedirect(url) {
  if (!url) return 'index.html';
  const clean = url.replace(/^\/+/, '').replace(/[^a-zA-Z0-9._\-\/]/g, '');
  if (!clean || clean.includes('//') || /^https?:/i.test(clean)) return 'index.html';
  return clean;
}

// ===== SECURITY: PASSWORD HASHING =====
async function hashPassword(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'fla7en_$alt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (_) { return password; }
}

const ADMIN_HASH = 'e3b8f1a2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8';
const ADMIN_EMAIL = 'admin@elfla7en.ctf';

// ===== TEAM DATA =====
const LOCAL_DATA = {
  members: [
    {
      id: 'mem1',
      name: 'Gerges Adel',
      role: 'Leader',
      specialty: 'Web Security & Digital Forensics',
      skills: ['Web Security', 'Digital Forensics', 'OSINT', 'DFIR'],
      linkedin: 'https://www.linkedin.com/in/gerges-adel-10207537b',
      bio: 'Leader of EL FLA7EN. Expert in Web Application Security, Digital Forensics, and Incident Response.',
      active: true
    },
    {
      id: 'mem2',
      name: 'Bassem Naser',
      role: 'Co-Leader',
      specialty: 'Digital Forensics & OSINT',
      skills: ['Digital Forensics', 'OSINT', 'DFIR'],
      linkedin: 'https://www.linkedin.com/in/bassem-naser-9a9752275',
      bio: 'Co-Leader specializing in Digital Forensics, threat intelligence, and open-source investigation.',
      active: true
    },
    {
      id: 'mem3',
      name: 'Bishoy Salah',
      role: 'Member',
      specialty: 'Web Security & Forensics',
      skills: ['Web Security', 'Digital Forensics', 'DFIR'],
      linkedin: 'https://www.linkedin.com/in/beshoy-salah-5a33793b5',
      bio: 'Focused on web application security research and digital forensics case analysis.',
      active: true
    },
    {
      id: 'mem4',
      name: 'Filopater Yohna',
      role: 'Member',
      specialty: 'Web Security & Forensics',
      skills: ['Web Security', 'Digital Forensics', 'DFIR'],
      linkedin: 'https://www.linkedin.com/in/felopater-yohana-9625503b5',
      bio: 'Passionate about web security vulnerabilities and digital forensics investigations.',
      active: true
    },
    {
      id: 'mem5',
      name: 'Elyaro Samir',
      role: 'Member',
      specialty: 'Web Security & Forensics',
      skills: ['Web Security', 'Digital Forensics', 'DFIR'],
      linkedin: 'https://www.linkedin.com/in/elyaro-samir-81593839b/',
      bio: 'Dedicated to web penetration testing and digital forensic analysis methodologies.',
      active: true
    },
    {
      id: 'mem6',
      name: 'Mina Rafaat',
      role: 'Member',
      specialty: 'Web Security & Forensics',
      skills: ['Web Security', 'Digital Forensics', 'DFIR'],
      linkedin: 'https://www.linkedin.com/in/mena-rafat-540276300',
      bio: 'Enthusiastic about web security, forensic analysis, and incident response.',
      active: true
    }
  ],
  mentors: [
    {
      id: 'men1',
      name: 'Dr. Ahmed El Khatib',
      title: 'Mentor',
      specialty: 'IT Researcher & Digital Forensics Expert',
      affiliation: 'Teaching Assistant at FCI LUXOR',
      icon: '🎓'
    },
    {
      id: 'men2',
      name: 'Eng. Mostafa Mahmoud',
      title: 'Mentor',
      specialty: 'Digital Forensics Expert',
      affiliation: 'Fourth-year student at FCI LUXOR',
      icon: '🛡️'
    }
  ],
  writeups: [
    {
      id: 'wp1',
      title: 'DFIR Challenge — Memory Forensics Walkthrough',
      author: 'Gerges Adel',
      category: 'Forensics',
      ctf: 'CTF Practice',
      date: '2025-02-10',
      difficulty: 'Medium',
      description: 'Step-by-step memory forensics analysis using Volatility to extract artifacts from a Windows memory dump.',
      url: '#'
    },
    {
      id: 'wp2',
      title: 'Web Security — SQL Injection to RCE',
      author: 'Bishoy Salah',
      category: 'Web',
      ctf: 'CTF Practice',
      date: '2025-01-20',
      difficulty: 'Hard',
      description: 'Exploiting a blind SQL injection vulnerability to achieve remote code execution on a vulnerable web application.',
      url: '#'
    },
    {
      id: 'wp3',
      title: 'OSINT Investigation — Digital Footprint Analysis',
      author: 'Bassem Naser',
      category: 'OSINT',
      ctf: 'CTF Practice',
      date: '2025-01-05',
      difficulty: 'Easy',
      description: 'Reconstructing a digital identity using only publicly available information and OSINT tools.',
      url: '#'
    },
    {
      id: 'wp4',
      title: 'Network Forensics — PCAP Traffic Analysis',
      author: 'Filopater Yohna',
      category: 'Forensics',
      ctf: 'CTF Practice',
      date: '2024-12-18',
      difficulty: 'Medium',
      description: 'Analyzing suspicious network traffic to identify C2 communication patterns and extract IOCs.',
      url: '#'
    },
    {
      id: 'wp5',
      title: 'DFIR — Disk Image Examination with Autopsy',
      author: 'Elyaro Samir',
      category: 'Forensics',
      ctf: 'CTF Practice',
      date: '2024-12-01',
      difficulty: 'Medium',
      description: 'Full disk image forensic examination to recover deleted files and build an incident timeline.',
      url: '#'
    }
  ],
  achievements: [
    {
      id: 'ach1',
      title: '30 CTF Challenges Solved',
      description: 'EL FLA7EN has collectively solved 30 Capture The Flag challenges across multiple platforms.',
      date: '2025-03-01',
      category: 'CTF',
      place: 'Milestone',
      icon: '🎯'
    },
    {
      id: 'ach2',
      title: '5 Published Technical Writeups',
      description: 'Contributed 5 detailed technical writeups to the community.',
      date: '2025-02-15',
      category: 'Research',
      place: 'Contribution',
      icon: '📝'
    },
    {
      id: 'ach3',
      title: 'Active DFIR Participation',
      description: 'Currently competing in Digital Forensics and Incident Response challenges.',
      date: '2025-03-05',
      category: 'Training',
      place: 'Active',
      icon: '🔍'
    }
  ]
};

// ===== DATA HELPERS =====
async function getData(path) {
  if (db) {
    try {
      const snap = await db.ref(path).get();
      return snap.val();
    } catch (_) {}
  }
  const parts = path.split('/').filter(Boolean);
  let data = LOCAL_DATA;
  for (const part of parts) {
    if (data && Object.prototype.hasOwnProperty.call(data, part)) data = data[part];
    else return null;
  }
  return data;
}

async function setData(path, value) {
  if (db) return db.ref(path).set(value);
  return true;
}

async function pushData(path, value) {
  if (db) return db.ref(path).push(value);
  return { key: 'local_' + Date.now() };
}

async function removeData(path) {
  if (db) return db.ref(path).remove();
  return true;
}

// ===== MATRIX RAIN =====
function initMatrixRain(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオ';
  const fontSize = 12, cols = Math.floor(canvas.width / fontSize);
  const drops = Array(cols).fill(1);
  setInterval(() => {
    ctx.fillStyle = 'rgba(4,10,4,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px Share Tech Mono';
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.95 ? '#00ff41cc' : '#00ff4122';
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 55);
}

// ===== TYPING EFFECT =====
function typeEffect(el, text, speed = 50, cb) {
  if (!el) return;
  let i = 0; el.textContent = '';
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) { clearInterval(timer); if (cb) cb(); }
  }, speed);
}

// ===== NAV ACTIVE — works on both localhost and Netlify =====
function setNavActive() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefPage = href.split('/').pop();
    if (
      hrefPage === page ||
      (page === '' && hrefPage === 'index.html') ||
      (page === 'index.html' && href === '/') ||
      href === path
    ) {
      a.classList.add('active');
    }
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initFirebase();
  setNavActive();
  const session = getSession();
  const loginLink = document.querySelector('.nav-login-link');
  if (session && loginLink) {
    loginLink.textContent = '[Logout]';
    loginLink.href = '#';
    loginLink.onclick = (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = 'index.html';
    };
  }
});

// ===== NOTIFICATION =====
function showNotif(msg, type = 'info') {
  const notif = document.createElement('div');
  notif.className = 'alert alert-' + (['success','error','info'].includes(type) ? type : 'info');
  notif.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:14px 20px;min-width:280px;max-width:400px;animation:fadeIn 0.3s ease;';
  notif.textContent = (type === 'success' ? '[OK] ' : type === 'error' ? '[ERR] ' : '[INFO] ') + msg;
  document.body.appendChild(notif);
  setTimeout(() => { if (notif.parentNode) notif.remove(); }, 4000);
}
