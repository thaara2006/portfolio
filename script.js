document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initHeaderScroll();
  initActiveNavLinkOnScroll();
  initTypewriter();
  initScrollReveal();
  initLeetCodeStats();
  initProjectFilter();
});

/* Theme Toggle Logic */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check user preference in localStorage, default to dark
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

/* Custom Typewriter Effect */
function initTypewriter() {
  const words = ['Full-Stack AI/ML Engineer', 'Python Programming enthusiast', 'Data Analyst', 'Full-Stack Developer'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedTextSpan = document.getElementById('typed-text');
  if (!typedTextSpan) return;

  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenWords = 2000;

  function type() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      nextSpeed = delayBetweenWords;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      nextSpeed = 500;
    }

    setTimeout(type, nextSpeed);
  }

  setTimeout(type, 500);
}

/* Intersection Observer for Scroll Reveals & Skill Bar Animations */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

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

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fillBar = entry.target;
        const widthVal = fillBar.getAttribute('data-width');
        fillBar.style.width = widthVal;
      }
    });
  }, {
    threshold: 0.2
  });

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
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

/* LeetCode Dynamic Stats Integration */
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
    progressCircle: document.getElementById('leetcode-progress-circle')
  };

  const staticStats = {
    name: "Thaaranyaashree S",
    username: "Thaara06",
    avatar: "https://assets.leetcode.com/users/Thaara06/avatar_1758620144.png",
    ranking: 346295,
    solved: 371,
    easySolved: 297,
    mediumSolved: 71,
    hardSolved: 3,
    easyTotal: 830,
    mediumTotal: 1720,
    hardTotal: 740,
    acceptanceRate: "59.0%"
  };

  updateStatsDOM(staticStats, 'Archive Mode');

  const username = "Thaara06";
  const profileUrl = `https://alfa-leetcode-api.onrender.com/${username}`;
  const solvedUrl = `https://alfa-leetcode-api.onrender.com/${username}/solved`;

  const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request Timeout')), timeout))
    ]);
  };

  Promise.all([
    fetchWithTimeout(profileUrl).then(res => {
      if (!res.ok) throw new Error('Profile fetch failed');
      return res.json();
    }),
    fetchWithTimeout(solvedUrl).then(res => {
      if (!res.ok) throw new Error('Solved stats fetch failed');
      return res.json();
    })
  ])
  .then(([profileData, solvedData]) => {
    const easyTotal = 830;
    const mediumTotal = 1720;
    const hardTotal = 740;

    let acceptanceRate = staticStats.acceptanceRate;
    if (solvedData.acSubmissionNum && solvedData.totalSubmissionNum) {
      const acAll = solvedData.acSubmissionNum.find(x => x.difficulty === 'All');
      const subAll = solvedData.totalSubmissionNum.find(x => x.difficulty === 'All');
      if (acAll && subAll && subAll.submissions > 0) {
        acceptanceRate = ((acAll.submissions / subAll.submissions) * 100).toFixed(1) + '%';
      }
    }

    const liveStats = {
      name: profileData.name || staticStats.name,
      username: username,
      avatar: profileData.avatar || staticStats.avatar,
      ranking: profileData.ranking || staticStats.ranking,
      solved: solvedData.solvedProblem || staticStats.solved,
      easySolved: solvedData.easySolved || staticStats.easySolved,
      mediumSolved: solvedData.mediumSolved || staticStats.mediumSolved,
      hardSolved: solvedData.hardSolved || staticStats.hardSolved,
      easyTotal: easyTotal,
      mediumTotal: mediumTotal,
      hardTotal: hardTotal,
      acceptanceRate: acceptanceRate
    };

    updateStatsDOM(liveStats, 'Live Sync');
  })
  .catch(err => {
    console.warn("LeetCode dynamic API fetch failed, remaining in archive mode:", err);
    updateStatsDOM(staticStats, 'Archive Mode');
  });

  function updateStatsDOM(stats, mode) {
    if (!elements.solvedCount) return;

    if (stats.avatar && elements.avatar) elements.avatar.src = stats.avatar;
    if (stats.name && elements.name) elements.name.textContent = stats.name;
    if (stats.ranking && elements.rank) elements.rank.innerHTML = `<i class="fas fa-trophy"></i> Rank: ${stats.ranking.toLocaleString()}`;
    if (elements.solvedCount) elements.solvedCount.textContent = stats.solved;
    if (elements.acceptance) elements.acceptance.textContent = stats.acceptanceRate;

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
