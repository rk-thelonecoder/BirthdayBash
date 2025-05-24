let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  // Throttle for confetti so it triggers max once every 50ms
  lastConfettiTime = 0;

  init(paper) {
    paper.addEventListener('touchstart', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;

      // If two fingers, start rotating
      if(e.touches.length === 2) {
        this.rotating = true;
      }
    }, {passive: false});

    paper.addEventListener('touchmove', (e) => {
      e.preventDefault(); // prevent scrolling

      if(!this.rotating) {
        const touch = e.touches[0];
        this.touchMoveX = touch.clientX;
        this.touchMoveY = touch.clientY;

        this.velX = this.touchMoveX - this.prevTouchX;
        this.velY = this.touchMoveY - this.prevTouchY;
      }

      const touch = e.touches[0];
      const dirX = touch.clientX - this.touchStartX;
      const dirY = touch.clientY - this.touchStartY;
      const dirLength = Math.sqrt(dirX*dirX + dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevTouchX = this.touchMoveX;
        this.prevTouchY = this.touchMoveY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

        // Cherry blossom confetti on drag, throttled every 50ms
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
              x: this.touchMoveX / window.innerWidth,
              y: this.touchMoveY / window.innerHeight
            },
            colors: ['#FFC0CB', '#FFB7C5', '#FF69B4', '#FF85A2'],
            shapes: ['circle'],
            scalar: 0.8
          });
        }
      }
    }, {passive: false});

    paper.addEventListener('touchend', (e) => {
      // If all fingers lifted, stop holding and rotating
      if(e.touches.length === 0) {
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
