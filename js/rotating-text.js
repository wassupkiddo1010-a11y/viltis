(function () {
  'use strict';

  var DURATION_MS = 500;

  function initRotatingText(container) {
    var words;
    try {
      words = JSON.parse(container.dataset.words || '[]');
    } catch (error) {
      return;
    }

    if (!words.length) return;

    var interval = Number(container.dataset.interval) || 2500;
    var mode = container.dataset.mode || 'slide';
    var ghost = container.querySelector('.rotating-text__ghost');
    var current = container.querySelector('.rotating-text__current');

    if (!ghost || !current) return;

    ghost.textContent = words.reduce(function (longest, word) {
      return word.length > longest.length ? word : longest;
    }, '');

    var index = 0;
    current.textContent = words[0];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    function setWord(nextIndex) {
      current.classList.add('rotating-text__current--exit');

      window.setTimeout(function () {
        index = nextIndex;
        current.textContent = words[index];
        current.classList.remove('rotating-text__current--exit');
        current.classList.add('rotating-text__current--enter');

        window.requestAnimationFrame(function () {
          current.classList.remove('rotating-text__current--enter');
        });
      }, DURATION_MS);
    }

    window.setInterval(function () {
      setWord((index + 1) % words.length);
    }, interval);

    container.classList.add('rotating-text--' + mode);
  }

  document.querySelectorAll('[data-rotating-text]').forEach(initRotatingText);
})();
