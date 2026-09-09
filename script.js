// Sakshi Thareja Portfolio - Mobile Navigation, Dynamic Grid, Mouse Spotlight, Scroll Reveal & Letter Assembly
document.addEventListener('DOMContentLoaded', () => {
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
     2. Dynamic Spacious Dot Grid Generation (Restored 48px Spacing)
     -------------------------------------------------------------------------- */
  const gridContainer = document.getElementById('interactive-grid');

  if (gridContainer) {
    const SPACING = 48; // Restored spacious 48px grid cell spacing

    function populateDotGrid() {
      gridContainer.innerHTML = ''; // Clear existing grid

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate number of columns and rows needed for wide, spacious grid
      const cols = Math.ceil(viewportWidth / SPACING);
      const rows = Math.ceil(viewportHeight / SPACING);

      gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${SPACING}px)`;
      gridContainer.style.gridTemplateRows = `repeat(${rows}, ${SPACING}px)`;

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

      gridContainer.appendChild(fragment);
    }

    // Initial Grid Generation
    populateDotGrid();

    // Debounced Resize Listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(populateDotGrid, 150);
    });
  }

  /* --------------------------------------------------------------------------
     3. Mouse-Tracking Spotlight Cursor Listener
     -------------------------------------------------------------------------- */
  document.addEventListener('mousemove', (e) => {
    const grid = document.getElementById('interactive-grid');
    if (grid) {
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
