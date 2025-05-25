let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  lastConfettiTime = 0;

  init(paper) {
    const onMove = (x, y) => {
      if (!this.rotating) {
        this.velX = x - this.prevX;
        this.velY = y - this.prevY;
      }

      const dirX = x - this.startX;
      const dirY = y - this.startY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevX = x;
        this.prevY = y;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

        const now = Date.now();
        if (typeof confetti === 'function' && (now - this.lastConfettiTime > 50)) {
          this.lastConfettiTime = now;
          confetti({
            particleCount: 7,
            startVelocity: 5,
            spread: 45,
            ticks: 120,
            gravity: 0.1,
            decay: 0.9,
            origin: {
              x: x / window.innerWidth,
              y: y / window.innerHeight
            },
            colors: ['#FFC0CB', '#FFB7C5', '#FF69B4', '#FF85A2'],
            shapes: ['circle'],
            scalar: 0.8
          });
        }
      }
    };

    // Mouse Events
    document.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.prevX = e.clientX;
      this.prevY = e.clientY;

      if (e.button === 2) this.rotating = true;
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch Events
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.prevX = touch.clientX;
      this.prevY = touch.clientY;

      if (e.touches.length === 2) {
        this.rotating = true;
      }
    }, { passive: false });

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      onMove(touch.clientX, touch.clientY);
    }, { passive: false });

    paper.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.holdingPaper = false;
        this.rotating = false;
      }
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});

// Play music on first user interaction
function playMusicOnInteraction() {
  const audio = document.getElementById("bg-music");
  if (audio) {
    audio.play().catch(e => console.log("Autoplay blocked:", e));
  }
  document.removeEventListener("click", playMusicOnInteraction);
  document.removeEventListener("touchstart", playMusicOnInteraction);
  
}

document.addEventListener("click", playMusicOnInteraction);
document.addEventListener("touchstart", playMusicOnInteraction);
