/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO — MAIN SCRIPT
   Harsh Kumar Singh — Data Science & AI-ML Engineer
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initContactForm();
  initActiveNav();
  initCopyEmail();
});


/* ─── Scroll-triggered Animations ─────────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.anim-fade-in, .anim-slide-up');

  // Immediately reveal hero elements (above the fold)
  const heroElements = document.querySelectorAll('.hero .anim-fade-in');
  heroElements.forEach(el => el.classList.add('visible'));

  // IntersectionObserver for the rest
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => {
    // Skip hero elements (already revealed)
    if (el.closest('.hero')) return;
    observer.observe(el);
  });
}


/* ─── Navbar Scroll Effect ────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let ticking = false;

  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  updateNavbar();
}


/* ─── Mobile Menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}


/* ─── Smooth Scroll for Anchor Links ─────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ─── Active Navigation Highlight ─────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-80px 0px -40% 0px',
    }
  );

  sections.forEach(section => observer.observe(section));
}


/* ─── Contact Form (Formspree integration) ────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) return;

    // Disable button while sending
    submitBtn.disabled = true;
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
      Sending...
    `;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // Success
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Message Sent!
        `;
        submitBtn.style.background = '#22c55e';
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      // Error fallback
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        Error — try again
      `;
      submitBtn.style.background = '#ef4444';

      setTimeout(() => {
        submitBtn.innerHTML = originalContent;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}


/* ─── Copy Email to Clipboard ─────────────────────────────── */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  const copyToast = document.getElementById('copyToast');

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('singh101harshu@gmail.com');
      copyToast.classList.add('show');
      setTimeout(() => {
        copyToast.classList.remove('show');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  });
}
