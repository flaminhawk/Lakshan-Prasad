const GOATCOUNTER_CODE = "Lakshan-Prasad";

(function addScrollReveal() {
  document.documentElement.classList.add("js-motion");
  const revealItems = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

  revealItems.forEach((item) => observer.observe(item));
})();

(function showVisitCount() {
  const countElement = document.getElementById("site-visits");
  const captionElement = document.getElementById("visits-caption");
  const code = GOATCOUNTER_CODE.trim().toLowerCase();

  if (!countElement || !captionElement || !code) {
    captionElement.textContent = "Counter not configured";
    return;
  }

  const endpoint = "https://" + code + ".goatcounter.com";
  const path = window.location.pathname || "/";
  const counterScript = document.createElement("script");
  counterScript.src = "https://gc.zgo.at/count.js";
  counterScript.async = true;
  counterScript.dataset.goatcounter = endpoint + "/count";
  document.head.appendChild(counterScript);

  // The visible total should still load if a browser blocks count.js.
  fetch(endpoint + "/counter/" + encodeURIComponent(path) + ".json")
    .then((response) => {
      if (!response.ok) throw new Error("GoatCounter did not return a count.");
      return response.json();
    })
    .then((result) => {
      if (result.count === undefined) throw new Error("GoatCounter returned no count.");
      countElement.textContent = result.count;
      captionElement.textContent = "total visits";
    })
    .catch(() => {
      captionElement.textContent = "Check GoatCounter setup";
    });
})();
