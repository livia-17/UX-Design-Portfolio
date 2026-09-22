// Sakshi Thareja Portfolio - Mobile Navigation, Dynamic Grid, Mouse Spotlight, Scroll Reveal & Letter Assembly
document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------------------------------
     Native Hardware-Accelerated Smooth Scrolling for Anchor Links
     Eliminates subpixel text rasterization ghosting and drop-shadow artifacts
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     0 & 2. Full-Screen "Finding Alignment" Loading Animation
     - Phase 1: Chaos / Infinite Possibilities (dots appear randomly across the screen)
     - Phase 2: Finding Alignment (dots smoothly glide into their precise grid coordinates)
     - Phase 3: Order & Rest (all dots at rest in uniform grid, headline fades in)
     -------------------------------------------------------------------------- */
  const gridElement = document.getElementById('interactive-grid');

  if (gridElement) {
    document.body.classList.add('is-loading');
  } else {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }

  if (gridElement && gridElement.tagName === 'CANVAS') {
    const canvas = gridElement;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let dots = [];
    let SPACING = width < 768 ? 26 : 36;
    let mouseX = -9999;
    let mouseY = -9999;
    let startTime = performance.now();
    let isLoaded = false;

    // Smooth Cubic Ease-Out for calm, gentle alignment deceleration
    function easeOutCubic(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    function initDots(alreadyLoaded = false) {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Minimized distance between dots: 26px on phones, 36px on desktop/laptop
      SPACING = width < 768 ? 26 : 36;
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / SPACING) + 2;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const targetX = offsetX + c * SPACING;
          const targetY = offsetY + r * SPACING;

          // Subtle organic offset so dots appear randomly scattered, not in an obvious grid
          const angle = Math.random() * Math.PI * 2;
          const dist = 18 + Math.random() * 32; // Gentle 18px-50px local scatter
          const startX = targetX + Math.cos(angle) * dist;
          const startY = targetY + Math.sin(angle) * dist;

          // Staggered appearance time (0.0s to 0.75s)
          const appearTime = Math.random() * 0.75;

          // Staggered calm alignment start time (0.95s to 1.25s)
          const alignStartTime = 0.95 + Math.random() * 0.3;
          // Smooth glide duration (1.2s to 1.5s)
          const alignDuration = 1.2 + Math.random() * 0.3;

          dots.push({
            targetX,
            targetY,
            startX,
            startY,
            appearTime,
            alignStartTime,
            alignDuration,
            // If already loaded (e.g. on window resize), position directly at grid target
            currentX: alreadyLoaded ? targetX : startX,
            currentY: alreadyLoaded ? targetY : startY
          });
        }
      }
    }

    initDots(false);

    window.addEventListener('resize', () => {
      initDots(isLoaded);
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    function render(now) {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      const isFooter = document.body.classList.contains('footer-grid-active');
      let allSettled = true;

      // Render dots across the entire screen
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let x = dot.targetX;
        let y = dot.targetY;
        let radius = 0.9; // Minimized resting radius (1.8px diameter)
        let alpha = 0.75; // Resting opacity

        if (!isLoaded) {
          // If dot hasn't appeared yet
          if (elapsed < dot.appearTime) {
            allSettled = false;
            continue;
          }

          // Gentle fade-in during initial appearance (over 0.35s)
          const appearProgress = Math.min(1, (elapsed - dot.appearTime) / 0.35);

          if (elapsed < dot.alignStartTime) {
            // PHASE 1: DOTS APPEAR RANDOMLY AT SCATTERED POSITIONS
            allSettled = false;
            x = dot.startX;
            y = dot.startY;
            alpha = 0.75 * appearProgress;
          } else {
            // PHASE 2: MINIMAL & CALM ALIGNMENT INTO GRID POSITIONS
            const alignElapsed = elapsed - dot.alignStartTime;
            const p = Math.min(1, alignElapsed / dot.alignDuration);

            if (p < 1) {
              allSettled = false;
              const ease = easeOutCubic(p);
              x = dot.startX + (dot.targetX - dot.startX) * ease;
              y = dot.startY + (dot.targetY - dot.startY) * ease;
              alpha = 0.75;
            } else {
              // Perfectly settled at grid coordinate
              x = dot.targetX;
              y = dot.targetY;
              alpha = 0.75;
            }
          }
        }

        // PHASE 3: INTERACTIVE SPOTLIGHT ON RESTING GRID
        if (isLoaded && mouseX > -1000) {
          const dist = Math.hypot(x - mouseX, y - mouseY);
          if (dist < 150) {
            const factor = 1 - dist / 150;
            radius = Math.max(radius, 0.9 + 0.7 * factor);
            alpha = Math.min(1.0, alpha + 0.25 * factor);
          }
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (isFooter) {
          ctx.fillStyle = `rgba(10, 46, 92, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fill();
      }

      // When all dots have completed their alignment and come to complete rest:
      if (!isLoaded && (allSettled || elapsed >= 2.9)) {
        isLoaded = true;
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // Safety fallback timer
    setTimeout(() => {
      if (!isLoaded) {
        isLoaded = true;
        document.body.classList.remove('is-loading');
        document.body.classList.add('is-loaded');
      }
    }, 4500);

  } else if (gridElement) {
    // Fallback for DOM-based subpages with div#interactive-grid
    const SPACING = 36;

    function populateDotGrid() {
      gridElement.innerHTML = '';
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const cols = Math.ceil(viewportWidth / SPACING);
      const rows = Math.ceil(viewportHeight / SPACING);
      gridElement.style.gridTemplateColumns = `repeat(${cols}, ${SPACING}px)`;
      gridElement.style.gridTemplateRows = `repeat(${rows}, ${SPACING}px)`;

      const totalDots = cols * rows;
      const fragment = document.createDocumentFragment();

      for (let i = 0; i < totalDots; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const dot = document.createElement('div');
        dot.className = 'grid-dot';
        cell.appendChild(dot);
        fragment.appendChild(cell);
      }
      gridElement.appendChild(fragment);
    }

    populateDotGrid();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(populateDotGrid, 150);
    });

    setTimeout(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded');
    }, 2000);
  } else {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }

  /* --------------------------------------------------------------------------
     1. Mobile Navigation Toggle Logic
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('is-active');
      primaryNav.classList.toggle('is-open');
    });

    document.addEventListener('click', (event) => {
      if (!menuToggle.contains(event.target) && !primaryNav.contains(event.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        primaryNav.classList.remove('is-open');
      }
    });

    primaryNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        primaryNav.classList.remove('is-open');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. Mouse-Tracking Spotlight Cursor Listener (for DOM fallback)
     -------------------------------------------------------------------------- */
  document.addEventListener('mousemove', (e) => {
    const grid = document.getElementById('interactive-grid');
    if (grid && grid.tagName !== 'CANVAS') {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      grid.style.setProperty('--mouse-x', `${x}px`);
      grid.style.setProperty('--mouse-y', `${y}px`);
    }
  });

  /* --------------------------------------------------------------------------
     4. Intersection Observer Scroll-Triggered Fade & Slide Animation (#about-intro & #work-intro)
     -------------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  const aboutIntroSection = document.getElementById('about-intro');
  if (aboutIntroSection) {
    revealObserver.observe(aboutIntroSection);
  }

  const workIntroSection = document.getElementById('work') || document.getElementById('work-intro');
  if (workIntroSection) {
    revealObserver.observe(workIntroSection);
  }

  const smallBusinessIntroSection = document.getElementById('small-business-intro');
  if (smallBusinessIntroSection) {
    revealObserver.observe(smallBusinessIntroSection);
  }

  const liviaStatementSection = document.getElementById('livia-statement');
  if (liviaStatementSection) {
    revealObserver.observe(liviaStatementSection);
  }

  /* Dedicated Intersection Observer for .fade-in-section elements (15% threshold) */
  const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Triggers when 15% of the element is visible
  };

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, fadeObserverOptions);

  const fadeElements = document.querySelectorAll('.fade-in-section');
  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });
  /* --------------------------------------------------------------------------
     Footer Grid Intersection Observer (Transforms grid dots to blue when in footer)
     -------------------------------------------------------------------------- */
  const footerSection = document.querySelector('.site-footer');
  if (footerSection) {
    const footerGridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.body.classList.add('footer-grid-active');
        } else {
          document.body.classList.remove('footer-grid-active');
        }
      });
    }, {
      threshold: 0.05
    });

    footerGridObserver.observe(footerSection);
  }



  /* --------------------------------------------------------------------------
     5. Hero Headline Fade-In (Handled via CSS smoothFadeIn animation)
     -------------------------------------------------------------------------- */

  /* --------------------------------------------------------------------------
     6. Custom Tracking Cursor Logic
     -------------------------------------------------------------------------- */
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    // Track mouse movement, update coordinates with setProperty ('important' flag) and reveal cursor
    document.addEventListener('mousemove', (e) => {
      cursor.style.setProperty('left', e.clientX + 'px', 'important');
      cursor.style.setProperty('top', e.clientY + 'px', 'important');
      cursor.style.setProperty('opacity', '1', 'important');
    });

    // Define all elements that should trigger the active state
    const interactiveSelector = 'a, button, .glass-tag, .project-card, .floating-card, input, textarea, .navbar-brand';
    const interactiveElements = document.querySelectorAll(interactiveSelector);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });

    // Event delegation to catch all dynamic and nested hover states seamlessly
    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        cursor.classList.add('is-active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
        const related = e.relatedTarget;
        if (!related || !related.closest || !related.closest(interactiveSelector)) {
          cursor.classList.remove('is-active');
        }
      }
    });
  } else {
    console.error('Custom cursor element not found in the DOM.');
  }
});
