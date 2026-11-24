// src/lib/scrollMotion.js
// ------------------------------------------------------------------
// Premium motion layer for the portfolio:
//   1. Lenis smooth scrolling, synced to GSAP's ticker.
//   2. GSAP ScrollTrigger word-by-word reveals for headings
//      (h1/h2/h3) — each word rises out of a mask as you scroll.
// This module is side-effect only: importing it once (in main.jsx)
// activates everything. It watches the DOM, so sections mounted
// later (after the preloader) are picked up automatically.
// Respects prefers-reduced-motion: then nothing is touched.
// ------------------------------------------------------------------
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- injected styles ---------------- */
const css = `
html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }
.lenis.lenis-stopped { overflow: hidden; }
.wmask { display: inline-block; overflow: hidden; vertical-align: bottom; padding-bottom: 0.14em; margin-bottom: -0.14em; }
.wword { display: inline-block; transform-origin: 0% 100%; will-change: transform; }
`;
if (typeof document !== 'undefined' && !document.querySelector('style[data-scroll-motion]')) {
  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-scroll-motion', '');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);
}

/* ---------------- Lenis smooth scroll ---------------- */
let lenis = null;
if (!prefersReduced) {
  lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

/* Smooth in-page anchor navigation through Lenis */
document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const hash = anchor.getAttribute('href');
  if (!hash || hash.length < 2) return;
  const target = document.querySelector(hash);
  if (!target) return;
  event.preventDefault();
  if (lenis) {
    lenis.scrollTo(target, { offset: -72, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: 'smooth' });
  }
});

/* ---------------- word splitting ---------------- */
function collectWords(el) {
  const words = [];
  const process = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        // Text node: split into words, keep the spaces between them.
        if (!child.textContent.trim()) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const mask = document.createElement('span');
            mask.className = 'wmask';
            const inner = document.createElement('span');
            inner.className = 'wword';
            inner.textContent = part;
            mask.appendChild(inner);
            frag.appendChild(mask);
            words.push(inner);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        const tag = child.tagName;
        if (tag === 'BR') return;
        if (
          child.hasAttribute('data-text') ||
          tag === 'SVG' ||
          tag === 'IMG' ||
          tag === 'CANVAS'
        ) {
          // Rich inline element (e.g. LineShadowText): animate as one unit.
          const mask = document.createElement('span');
          mask.className = 'wmask';
          node.insertBefore(mask, child);
          mask.appendChild(child);
          child.classList.add('wword');
          words.push(child);
        } else {
          process(child);
        }
      }
    });
  };
  process(el);
  return words;
}

function splitHeading(el) {
  if (el.dataset.wsplit) return false;
  el.dataset.wsplit = '1';
  if (!el.textContent || !el.textContent.trim()) return false;
  // Never touch headings inside the header/nav/footer or inside
  // interactive cards (.group) whose text React re-renders in place.
  if (el.closest('header, nav, footer, .group, [data-no-reveal]')) return false;
  if (el.querySelector('canvas, video, img')) return false;

  const words = collectWords(el);
  if (!words.length) return false;

  gsap.fromTo(
    words,
    { yPercent: 115, rotate: 5 },
    {
      yPercent: 0,
      rotate: 0,
      duration: 0.9,
      ease: 'power4.out',
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    }
  );
  return true;
}

/* ---------------- DOM scanning ---------------- */
let scanQueued = false;
function scan() {
  if (scanQueued) return;
  scanQueued = true;
  requestAnimationFrame(() => {
    scanQueued = false;
    let changed = 0;
    document
      .querySelectorAll('h1:not([data-wsplit]), h2:not([data-wsplit]), h3:not([data-wsplit])')
      .forEach((el) => {
        if (splitHeading(el)) changed += 1;
      });
    if (changed > 0) ScrollTrigger.refresh();
  });
}

if (!prefersReduced && typeof document !== 'undefined') {
  const observer = new MutationObserver(scan);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  window.addEventListener('load', scan);
  scan();
  // The app is fully mounted long before this; stop watching to save cycles.
  setTimeout(() => observer.disconnect(), 30000);
}

export default lenis;
