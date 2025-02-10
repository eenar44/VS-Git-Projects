// selects the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// gets the restart button element
const restartButton = document.getElementById('restartButton');

// import images
const cloudImg = new Image();
cloudImg.src = "Graphics/unitytut-cloud.png"; // cloud image

const birdImg = new Image();
birdImg.src = "Graphics/unitytut-birdbody.png"; // bird image

const pipeBodyImg = new Image();
pipeBodyImg.src = "Graphics/unitytut-pipebody.png"; // pipe body image

const pipeTopImg = new Image();
pipeTopImg.src = "Graphics/unitytut-pipetop.png"; // pipe body image

const pipeCapHeight = 15; // height of the fixed cap
const pipeDrawWidth = 50; // The width of the pipe on the canvas
const pipeSpeed = 2;  // the speed the pipes will be moving at
const gap = 120; // the vertical gap between top and bottom pipes
const bird = {
    x: (canvas.width / 2) - 25, // initial posiiton of the bird
    y: (canvas.height / 2),
    width: 446 / 12, // scaled down height and width of the bird
    height: 520 / 12,
    velocity: 0, // how high the bird is when jumping
    gravity: 0.5, // at what rate it will fall
    jumpStrength: -8, // how high it can jump at a time
}; // bird functionality

let pipes = []; // a list of all the pipe objects on the canvas
let clouds = []; // stores cloud objects on the canvas
let frame = 0; // frames per second
let score = 0; // score counter
let highScore = 0;  // keeps track of the high score
let gameOver = false; // indicates if the game is over
let gameStarted = false; // tracks whether the game has started
let startTextX = canvas.width / 2 - 200; // Initial position of the message

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        if (!gameStarted) {
            gameStarted = true; // start the game on first press
        } else if (!gameOver) {
            jump(); // normal jump function
        }
    }
});

// function when the reset button is clicked
restartButton.addEventListener("click", function () {
    // reset key variables
    gameOver = false;
    gameStarted = false;
    bird.y = (canvas.height / 2);
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frame = 0;
    restartButton.style.display = "none";
});

// increase the velocity of the bird by the strentgh of the jump as long as the game isnt over
function jump() {
    if (!gameOver) {
        bird.velocity = bird.jumpStrength;
    }
}

// listen for spacebar to make the bird jump
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        jump();
    }
});

// draws the bird using the image graphic on the canvas
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

// draws the top pipe on the screen
function drawTopPipe(pipe) {
    // makes sure that the pipe height is always greater than 0
    // finds the height of the pipe by minusing the random y position with the height of the cap
    let bodyHeight = Math.max(pipe.y - pipeCapHeight, 0);

    // draws the pipe body
    ctx.drawImage(pipeBodyImg, pipe.x, 0, pipeDrawWidth, bodyHeight);

    // draws the pipes cap
    ctx.drawImage(pipeTopImg, pipe.x, bodyHeight, pipeDrawWidth, pipeCapHeight);
}

// draws the bottom pipe on the screen
function drawBottomPipe(pipe) {
    // spaces the bottom pipe appropriately
    let bottomPipeY = pipe.y + gap;

    // calculates the bottom pipe height
    // uses the cavas height, the y position of the pipe and the height of the top pipe
    let bottomBodyHeight = canvas.height - bottomPipeY - pipeCapHeight;

    // draws the bottom pipe
    ctx.drawImage(
        pipeBodyImg,
        pipe.x,
        bottomPipeY + pipeCapHeight,
        pipeDrawWidth,
        bottomBodyHeight
    );

    // draws the bottom pipes cap
    // reverses the image of the cap to draw the image
    ctx.save(); // saves the current canas state
    ctx.scale(1, -1); // flips horizontally
    ctx.drawImage(
        pipeTopImg,
        pipe.x,
        -bottomPipeY - pipeCapHeight,
        pipeDrawWidth,
        pipeCapHeight
    ); // draws the image
    ctx.restore(); // restores the canvas
}

// loops and calls the pipe functions to create a continuous loop of pipes
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        drawTopPipe(pipes[i]);
        drawBottomPipe(pipes[i]);
    }
}

// generates pipes every 100 frames
function generatePipes() {
    if (!gameStarted) { return };

    if (frame % 100 === 0) {
        // created a random pipe height using random, the height of the canvas and the gap
        // '100' is used as buffer to ensure that a pipe isnt too long or too short
        // 50 is the minimum height of a pipe
        let pipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
        // push the pipes coordinates onto the list of dictionaries of pipe coordinates
        pipes.push({ x: canvas.width, y: pipeHeight });
    }
}

// a circular collider inside the bird, as the 
function circleCollision(bird, pipe) {
    let birdRadius = bird.width / 2.5;  // using the width to find the radius

    // using the coordinates and the width/ height to find the centre of the collider
    let birdCenterX = bird.x + bird.width / 2;
    let birdCenterY = bird.y + bird.height / 2;

    // uses the horizontal distance between the birds center and the center of the pipe
    // if the distance is less than the sum of their radii, it means they are overlapping
    // if the y coord. minus the bird radius is above the top pipes bottom, then it has hit it vertically

    // check collision with the top pipe
    if (
        Math.abs(birdCenterX - (pipe.x + pipeDrawWidth / 2)) <
        birdRadius + pipeDrawWidth / 2 &&  // checking horizonal
        birdCenterY - birdRadius < pipe.y  // checks vertically 
    ) {
        return true;
    }

    // check collision with the bottom pipe
    if (
        Math.abs(birdCenterX - (pipe.x + pipeDrawWidth / 2)) <
        birdRadius + pipeDrawWidth / 2 &&
        birdCenterY + birdRadius > pipe.y + gap
    ) {
        return true;
    }

    return false;
}

function updatePipes() {
    // generates the pipes
    generatePipes();

    // move pipes left
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        // check for collisions
        if (circleCollision(bird, pipes[i])) {
            gameOver = true;
        }

        // prevents bird from flying off the top
        if (bird.y < 0) {
            bird.y = 0;
        }

        // game over if the bird hits the ground
        if (bird.y + bird.height >= canvas.height) {
            gameOver = true;
            bird.y = canvas.height - bird.height; // stop bird at the ground
        }

        // check if bird passed a pipe to increase score
        if (pipes[i].x + pipeDrawWidth < bird.x && !pipes[i].scored) {
            score++;
            pipes[i].scored = true; // Mark this pipe as counted
        }
    }
}

// generates clouds
function generateClouds() {
    // loop to generate the clouds
    for (let i = 0; i < 5; i++) {
        clouds.push({
            x: i * 300, // space between the clouds
            y: Math.random() * canvas.height, // random heights
            width: 200, // width for all clouds
            height: 75,  // height of the clouds
            speed: pipeSpeed, // moves at the same speed as pipes
        });
    }
}

// move clouds left
function updateClouds() {
    for (let i = 0; i < clouds.length; i++) {
        // moves the x coordinate of the cloud left by 2 (the speed)
        clouds[i].x -= clouds[i].speed;

        // reset cloud position when it goes off screen
        if (clouds[i].x + clouds[i].width < 0) {
            clouds[i].x = canvas.width; // move to the right edge instead of deleting
        }
    }
}

// draws all clouds
function drawClouds() {
    for (let i = 0; i < clouds.length; i++) {
        ctx.drawImage(
            cloudImg,
            clouds[i].x,
            clouds[i].y,
            clouds[i].width,
            clouds[i].height
        );
    }
}

function update() {
    // checks the gameover flag
    if (!gameStarted || gameOver) { return }; // Wait for space to start

    // applies gravity to the bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // moves the clouds
    updateClouds();

    // moves the pipes
    updatePipes()

    // remove pipes that are off screen
    pipes = pipes.filter((pipe) => pipe.x > -50);

    frame++; // increase frame count
}

function drawGameOverScreen() {
    // Adjusted Box Dimensions
    let boxWidth = 300;
    let boxHeight = 250;
    let boxX = (canvas.width - boxWidth) / 2;
    let boxY = (canvas.height - boxHeight) / 2;

    // Draw Border (Dark Brown)
    ctx.fillStyle = "#5A3E2B";
    ctx.fillRect(boxX - 5, boxY - 5, boxWidth + 10, boxHeight + 10);

    // Draw Background (Orange-Yellow)
    ctx.fillStyle = "#F4A259";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Set Text Properties
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', cursive";

    // Function to Center Text Manually
    function drawCenteredText(text, yOffset) {
        let textWidth = ctx.measureText(text).width;
        let textX = boxX + (boxWidth - textWidth) / 2; // Manually centering text
        ctx.fillText(text, textX, boxY + yOffset);
    }

    // Draw Text Inside the Box
    drawCenteredText("Game Over", 50);
    drawCenteredText("Score", 90);
    drawCenteredText(score.toString(), 120);
    drawCenteredText("High Score", 150);
    drawCenteredText(highScore.toString(), 180);

    // Adjusted Button Dimensions
    let buttonWidth = 200;
    let buttonHeight = 50;
    let buttonX = (canvas.width - buttonWidth) / 2;
    let buttonY = boxY + boxHeight - 60;

    // Draw Button Border (White)
    ctx.fillStyle = "white";
    ctx.fillRect(buttonX - 3, buttonY - 3, buttonWidth + 6, buttonHeight + 6);

    // Draw Button Background (#D72638)
    ctx.fillStyle = "#D72638";
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Draw Button Text Manually Centered
    ctx.fillStyle = "white";
    ctx.font = "22px 'Press Start 2P', cursive";
    let buttonText = "Restart";
    let buttonTextWidth = ctx.measureText(buttonText).width;
    let buttonTextX = buttonX + (buttonWidth - buttonTextWidth) / 2;
    ctx.fillText(buttonText, buttonTextX, buttonY + 33);

    // Display actual HTML button for better click functionality
    restartButton.style.display = "block";
    restartButton.style.top = `${buttonY + canvas.offsetTop}px`;
    restartButton.style.left = `${canvas.offsetLeft + buttonX}px`;
    restartButton.style.width = `${buttonWidth}px`;
    restartButton.style.height = `${buttonHeight}px`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw all the graphics
    drawClouds();
    drawBird();
    drawPipes();

    // Draw the score
    ctx.fillStyle = "white";
    ctx.font = "20px 'Press Start 2P', cursive";
    ctx.fillText("Score: " + score, 20, 30);

    // Show "Press Space to Start" before game starts
    if (!gameStarted) {
        ctx.fillText("Press Space to Start", startTextX, (canvas.height / 2) - 50);
    }

    // Draw game over text and show the restart button
    if (gameOver) {
        if (score > highScore) {
            highScore = score;
        }
        drawGameOverScreen();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

generateClouds();
gameLoop();
