(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('nav-toggle');
  var navPopover = document.getElementById('nav-popover');
  var backdrop = null;

  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  function ensureBackdrop() {
    if (backdrop) return backdrop;

    backdrop = document.createElement('button');
    backdrop.type = 'button';
    backdrop.className = 'navbar__popover-backdrop';
    backdrop.setAttribute('aria-label', 'Close menu');
    backdrop.hidden = true;
    backdrop.addEventListener('click', closeMobileMenu);
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function closeMobileMenu() {
    if (!navToggle || !navPopover) return;

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    navPopover.hidden = true;

    if (backdrop) {
      backdrop.hidden = true;
    }
  }

  function openMobileMenu() {
    if (!navToggle || !navPopover) return;

    ensureBackdrop();
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    navPopover.hidden = false;
    backdrop.hidden = false;
  }

  if (navToggle && navPopover) {
    navToggle.addEventListener('click', function (event) {
      event.stopPropagation();
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });

    navPopover.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });
  }

  var contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.contact-form__submit');
      var originalText = btn.textContent;
      btn.textContent = 'Message Sent';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
    });
  }

  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    var selector = [
      '.section__header',
      '.service-card',
      '.solution-card',
      '.outcome-block',
      '.case-study-card',
      '.testimonial-slider',
      '.cta-section__inner',
      '.contact-form'
    ].join(', ');

    var elements = document.querySelectorAll(selector);
    if (!elements.length) {
      return;
    }

    elements.forEach(function (el) {
      el.classList.add('scroll-reveal');
    });

    document.querySelectorAll(
      '.services__grid, .solutions__grid, .outcomes__grid, .case-studies__grid'
    ).forEach(function (grid) {
      grid.querySelectorAll('.scroll-reveal').forEach(function (el, index) {
        el.style.setProperty('--reveal-delay', index * 80 + 'ms');
      });
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollReveal();
})();
