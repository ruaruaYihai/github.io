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
    const backToTopAnchor = document.getElementById("members");
    if (backToTopBtn) {
      let scrollTicking = false;

      function updateBackToTopVisibility() {
        scrollTicking = false;
        const y = window.scrollY || window.pageYOffset || 0;
        let show = false;
        if (body.classList.contains("is-entered") && backToTopAnchor) {
          const headerLead = 88;
          const sectionTopDoc =
            backToTopAnchor.getBoundingClientRect().top + y;
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

    (function initUaHsyModule() {
      const root = document.getElementById("uaHsyModule");
      if (!root) return;

      const prefersReduced =
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function addRipple(el, e) {
        if (prefersReduced) return;
        const rect = el.getBoundingClientRect();
        const size = 200;
        const x = (e.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (e.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
        const span = document.createElement("span");
        span.className = "ua-hsy-ripple-span";
        span.style.width = span.style.height = size + "px";
        span.style.left = x + "px";
        span.style.top = y + "px";
        el.appendChild(span);
        span.addEventListener("animationend", function () {
          span.remove();
        });
      }

      root.querySelectorAll(".ua-hsy-ripple").forEach(function (el) {
        el.addEventListener("click", function (e) {
          addRipple(el, e);
        });
      });

      if (!prefersReduced && "IntersectionObserver" in window) {
        const revealObs = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        root.querySelectorAll(".ua-hsy-reveal").forEach(function (el) {
          revealObs.observe(el);
        });
      } else {
        root.querySelectorAll(".ua-hsy-reveal").forEach(function (el) {
          el.classList.add("is-visible");
        });
      }

      root.querySelectorAll(".ua-hsy-flip-card").forEach(function (card) {
        const flipBtn = card.querySelector(".ua-hsy-flip-card__flip");
        const back = card.querySelector(".ua-hsy-flip-card__face--back");
        const dl = card.querySelector(".ua-hsy-flip-card__dl");

        function setFlipped(flipped) {
          card.classList.toggle("is-flipped", flipped);
          if (flipBtn) flipBtn.setAttribute("aria-pressed", flipped ? "true" : "false");
          if (back) back.setAttribute("aria-hidden", flipped ? "false" : "true");
        }

        setFlipped(false);

        flipBtn &&
          flipBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            setFlipped(!card.classList.contains("is-flipped"));
          });

        back &&
          back.addEventListener("click", function (e) {
            if (e.target.closest(".ua-hsy-flip-card__flip, .ua-hsy-flip-card__dl")) return;
            setFlipped(false);
          });

        back &&
          back.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped(false);
            }
          });

        dl &&
          dl.addEventListener("click", function (e) {
            e.stopPropagation();
          });
      });

      const tlNodes = root.querySelectorAll(".ua-hsy-tl-node");
      const tlPanels = root.querySelectorAll(".ua-hsy-exp-panel");
      const tlSelect = root.querySelector(".ua-hsy-tl-select");

      function setTimelineStep(step) {
        const idx = Number(step);
        tlNodes.forEach(function (node) {
          const active = Number(node.getAttribute("data-hsy-step")) === idx;
          node.classList.toggle("is-active", active);
          node.setAttribute("aria-pressed", active ? "true" : "false");
        });
        tlPanels.forEach(function (panel) {
          const active = Number(panel.getAttribute("data-hsy-panel")) === idx;
          if (active) {
            panel.hidden = false;
            panel.classList.remove("is-fading");
          } else {
            panel.hidden = true;
          }
        });
        if (tlSelect) tlSelect.value = String(idx);
      }

      function fadeTimelineStep(step) {
        const current = root.querySelector(".ua-hsy-exp-panel:not([hidden])");
        if (!current || prefersReduced) {
          setTimelineStep(step);
          return;
        }
        current.classList.add("is-fading");
        window.setTimeout(function () {
          setTimelineStep(step);
        }, 200);
      }

      tlNodes.forEach(function (node) {
        node.addEventListener("click", function () {
          fadeTimelineStep(node.getAttribute("data-hsy-step"));
        });
      });
      if (tlSelect) {
        tlSelect.addEventListener("change", function () {
          fadeTimelineStep(tlSelect.value);
        });
      }

      const modal = document.getElementById("uaHsyGalleryModal");
      const modalImg = modal && modal.querySelector(".ua-hsy-modal__img");
      const modalTitle = modal && modal.querySelector(".ua-hsy-modal__title");
      const modalTag = modal && modal.querySelector(".ua-hsy-modal__tag");
      const modalReport = modal && modal.querySelector(".ua-hsy-modal__report");
      const thumbs = root.querySelectorAll(".ua-hsy-thumb");
      let galleryState = { group: "conflict", index: 0 };

      function getThumbsInGroup(group) {
        return Array.prototype.filter.call(thumbs, function (t) {
          return t.getAttribute("data-hsy-group") === group;
        });
      }

      function applyThumbFromButton(btn) {
        if (!btn || !modalImg) return;
        galleryState.group = btn.getAttribute("data-hsy-group") || "conflict";
        galleryState.index = Number(btn.getAttribute("data-hsy-index")) || 0;
        modalImg.src = btn.getAttribute("data-hsy-src") || "";
        modalImg.alt = btn.getAttribute("data-hsy-title") || "";
        if (modalTitle) modalTitle.textContent = btn.getAttribute("data-hsy-title") || "";
        if (modalTag) modalTag.textContent = btn.getAttribute("data-hsy-tag") || "";
        if (modalReport) modalReport.textContent = btn.getAttribute("data-hsy-report") || "";
        thumbs.forEach(function (t) {
          t.classList.toggle("is-active", t === btn);
        });
      }

      function openGallery(btn) {
        if (!modal || typeof modal.showModal !== "function") return;
        applyThumbFromButton(btn);
        modal.showModal();
        document.body.classList.add("is-locked");
      }

      function closeGallery() {
        if (!modal || !modal.open) return;
        modal.close();
        document.body.classList.remove("is-locked");
        thumbs.forEach(function (t) {
          t.classList.remove("is-active");
        });
      }

      function stepGallery(delta) {
        const groupThumbs = getThumbsInGroup(galleryState.group);
        if (!groupThumbs.length) return;
        let next = galleryState.index + delta;
        if (next < 0) next = groupThumbs.length - 1;
        if (next >= groupThumbs.length) next = 0;
        const nextBtn = groupThumbs[next];
        if (!nextBtn || !modalImg) return;
        if (prefersReduced) {
          applyThumbFromButton(nextBtn);
          return;
        }
        modalImg.classList.add("is-fading");
        window.setTimeout(function () {
          applyThumbFromButton(nextBtn);
          modalImg.classList.remove("is-fading");
        }, 200);
      }

      thumbs.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          addRipple(btn, e);
          openGallery(btn);
        });
      });

      if (modal) {
        modal.querySelectorAll("[data-hsy-modal-close]").forEach(function (el) {
          el.addEventListener("click", closeGallery);
        });
        modal.addEventListener("click", function (e) {
          if (e.target === modal) closeGallery();
        });
        modal.addEventListener("close", function () {
          document.body.classList.remove("is-locked");
          thumbs.forEach(function (t) {
            t.classList.remove("is-active");
          });
        });
        const prevBtn = modal.querySelector(".ua-hsy-modal__nav--prev");
        const nextBtn = modal.querySelector(".ua-hsy-modal__nav--next");
        prevBtn &&
          prevBtn.addEventListener("click", function (e) {
            addRipple(prevBtn, e);
            stepGallery(-1);
          });
        nextBtn &&
          nextBtn.addEventListener("click", function (e) {
            addRipple(nextBtn, e);
            stepGallery(1);
          });
      }

      document.addEventListener("keydown", function (e) {
        if (!modal || !modal.open) return;
        if (e.key === "Escape") {
          e.preventDefault();
          closeGallery();
        } else if (e.key === "ArrowLeft") {
          stepGallery(-1);
        } else if (e.key === "ArrowRight") {
          stepGallery(1);
        }
      });

      root.querySelectorAll('.ua-hsy-jump-btn[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (e) {
          const id = link.getAttribute("href");
          const target = id && document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        });
      });
    })();

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

    (function initUaAgriNav() {
      const root = document.getElementById("uaAgriModule");
      if (!root) return;
      const views = root.querySelectorAll(".ua-agri-view");
      const moduleHero = root.querySelector(".ua-agri-hero");

      function showView(viewId) {
        views.forEach(function (v) {
          const active = v.dataset.agriView === viewId;
          v.classList.toggle("is-active", active);
          v.hidden = !active;
        });
        if (moduleHero) moduleHero.hidden = viewId !== "entry";
        const prefersReduced =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        root.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      }

      root.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-agri-go]");
        if (!btn || !root.contains(btn)) return;
        const viewId = btn.getAttribute("data-agri-go");
        if (viewId) showView(viewId);
      });
    })();

    (function initUaAgriStepDialog() {
      const dlg = document.getElementById("uaAgriStepDialog");
      if (!dlg || typeof dlg.showModal !== "function") return;
      const dlgTitle = dlg.querySelector(".ua-poi-step-dialog__title");
      const dlgBody = dlg.querySelector(".ua-poi-step-dialog__body");
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

      document.querySelectorAll(".ua-agri-step-detail").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const title = btn.getAttribute("data-title") || "";
          const body = btn.getAttribute("data-body") || "";
          if (dlgTitle) dlgTitle.textContent = title;
          if (dlgBody) dlgBody.textContent = body;
          dlg.showModal();
        });
      });
    })();

    (function initUaWylFlipCards() {
      const root = document.getElementById("uaWylModule");
      if (!root) return;

      function setFlipped(card, flipped) {
        card.classList.toggle("is-flipped", flipped);
        const front = card.querySelector(".ua-wyl-flip-card__face--front");
        const back = card.querySelector(".ua-wyl-flip-card__face--back");
        if (front) front.setAttribute("aria-hidden", flipped ? "true" : "false");
        if (back) back.setAttribute("aria-hidden", flipped ? "false" : "true");
      }

      root.querySelectorAll(".ua-wyl-flip-card").forEach(function (card) {
        const hint = card.querySelector(".ua-wyl-flip-card__hint");
        const closeBtn = card.querySelector(".ua-wyl-flip-card__close");
        const back = card.querySelector(".ua-wyl-flip-card__face--back");

        function toggleFlip() {
          setFlipped(card, !card.classList.contains("is-flipped"));
        }

        hint &&
          hint.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleFlip();
          });

        closeBtn &&
          closeBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            setFlipped(card, false);
          });

        back &&
          back.addEventListener("click", function (e) {
            if (e.target.closest(".ua-wyl-flip-card__close")) return;
            if (card.classList.contains("is-flipped")) setFlipped(card, false);
          });

        card.addEventListener("click", function (e) {
          if (e.target.closest(".ua-acled-zoom, .ua-wyl-flip-card__hint, .ua-wyl-flip-card__close")) return;
          if (!card.classList.contains("is-flipped")) toggleFlip();
        });

        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlip();
          }
          if (e.key === "Escape" && card.classList.contains("is-flipped")) {
            setFlipped(card, false);
          }
        });
      });
    })();

    (function initUaPoiStepDialog() {
      const dlg = document.getElementById("uaPoiStepDialog");
      if (!dlg || typeof dlg.showModal !== "function") return;
      const dlgTitle = dlg.querySelector(".ua-poi-step-dialog__title");
      const dlgBody = dlg.querySelector(".ua-poi-step-dialog__body");
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

      document.querySelectorAll(".ua-poi-step-detail").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const title = btn.getAttribute("data-title") || "";
          const body = btn.getAttribute("data-body") || "";
          if (dlgTitle) dlgTitle.textContent = title;
          if (dlgBody) dlgBody.textContent = body;
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
