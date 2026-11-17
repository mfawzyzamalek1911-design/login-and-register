/**
 * ========================================================
 * منظومة محمود المتكاملة | Mahmoud Enterprise Core Engine
 * Seamless Page Transitions, State Management & Calculations
 * ========================================================
 */

// Global App Namespace
window.MahmoudApp = {
  // --- 1. Page Transition & Navigation ---
  navigateTo: function(url) {
    if (!url || url === '#' || url === window.location.pathname) return;
    document.body.classList.add('page-exit');
    setTimeout(() => {
      window.location.href = url;
    }, 240);
  },

  // --- 2. Unified Dark / Light Theme System ---
  initTheme: function() {
    const savedTheme = localStorage.getItem('mahmoud_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.updateThemeIcons();

    // Attach listeners to any theme toggle buttons on the page
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.onclick = () => this.toggleTheme();
    });
  },

  toggleTheme: function() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('mahmoud_theme', isDark ? 'dark' : 'light');
    this.updateThemeIcons();
    this.showToast(isDark ? 'تم تفعيل الوضع الليلي 🌙' : 'تم تفعيل الوضع النهاري ☀️', 'info');
  },

  updateThemeIcons: function() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.sun-icon').forEach(el => el.classList.toggle('hidden', !isDark));
    document.querySelectorAll('.moon-icon').forEach(el => el.classList.toggle('hidden', isDark));
  },

  // --- 3. Interactive Toast Notification System ---
  showToast: function(message, type = 'success', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item ${
      type === 'success' 
        ? 'bg-emerald-600 border border-emerald-400/40' 
        : type === 'error'
        ? 'bg-rose-600 border border-rose-400/40'
        : type === 'warning'
        ? 'bg-amber-600 border border-amber-400/40'
        : 'bg-indigo-600 border border-indigo-400/40'
    }`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
    } else {
      iconSvg = `<svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 280);
    }, duration);
  },

  // --- 4. Session & User State ---
  getUser: function() {
    return {
      name: localStorage.getItem('mahmoud_user_name') || 'محمود',
      email: localStorage.getItem('mahmoud_user_email') || 'mahmoud@enterprise.com',
      role: 'المدير التنفيذي والمشرف العام'
    };
  },

  setUser: function(name, email) {
    if (name) localStorage.setItem('mahmoud_user_name', name);
    if (email) localStorage.setItem('mahmoud_user_email', email);
  },

  logout: function() {
    this.showToast('جاري تسجيل الخروج الآمن...', 'info');
    setTimeout(() => {
      this.navigateTo('index.html');
    }, 600);
  },

  // --- 5. Form Utilities ---
  isValidEmail: function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  },

  evaluatePasswordStrength: function(password) {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(4, Math.max(1, score - 1));
  }
};

// Auto initialization on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter');
  MahmoudApp.initTheme();

  // Attach navigation interception to all internal page links for silky smooth animation
  document.querySelectorAll('a[data-navigate]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = link.getAttribute('href');
      MahmoudApp.navigateTo(targetUrl);
    });
  });
});
