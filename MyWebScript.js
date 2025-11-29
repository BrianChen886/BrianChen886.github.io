// --- Shared sidebar controller for all pages ---
// Grab elements (they may be missing on some pages, so we use optional chaining)
const menuBtn  = document.getElementById('menuToggle');
const sidebar  = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeBtn');
const topbar = document.querySelector('.topbar');
let backdrop   = document.querySelector('.backdrop');

// Create a backdrop if not present
if (!backdrop) {
  backdrop = document.createElement('div');
  backdrop.className = 'backdrop';
  document.body.appendChild(backdrop);
}

// Helpers
function lockScroll()   { document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden'; }
function unlockScroll() { document.documentElement.style.overflow = '';        document.body.style.overflow = ''; }

// Open/close logic
function openSidebar() {
  if (!sidebar) return;
  sidebar.classList.add('open');
  backdrop.classList.add('show');
  menuBtn?.classList.add('hidden'); // hide ☰ while open
  menuBtn?.setAttribute('aria-expanded', 'true');
  lockScroll();
}
function closeSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove('open');
  backdrop.classList.remove('show');
  menuBtn?.classList.remove('hidden');
  menuBtn?.setAttribute('aria-expanded', 'false');
  unlockScroll();
}

// Bind events (guard for existence)
menuBtn?.setAttribute('aria-controls', 'sidebar');
menuBtn?.setAttribute('aria-expanded', 'false');
menuBtn?.addEventListener('click', openSidebar);
menuBtn?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSidebar(); }
});

closeBtn?.addEventListener('click', (e) => { e.preventDefault(); closeSidebar(); });
backdrop?.addEventListener('click', closeSidebar);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// Close when any link in the sidebar is clicked
sidebar?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => closeSidebar());
});

// Ensure correct state when resizing: if we go back to desktop width, force-close the drawer
const BREAKPOINT = 860; // must match CSS media query
let resizeTimer;
function applyResponsiveState() {
  if (window.innerWidth > BREAKPOINT) {
    // Desktop: make sure drawer is closed and scroll unlocked
    closeSidebar();
  }
}
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(applyResponsiveState, 120);
});
window.addEventListener('load', applyResponsiveState);