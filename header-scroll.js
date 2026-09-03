// Hides the header on scroll-down, reveals it again on scroll-up (even a light one).
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var lastY = window.scrollY;
  var ticking = false;
  var ready = false;

  // Landing on a page via a link like index.html#schedule jumps the scroll
  // position right after this script starts, which otherwise looks like a
  // big scroll-down and hides the header before the visitor scrolls at all.
  // Give that jump a moment to settle before engaging hide/show.
  window.setTimeout(function () {
    lastY = window.scrollY;
    ready = true;
  }, 300);

  function onScroll() {
    var currentY = window.scrollY;

    if (!ready) {
      lastY = currentY;
      ticking = false;
      return;
    }

    if (currentY <= 10) {
      header.classList.remove('site-header--hidden');
    } else if (currentY > lastY) {
      header.classList.add('site-header--hidden');
    } else {
      header.classList.remove('site-header--hidden');
    }

    lastY = currentY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();
