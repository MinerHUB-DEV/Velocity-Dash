const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let obstacles = [];

const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    color: '#00f2ff',
    dy: 0,
    jumpForce: 13, // Slightly higher jump
    gravity: 0.7,
    grounded: false
};

function spawnObstacle() {
    // Max height is 60 so it's never impossible to jump over
    let height = Math.random() * (60 - 30) + 30; 
    let width = 30;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - height,
        width: width,
        height: height
    });
}

function resetGame() {
    score = 0;
    gameSpeed = 5;
    isGameOver = false;
    obstacles = [];
    player.y = 300;
    player.dy = 0;
    loop();
}

function update() {
    if (isGameOver) return;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;

        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            isGameOver = true;
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
            score += 10;
            if (gameSpeed < 15) gameSpeed += 0.2; // Speed cap so it stays playable
        }
    });

    if (Math.random() < 0.015) spawnObstacle();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Obstacles
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Draw UI
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + Math.floor(score), 20, 30);

    if (isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
        ctx.font = "20px Arial";
        ctx.fillText("Final Score: " + score, canvas.width/2, canvas.height/2 + 40);
        ctx.fillText("Press SPACE to Restart", canvas.width/2, canvas.height/2 + 80);
        ctx.textAlign = "left";
    }
}

function loop() {
    if (isGameOver) {
        draw(); // Draw final frame
        return;
    }
    update();
    draw();
    requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (isGameOver) {
            resetGame();
        } else if (player.grounded) {
            player.dy = -player.jumpForce;
            player.grounded = false;
        }
    }
});

loop();
