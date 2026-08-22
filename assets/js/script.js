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

  /* Highlight current page in nav -------------------------------------- */
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

  /* Header shadow on scroll -------------------------------------------- */
  function initHeaderScrollState() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var toggle = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  /* Mobile hamburger drawer -------------------------------------------- */
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

  /* Smooth-scroll for in-page anchors ---------------------------------- */
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

  /* Animated stat counters --------------------------------------------- */
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

  /* Certificates: Category Filters (Fixed) ----------------------------- */
  function initCertificateFilters() {
    var filterBtns = document.querySelectorAll(".filter-bar .filter-btn");
    var cards = document.querySelectorAll(".cert-grid .cert-card");
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var category = btn.getAttribute("data-filter") || btn.getAttribute("data-filter-target");

        cards.forEach(function (card) {
          var cardCategory = card.getAttribute("data-category");
          if (!category || category === "all" || cardCategory === category) {
            card.style.setProperty("display", "flex", "important");
          } else {
            card.style.setProperty("display", "none", "important");
          }
        });
      });
    });
  }

  /* Certificates: Detail Modal (Fixed) --------------------------------- */
  function initCertificateModal() {
    var modal = document.getElementById("mainCertModal") || document.getElementById("certModal");
    if (!modal) return;

    var mImg = modal.querySelector("#mImg, #modalImg, .modal-display-img, .modal-img-preview");
    var mTitle = modal.querySelector("#mTitle, [data-modal-title]");
    var mIssuer = modal.querySelector("#mIssuer, [data-modal-issuer]");
    var mCat = modal.querySelector("#mCat, [data-modal-category]");
    var mDate = modal.querySelector("#mDate, [data-modal-date]");
    var mLevel = modal.querySelector("#mLevel, [data-modal-level]");
    var mDesc = modal.querySelector("#mDesc, [data-modal-desc]");
    var closeBtn = modal.querySelector(".modal-close-trigger, .modal-close, #modalCloseBtn");

    function openModal(card) {
      if (!card) return;
      if (mImg) mImg.src = card.getAttribute("data-img") || "";
      if (mTitle) mTitle.textContent = card.getAttribute("data-title") || "";
      if (mIssuer) mIssuer.textContent = card.getAttribute("data-issuer") || "";
      if (mCat) mCat.textContent = card.getAttribute("data-category-label") || "";
      if (mDate) mDate.textContent = card.getAttribute("data-date") || "";
      if (mLevel) mLevel.textContent = card.getAttribute("data-level") || "";
      if (mDesc) mDesc.textContent = card.getAttribute("data-desc") || "";

      modal.classList.add("is-open", "active");
      modal.style.setProperty("display", "flex", "important");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.remove("is-open", "active");
      modal.style.setProperty("display", "none", "important");
      document.body.style.overflow = "";
    }

    document.querySelectorAll(".btn-view-certificate, .open-cert-btn, .cert-img-thumb, [data-cert-trigger]").forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        var card = trigger.closest(".cert-card");
        openModal(card);
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        closeModal();
      });
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* Contact Form ------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById("bookingForm");
    if (!form) return;
    var confirmPanel = document.getElementById("confirmPanel");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (confirmPanel) {
        confirmPanel.classList.add("show");
        confirmPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }
})();
