(function () {
  const nodes = document.querySelectorAll('[data-reveal]');
  if (!nodes.length) return;

  const show = (el) => el.classList.add('is-visible');

  if (!('IntersectionObserver' in window)) {
    nodes.forEach(show);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.15,
    }
  );

  nodes.forEach((node) => observer.observe(node));
})();
