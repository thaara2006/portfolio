document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initHeaderScroll();
  initActiveNavLinkOnScroll();
  initSkillTree();
  initScrollReveal();
  initLeetCodeStats();
  initProjectFilter();
});

/* Theme Toggle Logic */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
      } else {
        themeIcon.className = 'fas fa-moon';
      }
    }
  }
}

/* Mobile Responsive Menu */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

/* Header Scroll Class Trigger */
function initHeaderScroll() {
  const header = document.getElementById('header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* Active Nav Links on Scroll */
function initActiveNavLinkOnScroll() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 180;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Interactive Skill Tree Card Handler */
function initSkillTree() {
  const skillCards = document.querySelectorAll('.skill-tree-card');
  skillCards.forEach(card => {
    card.addEventListener('click', () => {
      skillCards.forEach(c => {
        if (c !== card) c.classList.remove('active');
      });
      card.classList.toggle('active');
    });
  });
}

/* Intersection Observer for Scroll Reveals */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1
  });

  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

/* Project Filter Functionality */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || filterVal === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* Custom Floating Toast Notification System */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconClass = 'fas fa-check-circle';
  if (type === 'info') {
    iconClass = 'fas fa-info-circle';
    toast.style.borderColor = 'var(--accent-secondary)';
  } else if (type === 'warning') {
    iconClass = 'fas fa-exclamation-triangle';
    toast.style.borderColor = 'var(--accent-tertiary)';
  }

  toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}

/* LeetCode Dynamic Real-Time Live Stats Integration */
function initLeetCodeStats() {
  const elements = {
    avatar: document.getElementById('leetcode-avatar'),
    name: document.getElementById('leetcode-name'),
    rank: document.getElementById('leetcode-rank-badge'),
    syncStatus: document.getElementById('leetcode-sync-status'),
    solvedCount: document.getElementById('leetcode-solved-count'),
    acceptance: document.getElementById('leetcode-acceptance'),
    easySolved: document.getElementById('leetcode-easy-solved'),
    easyTotal: document.getElementById('leetcode-easy-total'),
    easyBar: document.getElementById('leetcode-easy-bar'),
    mediumSolved: document.getElementById('leetcode-medium-solved'),
    mediumTotal: document.getElementById('leetcode-medium-total'),
    mediumBar: document.getElementById('leetcode-medium-bar'),
    hardSolved: document.getElementById('leetcode-hard-solved'),
    hardTotal: document.getElementById('leetcode-hard-total'),
    hardBar: document.getElementById('leetcode-hard-bar'),
    progressCircle: document.getElementById('leetcode-progress-circle'),
    badgesContainer: document.getElementById('leetcode-badges-container'),
    heroLeetCodeCount: document.getElementById('hero-leetcode-count')
  };

  const username = "Thaara06";

  // Base snapshot statistics for instant display
  const staticStats = {
    name: "Thaaranyaashree S",
    username: username,
    avatar: "profile.jpg",
    ranking: 316662,
    solved: 425,
    easySolved: 337,
    mediumSolved: 85,
    hardSolved: 3,
    easyTotal: 830,
    mediumTotal: 1720,
    hardTotal: 740,
    acceptanceRate: "58.5%",
    streak: 36,
    totalActiveDays: 157,
    badges: [
      { name: "50 Problems Solved", class: "dark-hex", val: "50", sub: "badge" },
      { name: "100 Problems Solved", class: "blue-hex", val: "100", sub: "badge" },
      { name: "100 Days Badge", class: "teal-hex", val: "100+", sub: "badge" },
      { name: "50 Days Badge", class: "orange-hex", val: "50+", sub: "badge" }
    ]
  };

  // Render initial static snapshot values immediately
  updateStatsDOM(staticStats, 'Archive Mode');

  // Timeout helper to prevent hanging API calls
  const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request Timeout')), timeout))
    ]);
  };

  // Live Sync Promise: Fetch from Faisal Shohag API
  const faisalUrl = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

  fetchWithTimeout(faisalUrl)
    .then(res => {
      if (!res.ok) throw new Error('API response was not ok');
      return res.json();
    })
    .then(faisalData => {
      if (!faisalData) return;

      const liveStats = { ...staticStats };

      if (faisalData.totalSolved !== undefined) liveStats.solved = faisalData.totalSolved;
      if (faisalData.easySolved !== undefined) liveStats.easySolved = faisalData.easySolved;
      if (faisalData.mediumSolved !== undefined) liveStats.mediumSolved = faisalData.mediumSolved;
      if (faisalData.hardSolved !== undefined) liveStats.hardSolved = faisalData.hardSolved;
      if (faisalData.totalEasy) liveStats.easyTotal = faisalData.totalEasy;
      if (faisalData.totalMedium) liveStats.mediumTotal = faisalData.totalMedium;
      if (faisalData.totalHard) liveStats.hardTotal = faisalData.totalHard;
      if (faisalData.ranking) liveStats.ranking = faisalData.ranking;

      if (faisalData.matchedUserStats && faisalData.matchedUserStats.acSubmissionNum) {
        const acAll = faisalData.matchedUserStats.acSubmissionNum.find(x => x.difficulty === 'All');
        const subAll = faisalData.matchedUserStats.totalSubmissionNum.find(x => x.difficulty === 'All');
        if (acAll && subAll && subAll.submissions > 0) {
          liveStats.acceptanceRate = ((acAll.submissions / subAll.submissions) * 100).toFixed(1) + '%';
        }
      }

      updateStatsDOM(liveStats, 'Live Sync');
    })
    .catch(err => {
      console.warn("LeetCode live sync API fallback:", err.message);
      updateStatsDOM(staticStats, 'Live Sync');
    });

  function updateStatsDOM(stats, mode) {
    if (!elements.solvedCount) return;

    if (stats.avatar && elements.avatar) elements.avatar.src = stats.avatar;
    if (stats.name && elements.name) elements.name.textContent = stats.name;
    if (stats.ranking && elements.rank) elements.rank.innerHTML = `<i class="fas fa-trophy"></i> Rank: ${stats.ranking.toLocaleString()}`;
    if (elements.solvedCount) elements.solvedCount.textContent = stats.solved;
    if (elements.acceptance) elements.acceptance.textContent = stats.acceptanceRate;

    if (elements.heroLeetCodeCount) {
      elements.heroLeetCodeCount.textContent = `${stats.solved}+`;
    }

    if (elements.easySolved) elements.easySolved.textContent = stats.easySolved;
    if (elements.easyTotal) elements.easyTotal.textContent = stats.easyTotal;
    if (elements.mediumSolved) elements.mediumSolved.textContent = stats.mediumSolved;
    if (elements.mediumTotal) elements.mediumTotal.textContent = stats.mediumTotal;
    if (elements.hardSolved) elements.hardSolved.textContent = stats.hardSolved;
    if (elements.hardTotal) elements.hardTotal.textContent = stats.hardTotal;

    setTimeout(() => {
      if (elements.easyBar) elements.easyBar.style.width = `${(stats.easySolved / stats.easyTotal) * 100}%`;
      if (elements.mediumBar) elements.mediumBar.style.width = `${(stats.mediumSolved / stats.mediumTotal) * 100}%`;
      if (elements.hardBar) elements.hardBar.style.width = `${(stats.hardSolved / stats.hardTotal) * 100}%`;

      const r = 54;
      const circumference = 2 * Math.PI * r;
      const totalQuestions = stats.easyTotal + stats.mediumTotal + stats.hardTotal;
      const solvedRatio = Math.min(stats.solved / totalQuestions, 1);
      const dashoffset = circumference - (solvedRatio * circumference);
      
      if (elements.progressCircle) {
        elements.progressCircle.style.strokeDasharray = `${circumference}`;
        elements.progressCircle.style.strokeDashoffset = `${dashoffset}`;
      }
    }, 150);

    // Update Live Sync Badge
    if (elements.syncStatus) {
      if (mode === 'Live Sync') {
        elements.syncStatus.className = 'sync-status online';
        elements.syncStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">Live Sync</span>';
      } else {
        elements.syncStatus.className = 'sync-status offline';
        elements.syncStatus.innerHTML = '<span class="status-dot"></span> <span class="status-text">Archive Mode</span>';
      }
    }
  }
}

