(function () {
  'use strict';

  var slider = document.getElementById('testimonial-slider');
  if (!slider) return;

  var track = slider.querySelector('.testimonial-slider__track');
  var viewport = slider.querySelector('.testimonial-slider__viewport');
  var prevBtn = slider.querySelector('.testimonial-slider__nav--prev');
  var nextBtn = slider.querySelector('.testimonial-slider__nav--next');
  var dotsContainer = slider.querySelector('.testimonial-slider__dots');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.testimonial-slider__slide'));

  var currentIndex = 0;
  var direction = 1;
  var isAutoPlaying = true;
  var autoPlayTimer = null;
  var pauseTimer = null;
  var dragStartX = 0;
  var dragDeltaX = 0;
  var isDragging = false;

  function getVisibleCount(width) {
    if (width >= 1280) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, slides.length - getVisibleCount(window.innerWidth));
  }

  function buildDots() {
    if (!dotsContainer) return;

    var maxIndex = getMaxIndex();
    dotsContainer.innerHTML = '';

    for (var i = 0; i <= maxIndex; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testimonial-slider__dot' + (i === currentIndex ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      dot.dataset.index = String(i);
      dot.addEventListener('click', function () {
        currentIndex = Number(this.dataset.index);
        updateSlider();
        pauseAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    var visibleCount = getVisibleCount(window.innerWidth);
    var maxIndex = getMaxIndex();

    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }

    var viewportWidth = viewport.offsetWidth;
    var slideWidth = viewportWidth / visibleCount;

    slides.forEach(function (slide) {
      slide.style.flex = '0 0 ' + slideWidth + 'px';
      slide.style.width = slideWidth + 'px';
    });

    var offset = isDragging ? currentIndex * slideWidth - dragDeltaX : currentIndex * slideWidth;
    track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

    if (prevBtn) {
      prevBtn.disabled = currentIndex <= 0;
      prevBtn.classList.toggle('is-disabled', currentIndex <= 0);
    }

    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.classList.toggle('is-disabled', currentIndex >= maxIndex);
    }

    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll('.testimonial-slider__dot');
      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === currentIndex);
      });
    }
  }

  function goNext() {
    if (currentIndex < getMaxIndex()) {
      direction = 1;
      currentIndex += 1;
      updateSlider();
      pauseAutoPlay();
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      direction = -1;
      currentIndex -= 1;
      updateSlider();
      pauseAutoPlay();
    }
  }

  function pauseAutoPlay() {
    isAutoPlaying = false;
    clearInterval(autoPlayTimer);
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(function () {
      isAutoPlaying = true;
      startAutoPlay();
    }, 8000);
  }

  function startAutoPlay() {
    clearInterval(autoPlayTimer);
    if (!isAutoPlaying) return;

    autoPlayTimer = setInterval(function () {
      var maxIndex = getMaxIndex();

      if (currentIndex >= maxIndex) {
        direction = -1;
        currentIndex -= 1;
      } else if (currentIndex <= 0) {
        direction = 1;
        currentIndex += 1;
      } else {
        currentIndex += direction;
      }

      updateSlider();
    }, 4000);
  }

  function onDragStart(clientX) {
    isDragging = true;
    dragStartX = clientX;
    dragDeltaX = 0;
    track.classList.add('is-dragging');
    pauseAutoPlay();
  }

  function onDragMove(clientX) {
    if (!isDragging) return;
    dragDeltaX = clientX - dragStartX;
    updateSlider();
  }

  function onDragEnd() {
    if (!isDragging) return;

    track.classList.remove('is-dragging');

    if (dragDeltaX < -30 && currentIndex < getMaxIndex()) {
      goNext();
    } else if (dragDeltaX > 30 && currentIndex > 0) {
      goPrev();
    } else {
      dragDeltaX = 0;
      updateSlider();
    }

    isDragging = false;
    dragStartX = 0;
  }

  if (prevBtn) prevBtn.addEventListener('click', goPrev);
  if (nextBtn) nextBtn.addEventListener('click', goNext);

  viewport.addEventListener('mousedown', function (event) {
    onDragStart(event.clientX);
  });

  viewport.addEventListener('touchstart', function (event) {
    onDragStart(event.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('mousemove', function (event) {
    onDragMove(event.clientX);
  });

  window.addEventListener('touchmove', function (event) {
    if (isDragging) {
      onDragMove(event.touches[0].clientX);
      if (Math.abs(dragDeltaX) > 5 && event.cancelable) {
        event.preventDefault();
      }
    }
  }, { passive: false });

  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchend', onDragEnd);

  window.addEventListener('resize', function () {
    var oldVisible = getVisibleCount(window.innerWidth);
    buildDots();
    updateSlider();

    window.requestAnimationFrame(function () {
      var newVisible = getVisibleCount(window.innerWidth);
      if (oldVisible !== newVisible && currentIndex > getMaxIndex()) {
        currentIndex = getMaxIndex();
        updateSlider();
      }
    });
  });

  buildDots();
  updateSlider();
  startAutoPlay();
})();
