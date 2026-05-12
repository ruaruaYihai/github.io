(function (global) {
  const tones = [
    "var(--brand-2)",
    "var(--brand-3)",
    "var(--brand-4)",
    "var(--brand-5)",
    "var(--brand-6)"
  ];
  /** 描线矢量小图标（透明底），随机抽取 */
  const ICON_SVGS = {
    explosion:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="2.8" stroke="currentColor" stroke-width="1.2"/><path d="M16 4 L16 28 M4 16 L28 16 M6.5 6.5 L25.5 25.5 M25.5 6.5 L6.5 25.5 M9 4.5 L23 27.5 M23 4.5 L9 27.5 M27.5 9 L4.5 23 M27.5 23 L4.5 9" stroke="currentColor" stroke-width="0.95" stroke-linecap="round"/><circle cx="7" cy="8" r="1.2" stroke="currentColor"/><circle cx="25" cy="9" r="1" stroke="currentColor"/><circle cx="9" cy="24" r="1.1" stroke="currentColor"/><circle cx="24" cy="23" r="0.9" stroke="currentColor"/></svg>',
    crosshair:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="11" stroke="currentColor" stroke-width="1.1"/><circle cx="16" cy="16" r="4" stroke="currentColor" stroke-width="1"/><path d="M16 2.5 V29.5 M2.5 16 H29.5" stroke="currentColor" stroke-width="1.05"/><circle cx="16" cy="16" r="1.35" fill="currentColor"/></svg>',
    city:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30" fill="none" aria-hidden="true"><path d="M2 24 L5 24 L5 15 L9 15 L9 24 L12 24 L12 12 L17 12 L17 24 L21 24 L21 9 L26 9 L26 24 L30 24 L30 14 L36 14 L36 24 L2 24 Z" stroke="currentColor" stroke-width="1.05" stroke-linejoin="round"/><path d="M13 17h2v2h-2zm5 0h2v2h-2zm12 2h2v2h-2" stroke="currentColor" stroke-width="0.9"/><path d="M27 3 A6.5 6.5 0 0 1 33 6.5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>',
    hospital:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect x="7" y="11" width="18" height="14" rx="1" stroke="currentColor" stroke-width="1.1"/><rect x="11.5" y="15" width="9" height="9" stroke="currentColor"/><path d="M16 16.2 V19.8 M14.1 18 H17.9" stroke="currentColor" stroke-width="1.25"/><path d="M15 25 h2" stroke="currentColor" stroke-width="1"/></svg>',
    satellite:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 34" fill="none" aria-hidden="true"><rect x="14" y="14" width="8" height="11" stroke="currentColor" stroke-width="1.05" rx="0.5"/><rect x="4" y="15.5" width="8" height="9" stroke="currentColor"/><rect x="24" y="15.5" width="8" height="9" stroke="currentColor"/><path d="M18 14 Q22 7 26 4.5" stroke="currentColor" stroke-width="1"/><path d="M27 6 Q29.5 9 32 12" stroke="currentColor" stroke-width="0.85" opacity="0.85"/><path d="M28 8 Q30.5 11 33 14" stroke="currentColor" stroke-width="0.75" opacity="0.65"/><path d="M29 10 Q31.5 13 34 16" stroke="currentColor" stroke-width="0.65" opacity="0.5"/></svg>',
    chart:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 28" fill="none" aria-hidden="true"><path d="M4 22 V18 M10 22 V14 M16 22 V10 M22 22 V6 M28 22 V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M4 18 L10 14 L16 10 L22 6 L28 3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var iconKinds = Object.keys(ICON_SVGS);

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildFloatingIconsFor(container, count) {
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var icon = document.createElement("span");
      var kind = iconKinds[Math.floor(Math.random() * iconKinds.length)];
      icon.className = "float-icon float-icon--svg";
      icon.innerHTML = ICON_SVGS[kind];
      icon.style.setProperty("--x", random(1, 98).toFixed(2));
      icon.style.setProperty("--y", random(2, 97).toFixed(2));
      icon.style.setProperty("--size", random(12, 36).toFixed(2));
      icon.style.setProperty("--alpha", random(0.16, 0.54).toFixed(2));
      icon.style.setProperty("--dur", random(11, 24).toFixed(2) + "s");
      icon.style.setProperty("--delay", (-random(0, 16)).toFixed(2) + "s");
      icon.style.setProperty("--dx1", random(-16, 16).toFixed(1) + "px");
      icon.style.setProperty("--dy1", random(-20, 20).toFixed(1) + "px");
      icon.style.setProperty("--dx2", random(-18, 18).toFixed(1) + "px");
      icon.style.setProperty("--dy2", random(-22, 22).toFixed(1) + "px");
      icon.style.setProperty("--tone", tones[Math.floor(Math.random() * tones.length)]);
      container.appendChild(icon);
    }
  }

  global.cpt208BuildFloatIcons = buildFloatingIconsFor;
})(typeof window !== "undefined" ? window : this);
