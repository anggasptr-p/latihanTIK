/* ============================================================
   VANTERRA — Interaction Layer
   1.  Header scroll + progress bar
   2.  Mobile menu toggle
   3.  Cart drawer (open/close/add/update/remove)
   4.  Product category filter
   5.  Scroll reveal animations
   6.  Count-up stats
   7.  Newsletter form
   8.  Footer year
   9.  Image labels
   10. Hero parallax
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. HEADER SCROLL + PROGRESS ---------- */
  const header = document.getElementById('header');
  const progressBar = document.getElementById('progressBar');

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? y / scrollable : 0;
    progressBar.style.transform = 'scaleX(' + pct + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 2. MOBILE MENU ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    mobileMenu.classList.remove('is-open');
    menuBtn.classList.remove('is-active');
    menuBtn.setAttribute('aria-expanded', 'false');
    syncBodyLock();
  }

  function syncBodyLock() {
    const anyOpen =
      mobileMenu.classList.contains('is-open') ||
      cart.classList.contains('is-open');
    document.body.classList.toggle('is-locked', anyOpen);
  }

  menuBtn.addEventListener('click', function () {
    const open = mobileMenu.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    syncBodyLock();
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ---------- 3. CART DRAWER ---------- */
  const cart = document.getElementById('cart');
  const overlay = document.getElementById('overlay');
  const cartOpenBtn = document.getElementById('cartOpen');
  const cartCloseBtn = document.getElementById('cartClose');
  const cartList = document.getElementById('cartList');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const cartCount2 = document.getElementById('cartCount2');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const state = { items: [] };

  function formatPrice(n) {
    return '$' + n.toLocaleString('en-US');
  }

  function openCart() {
    cart.classList.add('is-open');
    overlay.classList.add('is-visible');
    cart.setAttribute('aria-hidden', 'false');
    syncBodyLock();
  }

  function closeCart() {
    cart.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    cart.setAttribute('aria-hidden', 'true');
    syncBodyLock();
  }

  cartOpenBtn.addEventListener('click', openCart);
  cartCloseBtn.addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCart();
      closeMobileMenu();
    }
  });

  function renderCart() {
    cartList.innerHTML = '';

    const count = state.items.reduce(function (s, i) { return s + i.qty; }, 0);
    const total = state.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);

    cartCount.textContent = count;
    cartCount2.textContent = '(' + count + ')';
    cartTotal.textContent = formatPrice(total);
    cartEmpty.style.display = state.items.length ? 'none' : 'block';

    state.items.forEach(function (item, idx) {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML =
        '<div class="cart-item__info">' +
          '<p class="cart-item__name">' + escapeHtml(item.name) + '</p>' +
          '<p class="cart-item__price">' + formatPrice(item.price) + '</p>' +
        '</div>' +
        '<div class="cart-item__qty">' +
          '<button data-action="dec" data-idx="' + idx + '" aria-label="Decrease quantity">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button data-action="inc" data-idx="' + idx + '" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '<button class="cart-item__remove" data-action="remove" data-idx="' + idx + '">Remove</button>';
      cartList.appendChild(li);
    });
  }

  cartList.addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const idx = Number(btn.dataset.idx);
    const action = btn.dataset.action;
    const item = state.items[idx];
    if (!item) return;

    if (action === 'inc') item.qty += 1;
    if (action === 'dec') item.qty = Math.max(1, item.qty - 1);
    if (action === 'remove') state.items.splice(idx, 1);

    renderCart();
  });

  document.querySelectorAll('.quick-add').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const name = btn.dataset.name;
      const price = Number(btn.dataset.price);
      const existing = state.items.find(function (i) { return i.name === name; });

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ name: name, price: price, qty: 1 });
      }

      renderCart();
      openCart();
    });
  });

  checkoutBtn.addEventListener('click', function () {
    if (!state.items.length) return;
    alert('Checkout would go here → wire this up to Stripe / your payment provider.');
  });

  renderCart();

  /* ---------- 4. PRODUCT FILTER ---------- */
  const filters = document.querySelectorAll('.filter');
  const products = document.querySelectorAll('.product');

  filters.forEach(function (f) {
    f.addEventListener('click', function () {
      filters.forEach(function (x) {
        x.classList.remove('is-active');
        x.setAttribute('aria-selected', 'false');
      });
      f.classList.add('is-active');
      f.setAttribute('aria-selected', 'true');

      const val = f.dataset.filter;
      products.forEach(function (p) {
        const show = val === 'all' || p.dataset.cat === val;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- 5. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---------- 6. COUNT-UP STATS ---------- */
  const counters = document.querySelectorAll('.stat__num');

  const countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) { countObserver.observe(el); });

  /* ---------- 7. NEWSLETTER ---------- */
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  const emailInput = document.getElementById('email');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    msg.classList.remove('is-error', 'is-success');

    if (!valid) {
      msg.textContent = 'Please enter a valid email address.';
      msg.classList.add('is-error');
      return;
    }

    msg.textContent = 'You\'re in. Check ' + email + ' for your 10% code.';
    msg.classList.add('is-success');
    form.reset();
  });

  /* ---------- 8. FOOTER YEAR ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- 9. IMAGE LABELS ---------- */
  document.querySelectorAll('img[data-label]').forEach(function (img) {
    if (img.closest('.hero') || img.closest('.product__media')) return;

    const target = img.closest('.story') || img.parentElement;
    if (!target || target.querySelector('.img-label')) return;

    const label = document.createElement('span');
    label.className = 'img-label';
    label.textContent = img.dataset.label;
    target.appendChild(label);
  });

  /* ---------- 10. HERO PARALLAX ---------- */
  const heroImg = document.getElementById('heroImg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroImg && !reduceMotion) {
    window.addEventListener('scroll', function () {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroImg.style.transform = 'translateY(' + (y * 0.15) + 'px) scale(1.05)';
      }
    }, { passive: true });
  }

  /* ---------- HELPER ---------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
