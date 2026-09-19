document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Lucide Icons ---------- */
  if (window.lucide) lucide.createIcons();

  /* ---------- Current Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky Navbar Shadow ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navClose = document.getElementById('navClose');
  const navScrim = document.getElementById('navScrim');

  const openMenu = () => {
    navLinks.classList.add('open');
    navScrim.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navLinks.classList.remove('open');
    navScrim.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', openMenu);
  navClose.addEventListener('click', closeMenu);
  navScrim.addEventListener('click', closeMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Open / Closed Status ---------- */
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');

  const OPEN_MINUTES = 8 * 60;        // 8:00 AM
  const CLOSE_MINUTES = 21 * 60 + 30; // 9:30 PM

  function formatMinutes(mins) {
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${m.toString().padStart(2, '0')} ${period}`;
  }

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const minutesNow = now.getHours() * 60 + now.getMinutes();

    let isOpen = false;
    let label = '';

    if (day === 0) {
      isOpen = false;
      label = `Closed today · Opens Monday ${formatMinutes(OPEN_MINUTES)}`;
    } else if (minutesNow >= OPEN_MINUTES && minutesNow < CLOSE_MINUTES) {
      isOpen = true;
      label = `Open now · Closes ${formatMinutes(CLOSE_MINUTES)}`;
    } else if (minutesNow < OPEN_MINUTES) {
      isOpen = false;
      label = `Closed now · Opens ${formatMinutes(OPEN_MINUTES)}`;
    } else {
      isOpen = false;
      label = `Closed now · Opens ${formatMinutes(OPEN_MINUTES)} tomorrow`;
    }

    if (statusText) statusText.textContent = label;
    if (statusIndicator) {
      statusIndicator.classList.toggle('is-open', isOpen);
      statusIndicator.classList.toggle('is-closed', !isOpen);
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Gallery Lightbox ---------- */
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function showImage(step) {
    currentIndex = (currentIndex + step + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showImage(-1));
  lightboxNext.addEventListener('click', () => showImage(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(-1);
    if (e.key === 'ArrowRight') showImage(1);
  });

  /* ---------- Scroll Reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

});
