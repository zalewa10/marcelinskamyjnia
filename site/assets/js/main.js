(function () {
  "use strict";

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var mobileNavClose = document.querySelector(".mobile-nav__close");

  function openNav() {
    if (!mobileNav) return;
    mobileNav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  if (toggle) toggle.addEventListener("click", openNav);
  if (mobileNavClose) mobileNavClose.addEventListener("click", closeNav);
  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* Header shadow on scroll */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.25)";
    else header.style.boxShadow = "none";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Gallery lightbox */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var lightbox = document.querySelector(".lightbox");
  if (galleryItems.length && lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector(".lightbox__caption");
    var current = 0;

    function show(index) {
      current = (index + galleryItems.length) % galleryItems.length;
      var item = galleryItems[current];
      lbImg.src = item.getAttribute("data-full") || item.getAttribute("href") || item.querySelector("img").src;
      lbImg.alt = item.getAttribute("data-caption") || "";
      lbCaption.textContent = item.getAttribute("data-caption") || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function hide() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    galleryItems.forEach(function (item, i) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        show(i);
      });
    });

    var closeBtn = lightbox.querySelector(".lightbox__close");
    var prevBtn = lightbox.querySelector(".lightbox__prev");
    var nextBtn = lightbox.querySelector(".lightbox__next");
    if (closeBtn) closeBtn.addEventListener("click", hide);
    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) hide();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* Reviews carousel */
  var reviewsTrack = document.querySelector(".reviews-track");
  if (reviewsTrack) {
    var reviewsPrev = document.querySelector(".reviews-prev");
    var reviewsNext = document.querySelector(".reviews-next");
    function scrollReviews(dir) {
      var card = reviewsTrack.querySelector(".review-card");
      var step = card ? card.getBoundingClientRect().width + 24 : reviewsTrack.clientWidth * 0.8;
      reviewsTrack.scrollBy({ left: dir * step, behavior: "smooth" });
    }
    if (reviewsPrev) reviewsPrev.addEventListener("click", function () { scrollReviews(-1); });
    if (reviewsNext) reviewsNext.addEventListener("click", function () { scrollReviews(1); });
  }

  /* Contact form: basic client-side validation (server handles actual send) */
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }
      var required = form.querySelectorAll("[required]");
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = "#e6432f";
        } else {
          field.style.borderColor = "";
        }
      });
      if (!valid) e.preventDefault();
    });
  }

  /* Current year in footer */
  var yearEl = document.querySelector("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
