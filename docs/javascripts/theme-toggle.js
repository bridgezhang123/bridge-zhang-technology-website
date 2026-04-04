(function () {
  var PALETTE_SELECTOR = 'form[data-md-component="palette"]';

  function createIcon(name) {
    var span = document.createElement("span");
    span.className = "site-theme-toggle__option site-theme-toggle__option--" + name;
    span.dataset.themeOption = name === "sun" ? "light" : "dark";
    span.setAttribute("aria-hidden", "true");
    span.innerHTML = name === "sun"
      ? '<svg viewBox="0 0 24 24" focusable="false"><path d="M12 3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Zm0 13.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75Zm8.25-6a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5ZM6.75 12a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1 0-1.5H6a.75.75 0 0 1 .75.75Zm9.084-5.334a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 0-1.061Zm-9.788 9.788a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 0-1.061Zm11.908 1.06a.75.75 0 0 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 1.06-1.061l1.06 1.06ZM8.166 7.727a.75.75 0 0 1-1.06 1.06l-1.06-1.06a.75.75 0 1 1 1.06-1.061l1.06 1.06ZM12 7.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Zm0 1.5a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"/></svg>'
      : '<svg viewBox="0 0 24 24" focusable="false"><path d="M14.5 3.75a.75.75 0 0 1 .256 1.455A7.5 7.5 0 1 0 18.795 15.5a.75.75 0 0 1 1.01.908A9 9 0 1 1 13.592 4a.75.75 0 0 1 .908-.25Z"/></svg>';
    return span;
  }

  function syncPalette(toggle, paletteForm) {
    var body = document.body;
    var isDark = body.getAttribute("data-md-color-scheme") === "slate";
    var label = isDark ? "Dark" : "Light";
    var activeMode = isDark ? "dark" : "light";

    toggle.classList.toggle("is-dark", isDark);
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", "Switch color mode. Current: " + label);
    paletteForm.dataset.siteThemeMode = isDark ? "dark" : "light";

    var options = toggle.querySelectorAll("[data-theme-option]");
    options.forEach(function (option) {
      option.classList.toggle(
        "is-active",
        option.getAttribute("data-theme-option") === activeMode
      );
    });
  }

  function enhancePalette(paletteForm) {
    if (!paletteForm || paletteForm.dataset.enhancedThemeToggle === "true") {
      return;
    }

    var labels = paletteForm.querySelectorAll("label[for]");
    if (labels.length < 2) {
      return;
    }

    paletteForm.dataset.enhancedThemeToggle = "true";
    paletteForm.classList.add("site-theme-toggle");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "site-theme-toggle__button";

    var track = document.createElement("span");
    track.className = "site-theme-toggle__track";

    track.appendChild(createIcon("sun"));
    track.appendChild(createIcon("moon"));

    button.appendChild(track);

    button.addEventListener("click", function () {
      var isDark = document.body.getAttribute("data-md-color-scheme") === "slate";
      var targetLabel = paletteForm.querySelector(
        isDark ? 'label[for="__palette_0"]' : 'label[for="__palette_1"]'
      );

      if (targetLabel) {
        targetLabel.click();
      }
    });

    paletteForm.appendChild(button);
    syncPalette(button, paletteForm);

    var observer = new MutationObserver(function () {
      syncPalette(button, paletteForm);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-md-color-scheme"],
    });
  }

  function initThemeToggle() {
    var paletteForm = document.querySelector(PALETTE_SELECTOR);
    if (!paletteForm) {
      return;
    }

    enhancePalette(paletteForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle, { once: true });
  } else {
    initThemeToggle();
  }
})();
