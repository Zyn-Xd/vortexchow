// ============================================
// PERFECT PARTICLE TEXT (FORMATION EFFECT)
// ============================================

const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
let animationId;
let mouse = { x: null, y: null, radius: 120 };

const text = "Have you eaten?";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

class Particle {
  constructor(x, y) {
    // start scattered randomly
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.baseX = x;
    this.baseY = y;

    this.size = 1.5;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    // RETURN TO SHAPE (smooth lerp)
    const dx = this.baseX - this.x;
    const dy = this.baseY - this.y;

    this.vx += dx * 0.02;
    this.vy += dy * 0.02;

    // MOUSE INTERACTION (repel)
    if (mouse.x !== null && mouse.y !== null) {
      const mx = this.x - mouse.x;
      const my = this.y - mouse.y;
      const dist = Math.sqrt(mx * mx + my * my);

      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        const angle = Math.atan2(my, mx);

        this.vx += Math.cos(angle) * force * 6;
        this.vy += Math.sin(angle) * force * 6;
      }
    }

    // friction
    this.vx *= 0.92;
    this.vy *= 0.92;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];

  const fontSize = Math.min(window.innerWidth * 0.1, 100);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `900 ${fontSize}px Inter`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 40;

  ctx.fillText(text, centerX, centerY);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const index = (y * canvas.width + x) * 4;
      if (data[index + 3] > 128) {
        particles.push(new Particle(x, y));
      }
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(5,5,5,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  animationId = requestAnimationFrame(animate);
}

// mouse
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

// touch
canvas.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.touches[0].clientX - rect.left;
  mouse.y = e.touches[0].clientY - rect.top;
});

canvas.addEventListener("touchend", () => {
  mouse.x = null;
  mouse.y = null;
});

// init
resizeCanvas();
animate();

window.addEventListener("resize", resizeCanvas);
