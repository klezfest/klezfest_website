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

// "Join Our Mailing List" toggle + Mailchimp signup, submitted via JSONP.
// Mailchimp doesn't allow real cross-origin fetch/XHR to its subscribe
// endpoint; their own mc-validate.js (jQuery) works around that with the
// same JSONP trick used here, so this avoids adding jQuery as a dependency
// just for this one form.
(function () {
  var toggle = document.querySelector('.mailing-list-toggle');
  var formWrap = document.querySelector('.mailing-list-form');

  if (toggle && formWrap) {
    toggle.addEventListener('click', function () {
      var willShow = formWrap.hidden;
      formWrap.hidden = !willShow;
      toggle.setAttribute('aria-expanded', willShow ? 'true' : 'false');
    });
  }

  var form = document.getElementById('mc-embedded-subscribe-form');
  if (!form) return;

  var formShell = document.getElementById('mc_embed_signup');
  var errorEl = document.getElementById('mce-error-response');
  var successEl = document.getElementById('mce-success-response');

  function showMessage(showEl, hideEl, text) {
    if (hideEl) hideEl.style.display = 'none';
    if (!showEl) return;
    // Mailchimp's messages are sometimes HTML fragments (e.g. a link to
    // update an existing subscription) - strip tags rather than use
    // innerHTML, since this text comes from a third-party response.
    showEl.textContent = String(text).replace(/<[^>]*>/g, '');
    showEl.style.display = 'block';
  }

  function showError(text) {
    // Mailchimp error messages come prefixed with an internal numeric code,
    // e.g. "0 - An email address must contain a single @." - drop that and
    // show a plain "ERROR: ..." message instead.
    var cleaned = String(text).replace(/^\s*\d+\s*-\s*/, '');
    showMessage(errorEl, successEl, 'ERROR: ' + cleaned);
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // The form has novalidate, so check the required fields ourselves with a
    // clear, field-specific message rather than relying on Mailchimp's
    // generic "Please enter a value" response (which doesn't say which
    // field is missing) or the browser's native validation UI.
    var emailField = document.getElementById('mce-EMAIL');
    var nameField = document.getElementById('mce-FNAME');

    if (nameField && !nameField.value.trim()) {
      showError('Please enter your first name.');
      nameField.focus();
      return;
    }
    if (emailField && !emailField.value.trim()) {
      showError('Please enter your email address.');
      emailField.focus();
      return;
    }
    if (emailField && emailField.validity && emailField.validity.typeMismatch) {
      showError('Please enter a valid email address.');
      emailField.focus();
      return;
    }

    var action = form.getAttribute('action').replace('/post?', '/post-json?');
    var params = [];
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field.name || field.type === 'submit') return;
      params.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
    });

    var callbackName = 'mcJsonpCallback' + Date.now();
    params.push('c=' + callbackName);

    var script = document.createElement('script');
    var timeout = window.setTimeout(function () {
      showError('Something went wrong signing you up. Please try again in a moment.');
      cleanup();
    }, 8000);

    function cleanup() {
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = function (data) {
      window.clearTimeout(timeout);
      if (data && data.result === 'success') {
        showMessage(successEl, errorEl, data.msg || 'Thank you for subscribing!');
        form.reset();
        if (formShell) formShell.hidden = true;
      } else {
        showError((data && data.msg) || 'Something went wrong signing you up. Please try again.');
      }
      cleanup();
    };

    script.src = action + '&' + params.join('&');
    document.body.appendChild(script);
  });
})();
