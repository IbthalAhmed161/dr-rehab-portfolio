/* =========================================================================
   Dr. Rehab Mohamed Hassan — Portfolio site scripts
   Vanilla JS, no dependencies.
   ========================================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    setFooterYear();
    setActiveNavLink();
    initHeaderScrollState();
    initMobileDrawer();
    initSmoothAnchors();
    initStatCounters();
    initCertificateFilters();
    initCertificateModal();
    initContactForm();
  }

  /* Footer year --------------------------------------------------------- */
  function setFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* Highlight the current page in the nav -------------------------------- */
  function setActiveNavLink() {
    var path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[data-nav]").forEach(function (link) {
      var target = link.getAttribute("href");
      if (target === path || (path === "" && target === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* Header shadow on scroll ------------------------------------------------ */
  function initHeaderScrollState() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var toggle = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* Mobile hamburger drawer ------------------------------------------------ */
  function initMobileDrawer() {
    var toggleBtn = document.querySelector(".hamburger");
    var nav = document.querySelector(".nav-links");
    var backdrop = document.querySelector(".nav-drawer-backdrop");
    if (!toggleBtn || !nav) return;

    function openDrawer() {
      nav.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (backdrop) backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function closeDrawer() {
      nav.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (backdrop) backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    toggleBtn.addEventListener("click", function () {
      var isOpen = nav.classList.contains("is-open");
      isOpen ? closeDrawer() : openDrawer();
    });
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }

  /* Smooth-scroll for in-page anchors -------------------------------------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var headerH = document.querySelector(".site-header");
        var offset = headerH ? headerH.offsetHeight + 12 : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* Animated stat counters (hero) ------------------------------------------ */
  function initStatCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    var animate = function (el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var start = null;

      var step = function (timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      };
      window.requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      counters.forEach(animate);
    }
  }

  /* Certificates: category filters ----------------------------------------- */
  function initCertificateFilters() {
    var filterBar = document.querySelector(".filter-bar");
    var cards = document.querySelectorAll(".cert-card");
    var emptyState = document.querySelector(".empty-state");
    if (!filterBar || !cards.length) return;

    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      var category = btn.getAttribute("data-filter");
      var visibleCount = 0;

      cards.forEach(function (card) {
        var matches = category === "all" || card.getAttribute("data-category") === category;
        card.classList.toggle("hide", !matches);
        if (matches) visibleCount++;
      });

      if (emptyState) emptyState.classList.toggle("show", visibleCount === 0);
    });
  }

  /* Certificates: detail modal ---------------------------------------------- */
  function initCertificateModal() {
    var backdrop = document.getElementById("certModal");
    if (!backdrop) return;

    var badge = backdrop.querySelector("[data-modal-badge]");
    var title = backdrop.querySelector("[data-modal-title]");
    var issuer = backdrop.querySelector("[data-modal-issuer]");
    var date = backdrop.querySelector("[data-modal-date]");
    var level = backdrop.querySelector("[data-modal-level]");
    var category = backdrop.querySelector("[data-modal-category]");
    var desc = backdrop.querySelector("[data-modal-desc]");
    var closeBtn = backdrop.querySelector(".modal-close");
    var lastFocused = null;

    function openModal(card) {
      lastFocused = document.activeElement;
      badge.src = card.getAttribute("data-badge");
      title.textContent = card.getAttribute("data-title");
      issuer.textContent = card.getAttribute("data-issuer");
      date.textContent = card.getAttribute("data-date");
      level.textContent = card.getAttribute("data-level");
      category.textContent = card.getAttribute("data-category-label");
      desc.textContent = card.getAttribute("data-desc");

      backdrop.classList.add("is-open");
      backdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove("is-open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll("[data-cert-trigger]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".cert-card");
        if (card) openModal(card);
      });
    });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && backdrop.classList.contains("is-open")) closeModal();
    });
  }

  /* Contact form: client-side validation + confirmation -------------------- */
  function initContactForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;
    var confirmPanel = document.getElementById("confirmPanel");

    var validators = {
      fullName: function (v) { return v.trim().length >= 3; },
      phone: function (v) { return /^[0-9+\s()-]{8,}$/.test(v.trim()); },
      email: function (v) { return v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      service: function (v) { return v !== ""; },
      message: function (v) { return v.trim().length >= 10; }
    };

    function showError(field, message) {
      var errorEl = form.querySelector('[data-error-for="' + field + '"]');
      if (errorEl) errorEl.textContent = message || "";
    }

    function validateField(input) {
      var name = input.name;
      if (!validators[name]) return true;
      var valid = validators[name](input.value);
      showError(name, valid ? "" : input.getAttribute("data-error-message"));
      return valid;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll("input[name], select[name], textarea[name]");
      var allValid = true;

      fields.forEach(function (input) {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        var firstInvalid = form.querySelector(".field-error:not(:empty)");
        if (firstInvalid) {
          firstInvalid.closest(".form-field").querySelector("input, select, textarea").focus();
        }
        if (confirmPanel) confirmPanel.classList.remove("show");
        return;
      }

      if (confirmPanel) {
        confirmPanel.classList.add("show");
        confirmPanel.setAttribute("tabindex", "-1");
        confirmPanel.focus();
        confirmPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }
})();
