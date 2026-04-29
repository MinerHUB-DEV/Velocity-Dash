const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let gameSpeed = 7;
let isGameOver = false;
let particles = [];
let shake = 0;

const player = {
    x: 80,
    y: 200,
    width: 30,
    height: 20,
    color: '#00f2ff',
    dy: 0,
    speed: 0.8, // How fast you move up/down
    friction: 0.9 // Makes movement feel smooth
};

let obstacles = [];
let items = [];
const keys = {};

// Handle Controls
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function createParticle(x, y, color) {
    for(let i=0; i<5; i++) {
        particles.push({
            x, y, 
            xv: (Math.random()-0.5)*5, 
            yv: (Math.random()-0.5)*5, 
            life: 20, 
            color
        });
    }
}

function update() {
    if (isGameOver) {
        if (keys['Space']) resetGame();
        return;
    }

    // 1. Smooth Movement (Up/Down)
    if (keys['ArrowUp'] || keys['KeyW']) player.dy -= player.speed;
    if (keys['ArrowDown'] || keys['KeyS']) player.dy += player.speed;
    
    player.dy *= player.friction;
    player.y += player.dy;

    // Constrain to screen
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // 2. Spawn Logic
    if (Math.random() < 0.05) {
        obstacles.push({ x: canvas.width, y: Math.random()*(canvas.height-40), w: 40, h: 40 });
    }
    if (Math.random() < 0.02) {
        items.push({ x: canvas.width, y: Math.random()*(canvas.height-20), w: 15, h: 15 });
    }

    // 3. Update Obstacles
    obstacles.forEach((obs, i) => {
        obs.x -= gameSpeed;
        // Collision
        if (player.x < obs.x + obs.w && player.x + player.width > obs.x &&
            player.y < obs.y + obs.h && player.y + player.height > obs.y) {
            isGameOver = true;
            shake = 20; // Big shake on death
        }
        if (obs.x + obs.w < 0) obstacles.splice(i, 1);
    });

    // 4. Update Items (Score boosters)
    items.forEach((item, i) => {
        item.x -= gameSpeed;
        if (player.x < item.x + item.w && player.x + player.width > item.x &&
            player.y < item.y + item.h && player.y + player.height > item.y) {
            items.splice(i, 1);
            score += 50;
            gameSpeed += 0.2;
            shake = 10; // Small shake for juice
            createParticle(item.x, item.y, '#ffff00');
        }
        if (item.x + item.w < 0) items.splice(i, 1);
    });

    // 5. Update Particles
    particles.forEach((p, i) => {
        p.x += p.xv; p.y += p.yv; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    });

    if (shake > 0) shake--;
    score += 0.1;
}

function draw() {
    ctx.save();
    // 6. Screen Shake
    if (shake > 0) {
        ctx.translate((Math.random()-0.5)*shake, (Math.random()-0.5)*shake);
    }

    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Player Trail
    createParticle(player.x, player.y + 10, '#00f2ff');

    // Draw Particles
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 20;
        ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Draw Player (Ship shape)
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + 30, player.y + 10);
    ctx.lineTo(player.x, player.y + 20);
    ctx.fill();

    // Draw Obstacles (Asteroids)
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.w, obs.h));

    // Draw Items (Cores)
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    items.forEach(item => {
        ctx.beginPath();
        ctx.arc(item.x + 7, item.y + 7, 7, 0, Math.PI*2);
        ctx.fill();
    });

    // UI
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.fillText("SCORE: " + Math.floor(score), 20, 40);

    if (isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("CRITICAL FAILURE", canvas.width/2, 200);
        ctx.fillText("PRESS SPACE TO RE-RELAUNCH", canvas.width/2, 240);
        ctx.textAlign = "left";
    }

    ctx.restore();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function resetGame() {
    score = 0; gameSpeed = 7; isGameOver = false;
    obstacles = []; items = []; particles = [];
    player.y = 200; player.dy = 0;
}

loop();
