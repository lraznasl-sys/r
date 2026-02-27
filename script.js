/* ============================================================
   JOMOR DESIGN CLONE — JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. CUSTOM CURSOR
     ============================================================ */
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower via rAF
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll(
      'a, button, .project-card, .work-item, .service-item, .value-item, .filter-btn'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity   = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity   = '1';
      follower.style.opacity = '1';
    });
  }

  /* ============================================================
     2. STICKY NAV
     ============================================================ */
  const nav = document.getElementById('nav');
  if (nav) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ============================================================
     3. MOBILE MENU
     ============================================================ */
  const burgerBtn   = document.getElementById('burgerBtn');
  const mobileMenu  = document.getElementById('mobileMenu');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burgerBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burgerBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================================
     4. SCROLL REVEAL
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ============================================================
     5. PARALLAX / SKEW ON SCROLL (hero text subtle effect)
     ============================================================ */
  const heroTitle = document.querySelector('.hero__title');
  const heroSub   = document.querySelector('.hero__subtitle');

  if (heroTitle) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      const progress = Math.min(sy / window.innerHeight, 1);

      heroTitle.style.transform = `translateY(${sy * 0.25}px)`;
      heroTitle.style.opacity   = 1 - progress * 1.5;

      if (heroSub) {
        heroSub.style.transform = `translateY(${sy * 0.15}px)`;
        heroSub.style.opacity   = 1 - progress * 2;
      }
    }, { passive: true });
  }

  /* ============================================================
     6. HERO DOT GRID — subtle mouse parallax
     ============================================================ */
  const heroDeco = document.querySelector('.hero__deco');
  if (heroDeco) {
    document.addEventListener('mousemove', e => {
      const xRatio = (e.clientX / window.innerWidth  - 0.5) * 20;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 20;
      heroDeco.style.transform = `translateY(-50%) translate(${xRatio}px, ${yRatio}px)`;
    });
  }

  /* ============================================================
     7. PROJECT CARDS — tilt on mouse move
     ============================================================ */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const xPos   = (e.clientX - rect.left) / rect.width  - 0.5;
      const yPos   = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX   = yPos * -6;
      const rotY   = xPos *  6;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });

  /* ============================================================
     8. WORK LIST — hover preview follower
     ============================================================ */
  const workItems = document.querySelectorAll('.work-item');

  workItems.forEach(item => {
    const preview = item.querySelector('.work-item__preview');
    if (!preview) return;

    item.addEventListener('mousemove', e => {
      preview.style.left = e.clientX + 'px';
      preview.style.top  = e.clientY + 'px';
    });
  });

  /* ============================================================
     9. COUNTER ANIMATION (stats)
     ============================================================ */
  const statNums = document.querySelectorAll('.stat__num');

  if (statNums.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const rawText = el.textContent;
        const numPart = parseInt(rawText.replace(/\D/g, ''), 10);
        const suffix  = rawText.replace(/[\d]/g, '');

        let start     = 0;
        const duration = 1200;
        const step    = 16;
        const inc     = numPart / (duration / step);

        const timer = setInterval(() => {
          start += inc;
          if (start >= numPart) {
            el.textContent = numPart + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(start) + suffix;
          }
        }, step);

        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  /* ============================================================
     10. SMOOTH ANCHOR SCROLLING
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ============================================================
     11. PAGE LOAD ANIMATION
     ============================================================ */
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  /* ============================================================
     12. NAV ACTIVE STATE
     ============================================================ */
  const navLinks = document.querySelectorAll('.nav__link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.style.opacity = '1';
      link.style.borderBottom = '1px solid #fff';
    }
  });

})();
