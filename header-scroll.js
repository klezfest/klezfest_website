// Hides the header on scroll-down, reveals it again on scroll-up (even a light one).
// Also drives the mobile hamburger menu.
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  function closeNav() {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove('site-nav--open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('site-nav--open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    siteNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('click', function (event) {
      var isOpen = siteNav.classList.contains('site-nav--open');
      if (isOpen && !siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('site-nav--open')) {
        closeNav();
        navToggle.focus();
      }
    });
  }

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

    if (siteNav && siteNav.classList.contains('site-nav--open')) {
      lastY = currentY;
      ticking = false;
      return;
    }

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
