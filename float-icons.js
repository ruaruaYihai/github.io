(function (global) {
  const tones = [
    "var(--brand-2)",
    "var(--brand-3)",
    "var(--brand-4)",
    "var(--brand-5)",
    "var(--brand-6)"
  ];
  /** 仅两种：圆形扩散冲击波纹、警告三角+感叹号 */
  const ICON_SVGS = {
    shockwave:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="2.2" stroke="currentColor" stroke-width="1.15"/><circle cx="16" cy="16" r="6.5" stroke="currentColor" stroke-width="1" opacity="0.95"/><circle cx="16" cy="16" r="11" stroke="currentColor" stroke-width="0.95" opacity="0.82"/><circle cx="16" cy="16" r="15" stroke="currentColor" stroke-width="0.85" opacity="0.65"/><path d="M16 4.5 L16 9.5 M25.2 6.8 L21.7 10.3 M27.5 16 H22.5 M25.2 25.2 L21.7 21.7 M16 27.5 V22.5 M6.8 25.2 L10.3 21.7 M4.5 16 H9.5 M6.8 6.8 L10.3 10.3" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" opacity="0.9"/></svg>',
    warning:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 5 L28 26 H4 Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M16 12.5 V19.5" stroke="currentColor" stroke-width="1.35" stroke-linecap="round"/><circle cx="16" cy="22.8" r="1.15" fill="currentColor"/></svg>'
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
