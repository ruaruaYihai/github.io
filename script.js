(function () {
  function boot() {
    const storageKey = "cpt208-theme";
    const searchParams = new URLSearchParams(window.location.search);
    const hashId = window.location.hash.replace(/^#/, "");
    const hashTarget = hashId ? document.getElementById(hashId) : null;
    const shouldOpenHomeDirectly =
      searchParams.get("home") === "1" || window.location.hash === "#content" || !!hashTarget;
    const btn = document.getElementById("themeBtn");
    const themeBtnEntry = document.getElementById("themeBtnEntry");
    const root = document.documentElement;
    const body = document.body;
    const enterBtn = document.getElementById("enterBtn");
    const backToWelcomeBtn = document.getElementById("backToWelcomeBtn");
    const entryGate = document.getElementById("entryGate");
    const floatField = document.getElementById("floatField");
    const siteFloatField = document.getElementById("siteFloatField");
    const siteShell = document.getElementById("siteShell");
    const revealSelector = "section, .card, .persona, .shot, .stat, .panel, .hero-card";
    const revealTargets = siteShell ? siteShell.querySelectorAll(revealSelector) : [];
    const buildFloat =
      typeof window.cpt208BuildFloatIcons === "function" ? window.cpt208BuildFloatIcons : function () {}

    function collapseIconsToCenter() {
      if (!entryGate || !floatField) return;
      const gateRect = entryGate.getBoundingClientRect();
      const centerX = gateRect.left + gateRect.width / 2;
      const centerY = gateRect.top + gateRect.height / 2;
      const icons = floatField.querySelectorAll(".float-icon");
      icons.forEach(function (icon) {
        const rect = icon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;
        icon.style.setProperty("--to-x", (centerX - iconCenterX).toFixed(1) + "px");
        icon.style.setProperty("--to-y", (centerY - iconCenterY).toFixed(1) + "px");
      });
      entryGate.classList.add("is-collapsing");
    }

    function getPreferredTheme() {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      localStorage.setItem(storageKey, theme);
      btn && btn.setAttribute("aria-label", "Toggle theme (current: " + theme + ")");
      themeBtnEntry && themeBtnEntry.setAttribute("aria-label", "Toggle theme (current: " + theme + ")");
    }

    applyTheme(getPreferredTheme());
    buildFloat(floatField, 120);
    buildFloat(siteFloatField, 90);

    (function initMemberCardFlip() {
      const memberCards = document.querySelectorAll(".member-card");
      if (!memberCards.length || !window.matchMedia) return;
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");

      function syncTapAffordance() {
        memberCards.forEach(function (card) {
          if (mq.matches) {
            card.classList.remove("is-flipped");
            card.removeAttribute("tabindex");
            card.removeAttribute("aria-expanded");
            card.removeAttribute("aria-label");
          } else {
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-expanded", card.classList.contains("is-flipped") ? "true" : "false");
            card.setAttribute("aria-label", "Team member card; tap to flip for details");
          }
        });
      }

      function bindTapFlip(card) {
        card.addEventListener("click", function () {
          if (mq.matches) return;
          card.classList.toggle("is-flipped");
          card.setAttribute("aria-expanded", card.classList.contains("is-flipped") ? "true" : "false");
        });
        card.addEventListener("keydown", function (e) {
          if (mq.matches) return;
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          card.classList.toggle("is-flipped");
          card.setAttribute("aria-expanded", card.classList.contains("is-flipped") ? "true" : "false");
        });
      }

      memberCards.forEach(bindTapFlip);
      mq.addEventListener("change", syncTapAffordance);
      syncTapAffordance();
    })();

    if (shouldOpenHomeDirectly) {
      body.classList.add("is-entered");
      body.classList.remove("is-locked");
      entryGate && entryGate.classList.remove("is-collapsing");
    }

    if (shouldOpenHomeDirectly && hashTarget) {
      window.requestAnimationFrame(function () {
        hashTarget.scrollIntoView({ block: "start" });
      });
    }

    enterBtn &&
      enterBtn.addEventListener("click", function () {
        collapseIconsToCenter();
        const reduced =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const delay = reduced ? 0 : 520;
        window.setTimeout(function () {
          body.classList.remove("is-locked");
          body.classList.add("is-entered");
        }, delay);
        window.setTimeout(function () {
          const firstHeading = document.querySelector(".brand h1");
          if (!firstHeading || !firstHeading.focus) return;
          try {
            firstHeading.focus({ preventScroll: true });
          } catch (err) {
            firstHeading.focus();
          }
        }, delay + 240);
      });

    backToWelcomeBtn &&
      backToWelcomeBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
        body.classList.remove("is-entered");
        body.classList.add("is-locked");
        entryGate && entryGate.classList.remove("is-collapsing");
      });

    if ("IntersectionObserver" in window) {
      revealTargets.forEach(function (el) {
        el.classList.add("reveal");
      });
      const observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealTargets.forEach(function (el) {
        observer.observe(el);
      });
    }

    btn &&
      btn.addEventListener("click", function () {
        const current = root.getAttribute("data-theme") || "dark";
        applyTheme(current === "dark" ? "light" : "dark");
      });

    themeBtnEntry &&
      themeBtnEntry.addEventListener("click", function () {
        const current = root.getAttribute("data-theme") || "dark";
        applyTheme(current === "dark" ? "light" : "dark");
      });

    const backToTopBtn = document.getElementById("backToTopBtn");
    const motivationSection = document.getElementById("motivation-research");
    if (backToTopBtn) {
      let scrollTicking = false;

      function updateBackToTopVisibility() {
        scrollTicking = false;
        const y = window.scrollY || window.pageYOffset || 0;
        let show = false;
        if (body.classList.contains("is-entered") && motivationSection) {
          const headerLead = 88;
          const sectionTopDoc =
            motivationSection.getBoundingClientRect().top + y;
          show = y >= sectionTopDoc - headerLead;
        }
        backToTopBtn.classList.toggle("is-visible", show);
        backToTopBtn.setAttribute("aria-hidden", show ? "false" : "true");
        backToTopBtn.tabIndex = show ? 0 : -1;
      }

      function onScrollBackToTop() {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(updateBackToTopVisibility);
        }
      }

      window.addEventListener("scroll", onScrollBackToTop, { passive: true });
      window.addEventListener("resize", onScrollBackToTop, { passive: true });
      updateBackToTopVisibility();
      if (document.readyState === "complete") {
        window.requestAnimationFrame(updateBackToTopVisibility);
      } else {
        window.addEventListener("load", updateBackToTopVisibility);
      }

      backToTopBtn.addEventListener("click", function () {
        const prefersReduced =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
        const brandHeading = document.querySelector(".brand h1");
        window.setTimeout(function () {
          brandHeading && brandHeading.focus && brandHeading.focus({ preventScroll: true });
        }, prefersReduced ? 0 : 400);
      });
    }

    (function initUaAcledLightbox() {
      const dlg = document.getElementById("uaAcledLightbox");
      if (!dlg || typeof dlg.showModal !== "function") return;
      const dlgImg = dlg.querySelector(".ua-acled-dialog__img");
      const dlgCap = dlg.querySelector(".ua-acled-dialog__caption");
      const closeBtn = dlg.querySelector(".ua-acled-dialog__close");

      function closeDlg() {
        if (dlg.open) dlg.close();
      }

      closeBtn &&
        closeBtn.addEventListener("click", function (e) {
          e.preventDefault();
          closeDlg();
        });

      dlg.addEventListener("click", function (e) {
        if (e.target === dlg) closeDlg();
      });

      document.querySelectorAll(".ua-acled-zoom").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const full = btn.getAttribute("data-full");
          if (!full || !dlgImg) return;
          dlgImg.src = full;
          dlgImg.alt = btn.getAttribute("data-alt") || "";
          if (dlgCap) {
            var cap = btn.getAttribute("data-caption") || "";
            dlgCap.textContent = cap;
            dlgCap.hidden = !String(cap).trim();
          }
          dlg.showModal();
        });
      });
    })();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
