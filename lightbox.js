  (() => {
    // Sammle alle Bilder inkl. zugehöriger Captions
    const thumbs = Array.from(document.querySelectorAll("img.bild"));

    if (!thumbs.length) return;

    const lb = document.getElementById("lightbox");
    const imgEl = lb.querySelector(".lightbox__img");
    const capEl = lb.querySelector(".lightbox__caption");
    const btnClose = lb.querySelector(".lightbox__close");
    const btnPrev = lb.querySelector(".lightbox__prev");
    const btnNext = lb.querySelector(".lightbox__next");

    // Quellen & Captions aus dem DOM lesen
    const items = thumbs.map((img) => {
      const fig = img.closest("figure");
      const caption =
        fig?.querySelector("figcaption")?.innerHTML || img.alt || "";
      return {
        src: img.dataset.full || img.src,
        caption,
      };
    });

    let index = 0;
    let lastFocus = null;

    if (items.length < 2) lb.classList.add("no-nav");

    function setImage(i) {
      index = (i + items.length) % items.length;
      const { src, caption } = items[index];
      imgEl.src = src;
      imgEl.alt = caption || thumbs[index].alt || "";
      capEl.innerHTML = caption;
      // Preload Nachbarn
      new Image().src = items[(index - 1 + items.length) % items.length].src;
      new Image().src = items[(index + 1) % items.length].src;
    }

    function open(i) {
      setImage(i);
      lb.hidden = false;
      lb.setAttribute("aria-hidden", "false");
      lastFocus = document.activeElement;
      document.body.style.overflow = "hidden";
      btnClose.focus();
    }

    function close() {
      lb.hidden = true;
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lastFocus?.focus();
    }

    thumbs.forEach((img, i) => {
      img.style.cursor = "zoom-in";
      img.setAttribute("tabindex", "0");
      img.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      });
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
    });

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", () => setImage(index - 1));
    btnNext.addEventListener("click", () => setImage(index + 1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") setImage(index - 1);
      if (e.key === "ArrowRight") setImage(index + 1);
    });
  })();

