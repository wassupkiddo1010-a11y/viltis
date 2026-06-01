(function () {
  'use strict';

  var section = document.getElementById('industries');
  if (!section) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    section.querySelectorAll('[data-showcase-reveal]').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var revealItems = section.querySelectorAll('[data-showcase-reveal]');
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
  );

  revealItems.forEach(function (item, index) {
    item.style.setProperty('--reveal-delay', index * 100 + 'ms');
    observer.observe(item);
  });
})();
