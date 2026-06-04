/* ============================================================
   TSIA2 Summer Bridge Slideshow — slides.js
   ============================================================ */

(function () {
  "use strict";

  const slides   = Array.from(document.querySelectorAll(".slide"));
  const progress = document.getElementById("progress");
  const prevBtn  = document.getElementById("prevBtn");
  const nextBtn  = document.getElementById("nextBtn");
  let current    = 0;

  /* ----------------------------------------------------------
     showSlide(index)
     Activates the slide at the given index, updates controls
     and progress text, and injects a subtle slide-number badge
     into each frame so teachers can reference "Slide 6" etc.
  ---------------------------------------------------------- */
  function showSlide(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === current);
    });

    progress.textContent = `Slide ${current + 1} of ${slides.length}`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;

    window.scrollTo(0, 0);

    // Announce to screen readers
    progress.setAttribute("aria-live", "polite");
  }

  function moveSlide(delta) {
    showSlide(current + delta);
  }

  /* ----------------------------------------------------------
     Keyboard navigation
     ← / →  : previous / next
     Space   : next
     Home    : first slide
     End     : last slide
  ---------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return; // don't hijack form inputs

    switch (e.key) {
      case "ArrowRight":
      case " ":
        e.preventDefault();
        moveSlide(1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveSlide(-1);
        break;
      case "Home":
        e.preventDefault();
        showSlide(0);
        break;
      case "End":
        e.preventDefault();
        showSlide(slides.length - 1);
        break;
    }
  });

  /* ----------------------------------------------------------
     Touch/swipe support (mobile)
     Only fires on clearly horizontal swipes (|dx| > |dy| * 1.5)
     so vertical scrolling through cards/tables is unaffected.
  ---------------------------------------------------------- */
  let touchStartX = null;
  let touchStartY = null;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (touchStartX === null || touchStartY === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Require meaningful horizontal distance AND more horizontal than vertical
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      moveSlide(dx < 0 ? 1 : -1);
    }
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  /* ----------------------------------------------------------
     Expose moveSlide globally so onclick="" attributes work
  ---------------------------------------------------------- */
  window.moveSlide = moveSlide;

  /* ----------------------------------------------------------
     Init
  ---------------------------------------------------------- */
  showSlide(0);
})();