const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 500;

let score = 0;
let isGameOver = false;
let obstacles = [];
let bullets = [];
let particles = [];
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

// Track Mouse Movement
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// Shoot on Click
canvas.addEventListener('mousedown', () => {
    if (isGameOver) { resetGame(); return; }
    bullets.push({ x: mouse.x, y: mouse.y, angle: Math.random() * Math.PI * 2 });
});

function createExplosion(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30,
            color
        });
    }
}

function spawnObstacle() {
    const size = Math.random() * 30 + 20;
    let x, y;
    if (Math.random() < 0.5) {
        x = Math.random() < 0.5 ? 0 - size : canvas.width + size;
        y = Math.random() * canvas.height;
    } else {
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? 0 - size : canvas.height + size;
    }
    const angle = Math.atan2(mouse.y - y, mouse.x - x);
    obstacles.push({ x, y, size, vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3 });
}

function update() {
    if (isGameOver) return;

    // Move Bullets
    bullets.forEach((b, i) => {
        b.x += Math.cos(b.angle) * 10;
        b.y += Math.sin(b.angle) * 10;
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) bullets.splice(i, 1);
    });

    // Move Obstacles
    obstacles.forEach((obs, i) => {
        obs.x += obs.vx;
        obs.y += obs.vy;

        // Collision with Ship (Mouse)
        const dist = Math.hypot(mouse.x - obs.x, mouse.y - obs.y);
        if (dist < obs.size) isGameOver = true;

        // Collision with Bullets
        bullets.forEach((b, bi) => {
            const bDist = Math.hypot(b.x - obs.x, b.y - obs.y);
            if (bDist < obs.size) {
                createExplosion(obs.x, obs.y, '#ff0055');
                obstacles.splice(i, 1);
                bullets.splice(bi, 1);
                score += 100;
            }
        });
    });

    particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    });

    if (Math.random() < 0.03) spawnObstacle();
}

function draw() {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Particles
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x, p.y, 3, 3);
    });
    ctx.globalAlpha = 1;

    // Draw Ship (At Mouse)
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00f2ff';
    ctx.fillStyle = '#00f2ff';
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw Obstacles
    ctx.shadowColor = '#ff0055';
    ctx.fillStyle = '#ff0055';
    obstacles.forEach(obs => {
        ctx.beginPath();
        ctx.arc(obs.x, obs.y, obs.size, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw UI
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 40);

    if (isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.fillText('SHIP DESTROYED', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Click to Respawn', canvas.width / 2, canvas.height / 2 + 40);
        ctx.textAlign = 'left';
    }
}

function resetGame() {
    score = 0; isGameOver = false; obstacles = []; bullets = []; particles = [];
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();
