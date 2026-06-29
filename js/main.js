/* ═══════════════════════════════════════════════════════════
   PORTFOLIO JS - Gagan Kavaraganahalli Prasanna
   Animations, Theme Toggle, Counters, Form Handling
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Theme Toggle ──────────────────────────────────── */
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  const moonSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
  const sunSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

  function setThemeIcon(theme) {
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? sunSVG : moonSVG;
    }
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    setThemeIcon(theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initialize theme (default: light, respects saved preference)
  const savedTheme = localStorage.getItem('portfolio-theme');
  applyTheme(savedTheme || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── 2. Navbar Behavior ───────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  const navMenuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navAnchors = document.querySelectorAll('.nav-links a');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  // Mobile hamburger toggle
  if (navMenuBtn && navLinks) {
    navMenuBtn.addEventListener('click', () => {
      navMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
  }

  // Close mobile nav on link click
  navAnchors.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenuBtn && navLinks) {
        navMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  });

  // Active link highlighting via Intersection Observer
  const sections = document.querySelectorAll('.section');
  const navObserverOptions = {
    threshold: 0.2,
    rootMargin: '-70px 0px -30% 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  /* ── 3. Smooth Scroll ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── 4. Scroll-Triggered Animations ───────────────────── */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        animObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => animObserver.observe(el));

  /* ── 5. Progress Bars (Skills) ────────────────────────── */
  const progressBars = document.querySelectorAll('.progress-fill');

  function animateProgressNumber(el, target) {
    const duration = 1000;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + '%';
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';

        // Find the corresponding percentage display
        const skillItem = bar.closest('.skill-item');
        if (skillItem) {
          const percentEl = skillItem.querySelector('.skill-percent');
          if (percentEl) {
            animateProgressNumber(percentEl, parseInt(width));
          }
        }
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  /* ── 6. Stat Counters (Achievements) ──────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = eased * target;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(counter => counterObserver.observe(counter));

  /* ── 7. Certificate Card Tilt (Mouse-Follow) ──────────── */
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
