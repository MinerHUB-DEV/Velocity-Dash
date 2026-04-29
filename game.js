let hue = 0; // Add this at the very top of your script

// ... inside your draw function, replace the Game Over block with this:

    if (isGameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 🌈 RAINBOW EFFECT
        hue += 2; // This changes the color every frame
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`; 
        
        ctx.textAlign = "center";
        ctx.font = "bold 50px Arial";
        ctx.fillText("MISSION FAILED", canvas.width/2, canvas.height/2);
        
        ctx.font = "25px Arial";
        ctx.fillStyle = "white"; // Keep the instructions white
        ctx.fillText("Final Score: " + Math.floor(score), canvas.width/2, canvas.height/2 + 50);
        ctx.fillText("Click to Respawn", canvas.width/2, canvas.height/2 + 90);
        ctx.textAlign = "left";
    }
