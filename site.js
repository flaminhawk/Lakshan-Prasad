const GOATCOUNTER_CODE = "lakshan-prasad";

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

  if (!code) {
    captionElement.textContent = "Counter not configured";
    return;
  }

  const endpoint = `https://${code}.goatcounter.com`;
  const counterScript = document.createElement("script");
  counterScript.src = "https://gc.zgo.at/count.js";
  counterScript.async = true;
  counterScript.dataset.goatcounter = `${endpoint}/count`;

  counterScript.addEventListener("load", async () => {
    try {
      const trackingData = window.goatcounter && typeof window.goatcounter.get_data === "function"
        ? window.goatcounter.get_data()
        : {};
      const path = trackingData.p || window.location.pathname;
      const response = await fetch(`${endpoint}/counter/${encodeURIComponent(path)}.json`);
      if (!response.ok) throw new Error("GoatCounter did not return a count.");
      const result = await response.json();
      countElement.textContent = result.count;
      captionElement.textContent = "total visits";
    } catch {
      captionElement.textContent = "Check counter setup";
    }
  }, { once: true });

  counterScript.addEventListener("error", () => {
    captionElement.textContent = "Check counter setup";
  }, { once: true });

  document.head.appendChild(counterScript);
})();
