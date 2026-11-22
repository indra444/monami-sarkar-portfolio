(function () {
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = nav.querySelectorAll('a');

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header border once scrolled
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  navLinks.forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });

  // Highlight the nav link for the section in view
  const byId = {};
  navLinks.forEach((a) => { byId[a.getAttribute('href').slice(1)] = a; });
  const sections = Object.keys(byId).map((id) => document.getElementById(id)).filter(Boolean);
  const setActive = (id) => {
    navLinks.forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
    const link = byId[id];
    if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'true'); }
  };
  const updateActive = () => {
    // At the very bottom, the last section is active even if short
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      return setActive(sections[sections.length - 1].id);
    }
    const line = window.innerHeight * 0.4;
    let current = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top <= line) current = s.id; });
    setActive(current);
  };
  updateActive();
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);

  // Copy email
  const copyBtn = document.querySelector('.copy-btn');
  const status = document.querySelector('.copy-status');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.copy;
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = 'Email copied to clipboard';
        copyBtn.textContent = 'Copied';
      } catch {
        status.textContent = 'Couldn’t copy — please select the address above';
      }
      setTimeout(() => { status.textContent = ''; copyBtn.textContent = 'Copy'; }, 2500);
    });
  }
})();
