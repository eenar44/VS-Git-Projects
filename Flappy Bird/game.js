// need to add a box collider at the top of the page so that it does not fly off the screen, not game over, just prevent from jumping higher
// need to replace the pipes and the flappy with graphics
// need to add the clouds (make them move)
// need to add a proper game over screen, make the scean freeze and display the score
// high score?
// make the score bigger
// only start the game when the player presses space
// interactive start screen

const bird = {
    x: 450,
    y: 200,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -8 
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Select the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// increase the velocity of the bird by the strentgh of the jump
function jump() {
    if (!gameOver) {
        bird.velocity = bird.jumpStrength;
    }
}

// listen for spacebar to make the bird jump
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        jump();
    }
});

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'darkblue';  // Pipe colour
    for (let i = 0; i < pipes.length; i++) {
        // Top pipe
        //              x        y width  height
        ctx.fillRect(pipes[i].x, 0, 50, pipes[i].y);  // Draw the top part of the pipe

        // Bottom pipe
        ctx.fillRect(pipes[i].x, pipes[i].y + 120, 50, canvas.height - pipes[i].y - 120);  // Draw the bottom part of the pipe
    }
}

// Function to update the game state
function update() {
    if (gameOver) return;

    // Apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Generate pipes every 100 frames
    if (frame % 100 === 0) {
        let gap = 120; // Space between top and bottom pipes
        let pipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
        pipes.push({ x: canvas.width, y: pipeHeight });
    }

    // Move pipes left
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        // Check for collisions
        if (
            (bird.x < pipes[i].x + 50 &&
                bird.x + bird.width > pipes[i].x &&
                (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + 120)) ||
            bird.y + bird.height >= canvas.height
        ) {
            gameOver = true;
        }

        // Check if bird passed a pipe (increase score)
        if (pipes[i].x === bird.x) {
            score++;
        }
    }

    // Remove pipes that are off-screen
    pipes = pipes.filter(pipe => pipe.x > -50);

    frame++; // Increase frame count
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    drawBird();
    drawPipes();

    // draw the score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    // Draw game over text
    if (gameOver) {
        ctx.fillText("Game Over", canvas.width / 2 - 50, canvas.height / 2);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();