
  // Icons initialisieren
  lucide.createIcons();

  // Elemente greifen
  const drawer = document.getElementById('menu-drawer');
  const btnOpen = document.querySelector('.menu-toggle');
  const btnClose = document.querySelector('.menu-close');
  const backdrop = document.querySelector('.menu-backdrop');
  const focusablesSelector = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let lastFocus = null;

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Fokus in den Drawer verlagern
    const firstFocusable = drawer.querySelector(focusablesSelector);
    firstFocusable?.focus();
    document.addEventListener('keydown', onKey);
  }

  function closeDrawer() {
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    // kurze Verzögerung bis Transition fertig, dann hide
    setTimeout(() => { drawer.hidden = true; lastFocus?.focus(); }, 220);
  }

  function onKey(e) {
    // ESC schließt
    if (e.key === 'Escape') return closeDrawer();
    // Fokus-Trap (Tab im Dialog halten)
    if (e.key === 'Tab') {
      const focusables = Array.from(drawer.querySelectorAll(focusablesSelector)).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  btnOpen.addEventListener('click', () => {
    const expanded = btnOpen.getAttribute('aria-expanded') === 'true';
    if (expanded) { closeDrawer(); btnOpen.setAttribute('aria-expanded', 'false'); }
    else { openDrawer(); btnOpen.setAttribute('aria-expanded', 'true'); }
  });
  btnClose.addEventListener('click', () => { closeDrawer(); btnOpen.setAttribute('aria-expanded', 'false'); });
  backdrop.addEventListener('click', () => { closeDrawer(); btnOpen.setAttribute('aria-expanded', 'false'); });

  // Aktiven Menüpunkt automatisch markieren (Inline + Kachel)
  (function markActive() {
    const path = location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-inline__link, .nav-tile');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (href && href === path) a.classList.add('is-active');
    });
  })();
