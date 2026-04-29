const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let gameSpeed = 5;
let isGameOver = false;

// Player settings
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: '#00f2ff', // Neon Blue
    dy: 0,
    jumpForce: 12,
    gravity: 0.6,
    grounded: false
};

// Obstacle settings
const obstacles = [];

function spawnObstacle() {
    let size = Math.random() * (50 - 20) + 20;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: size,
        height: size,
        color: '#ff0055' // Neon Pink
    });
}

function update() {
    if (isGameOver) return;

    // Apply Gravity
    player.dy += player.gravity;
    player.y += player.dy;

    // Ground Collision
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    // Move Obstacles
    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;

        // Collision Detection
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            isGameOver = true;
            alert("GAME OVER! Score: " + Math.floor(score));
            location.reload(); // Restarts game
        }

        // Remove old obstacles
        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
            score += 10;
            gameSpeed += 0.1; // Make it faster!
        }
    });

    if (Math.random() < 0.02) spawnObstacle();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Obstacles
    ctx.fillStyle = '#ff0055';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw Score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + Math.floor(score), 20, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
});

loop();
