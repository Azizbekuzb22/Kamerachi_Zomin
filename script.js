/* ============================================================
   KAMERACHI_ZOMIN — CCTV Xavfsizlik Tizimi
   Premium Dark Theme JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     Yordamchi funksiyalar
  ---------------------------------------------------------- */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => ctx.querySelectorAll(sel);

  // Throttle — scroll va resize uchun
  function throttle(fn, ms = 16) {
    let last = 0, raf = null;
    return function (...args) {
      const now = performance.now();
      if (now - last >= ms) { last = now; fn.apply(this, args); }
      else {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { last = performance.now(); fn.apply(this, args); });
      }
    };
  }

  /* ==========================================================
     1. LOADING SCREEN
  ========================================================== */
  const loadingScreen = qs('#loading-screen');

  function hideLoadingScreen() {
    if (!loadingScreen) return;
    setTimeout(() => {
      loadingScreen.classList.add('loading-hidden');
      loadingScreen.addEventListener('transitionend', () => {
        loadingScreen.style.display = 'none';
        animateHeroEntrance();
      }, { once: true });
    }, 2000);
  }

  window.addEventListener('load', hideLoadingScreen);

  /* ==========================================================
     2. SCROLL PROGRESS INDICATOR
  ========================================================== */
  const scrollProgress = qs('#scroll-progress');

  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = docHeight > 0 ? scrollTop / docHeight : 0;
    scrollProgress.style.transform = `scaleX(${percentage})`;
  }

  /* ==========================================================
     3. NAVBAR SCROLL EFFECT
  ========================================================== */
  const navbar = qs('#navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ==========================================================
     4. NAVBAR ACTIVE LINK HIGHLIGHTING
  ========================================================== */
  const sectionIds = ['hero', 'xizmatlar', 'jarayon', 'statistika', 'mahsulotlar', 'biz-haqimizda', 'aloqa'];
  const navLinks   = qsa('.nav-links a');

  function highlightActiveLink() {
    const scrollPos = window.scrollY + 120;

    let currentId = '';
    sectionIds.forEach(id => {
      const section = qs(`#${id}`);
      if (section && section.offsetTop <= scrollPos) {
        currentId = id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  /* — Bitta throttled scroll handler — */
  const onScroll = throttle(() => {
    updateScrollProgress();
    handleNavbarScroll();
    highlightActiveLink();
    handleParallax();
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ==========================================================
     5. MOBILE MENU TOGGLE
  ========================================================== */
  const hamburger  = qs('.hamburger');
  const mobileMenu = qs('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Havola bosilganda yopish
    qsa('a', mobileMenu).forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    // Tashqariga bosilganda yopish
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  /* ==========================================================
     6. SMOOTH SCROLL
  ========================================================== */
  const NAVBAR_HEIGHT = 80;

  qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = qs(targetId);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ==========================================================
     7. SCROLL REVEAL ANIMATIONS
  ========================================================== */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  qsa('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================
     8. HERO ENTRANCE ANIMATIONS
  ========================================================== */
  const heroElements = [
    { sel: '.hero-badge',    delay: 300  },
    { sel: '.hero-title',    delay: 600  },
    { sel: '.hero-subtitle', delay: 900  },
    { sel: '.hero-buttons',  delay: 1200 }
  ];

  // Dastlabki holatini o'rnatish
  heroElements.forEach(({ sel }) => {
    const el = qs(sel);
    if (el) {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(30px)';
      el.style.transition = 'all 0.8s ease';
    }
  });

  function animateHeroEntrance() {
    heroElements.forEach(({ sel, delay }) => {
      const el = qs(sel);
      if (!el) return;
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });
  }

  /* ==========================================================
     9. ANIMATED COUNTERS
  ========================================================== */
  let countersTriggered = false;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return; // 24/7 kabi statik qiymat
    const duration = 2000;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutQuart(progress) * target);
      el.textContent = value.toLocaleString('uz-UZ');

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target.toLocaleString('uz-UZ') + '+';
      }
    }

    requestAnimationFrame(tick);
  }

  const statsSection = qs('#statistika');

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersTriggered) {
          countersTriggered = true;
          qsa('.stat-number').forEach(animateCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================================
     10. TESTIMONIALS CAROUSEL (Olib tashlangan)
     ========================================================== */

  /* ==========================================================
     11. PORTFOLIO LIGHTBOX (Olib tashlangan)
     ========================================================== */

  /* ==========================================================
     12. MOUSE LIGHT EFFECT
  ========================================================== */
  const mouseLight = qs('#mouse-light');
  let mouseLightRAF = null;
  let mouseX = -200, mouseY = -200;

  function updateMouseLight() {
    if (mouseLight) {
      mouseLight.style.left = `${mouseX}px`;
      mouseLight.style.top  = `${mouseY}px`;
    }
    mouseLightRAF = null;
  }

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!mouseLightRAF) {
      mouseLightRAF = requestAnimationFrame(updateMouseLight);
    }
  }, { passive: true });

  /* ==========================================================
     13. PARTICLE BACKGROUND (Canvas)
  ========================================================== */
  const canvas = qs('#particles-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT    = 80;
    const CONNECTION_DIST   = 120;
    let particles = [];
    let particleRAF = null;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const isRed = Math.random() > 0.5;
        particles.push({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          r:  Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          color: isRed ? 'rgba(220,38,38,0.3)' : 'rgba(255,255,255,0.15)'
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Zarrachalarni yangilash va chizish
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Chegaradan o'tganda qayta chiqish
        if (p.x < 0)             p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0)             p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      // Yaqin zarrachalar orasidagi chiziqlar
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(220,38,38,${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particleRAF = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', throttle(() => {
      resizeCanvas();
      createParticles();
    }, 250));
  }

  /* ==========================================================
     14. CONTACT FORM VALIDATION
  ========================================================== */
  const contactForm = qs('#contact-form');

  if (contactForm) {
    const nameInput    = qs('#contact-name',    contactForm);
    const phoneInput   = qs('#contact-phone',   contactForm);
    const messageInput = qs('#contact-message', contactForm);
    const formSuccess  = qs('#form-success');

    function showError(input, errorId) {
      if (input) input.classList.add('error');
      const errEl = qs(`#${errorId}`);
      if (errEl) errEl.classList.add('visible');
    }

    function hideError(input, errorId) {
      if (input) input.classList.remove('error');
      const errEl = qs(`#${errorId}`);
      if (errEl) errEl.classList.remove('visible');
    }

    function validatePhone(value) {
      // +998XXXXXXXXX yoki 998XXXXXXXXX yoki boshqa formatlar
      const cleaned = value.replace(/[\s\-\(\)]/g, '');
      return /^(\+?998)\d{9}$/.test(cleaned);
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Ism tekshirish
      if (!nameInput || nameInput.value.trim().length < 2) {
        showError(nameInput, 'name-error');
        isValid = false;
      } else {
        hideError(nameInput, 'name-error');
      }

      // Telefon tekshirish
      if (!phoneInput || !validatePhone(phoneInput.value.trim())) {
        showError(phoneInput, 'phone-error');
        isValid = false;
      } else {
        hideError(phoneInput, 'phone-error');
      }

      // Xabar tekshirish
      if (!messageInput || messageInput.value.trim().length < 10) {
        showError(messageInput, 'message-error');
        isValid = false;
      } else {
        hideError(messageInput, 'message-error');
      }

      if (isValid) {
        contactForm.reset();
        if (formSuccess) {
          formSuccess.classList.add('visible');
          setTimeout(() => formSuccess.classList.remove('visible'), 5000);
        }
      }
    });

    // Yozish paytida xatoni tozalash
    const inputErrorMap = [
      { input: nameInput, errorId: 'name-error' },
      { input: phoneInput, errorId: 'phone-error' },
      { input: messageInput, errorId: 'message-error' }
    ];
    inputErrorMap.forEach(({ input, errorId }) => {
      if (input) {
        input.addEventListener('input', () => {
          input.classList.remove('error');
          const errEl = qs(`#${errorId}`);
          if (errEl) errEl.classList.remove('visible');
        });
      }
    });
  }

  /* ==========================================================
     15. PARALLAX EFFECT
  ========================================================== */
  const heroContent   = qs('.hero-content');
  const floatingIcons = qsa('.floating-icon');

  function handleParallax() {
    if (window.innerWidth <= 768) return;
    const scrollY = window.scrollY;

    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    }

    floatingIcons.forEach((icon, i) => {
      const speed = 0.1 + (i * 0.05);
      icon.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  /* ==========================================================
     16. NAVBAR HIDE/SHOW ON SCROLL
     (3-bandda birlashtirilgan — scrolled klassi orqali backdrop)
  ========================================================== */
  // Barcha mantiq 3-bandda amalga oshirilgan

  // Page Visibility API handles are no longer needed since the auto-sliding testimonials carousel was removed.

  /* ----------------------------------------------------------
     Dastlabki holatni ishga tushirish
  ---------------------------------------------------------- */
  updateScrollProgress();
  handleNavbarScroll();
  highlightActiveLink();
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});
