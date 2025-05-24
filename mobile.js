let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.rotation = Math.random() * 30 - 15;

    this.init();
  }

  init() {
    this.paper.style.touchAction = "none"; // Prevent browser gestures

    this.paper.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.holdingPaper = true;
        this.startX = e.touches[0].clientX - this.offsetX;
        this.startY = e.touches[0].clientY - this.offsetY;

        this.paper.style.zIndex = highestZ++;
      }
    });

    this.paper.addEventListener("touchmove", (e) => {
      e.preventDefault();

      if (this.holdingPaper && e.touches.length === 1) {
        this.currentX = e.touches[0].clientX - this.startX;
        this.currentY = e.touches[0].clientY - this.startY;

        this.offsetX = this.currentX;
        this.offsetY = this.currentY;

        this.updateTransform();
      }

      // Optional: Simulate rotation with 2 fingers
      if (e.touches.length === 2) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        this.rotation = Math.atan2(dy, dx) * (180 / Math.PI);
        this.updateTransform();
      }
    });

    this.paper.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) {
        this.holdingPaper = false;
      }
    });
  }

  updateTransform() {
    this.paper.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${this.rotation}deg)`;
  }
}

// Initialize all paper elements
document.querySelectorAll(".paper").forEach((el) => new Paper(el));
