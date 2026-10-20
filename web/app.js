(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var nav = document.getElementById('nav');
  var menuToggle = document.querySelector('.menu-toggle');
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a')) : [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Header state */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Mobile navigation */
  function setMenu(open) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
    document.body.classList.toggle('menu-open', open);
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () { setMenu(false); });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) setMenu(false);
  });

  /* Reveal on scroll */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (!('IntersectionObserver' in window) || reduceMotion.matches) {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* Active section in navigation */
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* Lightbox */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var lightboxClose = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  var lightboxPrev = lightbox ? lightbox.querySelector('.lightbox__nav--prev') : null;
  var lightboxNext = lightbox ? lightbox.querySelector('.lightbox__nav--next') : null;
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var lightboxIndex = 0;
  var lastFocused = null;

  function openLightbox(index) {
    if (!lightbox || !galleryItems.length) return;
    var wasHidden = lightbox.hidden;
    lightboxIndex = (index + galleryItems.length) % galleryItems.length;
    var trigger = galleryItems[lightboxIndex];
    var img = trigger.querySelector('img');
    if (!img) return;

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = trigger.getAttribute('data-caption') || '';

    if (wasHidden) {
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
  }

  function stepLightbox(direction) {
    openLightbox(lightboxIndex + direction);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function () { openLightbox(index); });
  });

  if (lightbox) {
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { stepLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { stepLightbox(1); });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (event) {
      if (lightbox.hidden) return;

      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        stepLightbox(-1);
      } else if (event.key === 'ArrowRight') {
        stepLightbox(1);
      } else if (event.key === 'Tab') {
        var focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* Snow */
  var canvas = document.querySelector('.hero__snow');
  if (!canvas || reduceMotion.matches) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var flakes = [];
  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var frame = null;
  var visible = true;
  var time = 0;

  function resizeCanvas() {
    var hero = canvas.parentElement;
    if (!hero) return;
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(130, Math.max(40, Math.round(width / 18)));
    flakes = [];
    for (var i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vy: Math.random() * 0.5 + 0.18,
        vx: Math.random() * 0.34 - 0.17,
        a: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.006;

    for (var i = 0; i < flakes.length; i++) {
      var flake = flakes[i];
      flake.y += flake.vy;
      flake.x += flake.vx + Math.sin(time + flake.phase) * 0.22;

      if (flake.y > height + 4) {
        flake.y = -4;
        flake.x = Math.random() * width;
      }
      if (flake.x < -4) flake.x = width + 4;
      if (flake.x > width + 4) flake.x = -4;

      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(214, 240, 248, ' + flake.a + ')';
      ctx.fill();
    }

    frame = window.requestAnimationFrame(draw);
  }

  function start() {
    if (frame === null) frame = window.requestAnimationFrame(draw);
  }

  function stop() {
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }
  }

  resizeCanvas();
  start();

  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stop();
    } else if (visible) {
      start();
    }
  });

  if ('IntersectionObserver' in window) {
    var heroObserver = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden) {
        start();
      } else {
        stop();
      }
    }, { threshold: 0 });

    heroObserver.observe(canvas.parentElement);
  }
})();
