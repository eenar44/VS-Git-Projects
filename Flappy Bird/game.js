// Select the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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
const gap = 120; // the vertical gap between top and bottom pipes
const bird = {
  x: 450, // starting x and y position
  y: 200,
  width: 446 / 12, // scaled down height and width of the bird
  height: 520 / 12,
  velocity: 0, // how high the bird is
  gravity: 0.5, // at what rate it will fall
  jumpStrength: -8, // how high it can jump at a time
}; // bird functionality

let pipes = []; // a list of all the pipe objects on the canvas
let clouds = []; // stores cloud objects on the canvas
let frame = 0; // frames per second
let score = 0; // score counter
let gameOver = false; // indicates if the game is over

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

function drawBottomPipe(pipe) {
  // spaces the bottom pipe appropriately
  let bottomPipeY = pipe.y + gap;

  // calculates the bottom pipe height
  // uses the cavas height (450), the y position of the pipe and the height of the top pipe
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
  if (frame % 100 === 0) {
    let pipeHeight = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({ x: canvas.width, y: pipeHeight });
  }
}

// generates clouds
function generateClouds() {
  for (let i = 0; i < 5; i++) {
    clouds.push({
      x: i * 300, // evenly space clouds apart
      y: Math.random() * canvas.height, // random heights (upper third of screen)
      width: 200, // fixed width for all clouds
      height: 75,
      speed: 2, // moves at the same speed as pipes
    });
  }
}

// Move clouds left (same speed as pipes)
function updateClouds() {
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].x -= clouds[i].speed;

    // Reset cloud position when it goes off-screen
    if (clouds[i].x + clouds[i].width < 0) {
      clouds[i].x = canvas.width; // Move to the right edge
    }
  }
}

// Draw all clouds
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
  if (gameOver) return;
  updateClouds();

  // Apply gravity
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  generatePipes();

  // Move pipes left
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;

    // Check for collisions
    if (
      bird.x < pipes[i].x + 50 &&
      bird.x + bird.width > pipes[i].x &&
      (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + gap)
    ) {
      gameOver = true;
    }

    // Prevent bird from flying off the top
    if (bird.y < 0) {
      bird.y = 0;
    }

    // Game over if the bird hits the ground
    if (bird.y + bird.height >= canvas.height) {
      gameOver = true;
      bird.y = canvas.height - bird.height; // Stop bird at the ground
    }

    // Check if bird passed a pipe (increase score)
    if (pipes[i].x === bird.x) {
      score++;
    }
  }

  // Remove pipes that are off-screen
  pipes = pipes.filter((pipe) => pipe.x > -50);

  frame++; // Increase frame count
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  drawClouds();
  drawBird();
  drawPipes();

  // draw the score
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P', cursive"; // Apply the Google Font
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

generateClouds();
gameLoop();
