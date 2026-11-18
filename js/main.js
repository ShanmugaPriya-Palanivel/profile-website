/* ============================================================
   MAIN.JS — ALL VANILLA JS INTERACTIONS
   Features:
     • Sticky nav + scrolled shadow
     • Hamburger menu (mobile)
     • Active nav-link on scroll
     • IntersectionObserver scroll animations
     • Timeline "Show more / Show less" toggle
     • Hobby lightbox modal (keyboard & click)
     • Back-to-top button visibility
     • Footer copyright year
   ============================================================ */

'use strict';

/* ── DOM REFERENCES ────────────────────────────────────────── */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navLinkEls  = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id], footer[id]');
const animateEls  = document.querySelectorAll('[data-animate]');
const showMoreBtns= document.querySelectorAll('.show-more-btn');
const hobbyCards  = document.querySelectorAll('.hobby-card[data-hobby]');
const lightbox    = document.getElementById('lightbox');
const lightboxClose    = document.getElementById('lightboxClose');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxTitle    = document.getElementById('lightboxTitle');
const lightboxDesc     = document.getElementById('lightboxDesc');
const lightboxTags     = document.getElementById('lightboxTags');
const lightboxArtPreview = document.getElementById('lightboxArtPreview');
const backToTop   = document.querySelector('.back-to-top');
const copyright   = document.getElementById('copyright');
const profilePhoto = document.querySelector('.profile-photo');

if (profilePhoto) {
  if (profilePhoto.complete && profilePhoto.naturalWidth === 0) {
    profilePhoto.hidden = true;
  }
  profilePhoto.addEventListener('error', () => {
    profilePhoto.hidden = true;
  }, { once: true });
}

/* ── UTILITY ────────────────────────────────────────────────── */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── 1 · NAV: SCROLLED SHADOW ───────────────────────────────── */
function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
  backToTop.classList.toggle('visible', window.scrollY > 400);
}
window.addEventListener('scroll', debounce(handleNavScroll, 10), { passive: true });

/* ── 2 · HAMBURGER MENU ─────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  navLinks.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close menu when a link is clicked */
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── 3 · ACTIVE NAV LINK ON SCROLL ─────────────────────────── */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: `-${64}px 0px -60% 0px`, threshold: 0 });

sections.forEach(sec => sectionObserver.observe(sec));

/* ── 4 · SCROLL-TRIGGERED ANIMATIONS ───────────────────────── */
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      /* Stagger siblings */
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.querySelectorAll('[data-animate]')]
        : [];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => animateObserver.observe(el));

/* ── 5 · TIMELINE "SHOW MORE / SHOW LESS" ───────────────────── */
showMoreBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const extra = btn.nextElementSibling;
    const isOpen = !extra.hidden;

    if (isOpen) {
      extra.hidden = true;
      btn.textContent = 'Show more \u25BC';
      btn.setAttribute('aria-expanded', 'false');
    } else {
      extra.hidden = false;
      btn.textContent = 'Show less \u25B2';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ── 6 · LIGHTBOX ──────────────────────────────────────────── */
function openLightbox(card) {
  const title    = card.dataset.title;
  const desc     = card.dataset.desc;
  const tags     = card.dataset.tags ? card.dataset.tags.split(',') : [];

  /* Show the same supplied photograph in the lightbox. */
  lightboxArtPreview.replaceChildren();
  const cardPhoto = card.querySelector('.hobby-photo');
  if (cardPhoto) {
    const previewPhoto = cardPhoto.cloneNode();
    previewPhoto.className = 'lightbox-photo';
    previewPhoto.alt = title;
    lightboxArtPreview.appendChild(previewPhoto);
  }

  /* Content */
  lightboxTitle.textContent = title;
  lightboxDesc.textContent  = desc;

  lightboxTags.innerHTML = tags
    .map(t => `<span class="lightbox-tag">${t.trim()}</span>`)
    .join('');

  /* Show */
  lightbox.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.setAttribute('hidden', '');
  document.body.style.overflow = '';
  /* Return focus to the card that opened it */
  if (lightbox._opener) { lightbox._opener.focus(); lightbox._opener = null; }
}

hobbyCards.forEach(card => {
  card.addEventListener('click', () => {
    lightbox._opener = card;
    openLightbox(card);
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      lightbox._opener = card;
      openLightbox(card);
    }
  });
});

const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');

    themeToggle.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    themeToggle.setAttribute('aria-pressed', String(isDark));
  });
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
    closeLightbox();
  }
});

/* Focus trap inside lightbox */
lightbox.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = [...lightbox.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')];
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
});

/* ── 7 · COPYRIGHT YEAR ─────────────────────────────────────── */
if (copyright) {
  copyright.textContent = `© ${new Date().getFullYear()} Shanmugapriya Palanivel. All rights reserved.`;
}

/* ── 8 · SMOOTH SCROLL (fallback for older browsers) ────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

