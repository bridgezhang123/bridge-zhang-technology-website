document$.subscribe(() => {
  if (typeof mermaid === "undefined") return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose"
  });

  document.querySelectorAll("pre.mermaid").forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;

    const graph = document.createElement("div");
    graph.className = "mermaid";
    graph.textContent = el.textContent || "";
    parent.replaceChild(graph, el);
  });

  mermaid.run({ querySelector: ".mermaid" });
});
