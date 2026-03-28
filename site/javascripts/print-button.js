document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".home-hero")) {
    return;
  }

  const container = document.querySelector(".md-content__inner");
  const heading = container?.querySelector("h1");

  if (!container || !heading || container.querySelector(".site-print-button")) {
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "site-print-button";
  button.textContent = "Print / 打印";
  button.setAttribute("aria-label", "Print this page");
  button.addEventListener("click", () => window.print());

  heading.insertAdjacentElement("afterend", button);
});
