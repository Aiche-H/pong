const CANVAS = document.getElementById('canvasOne');
const CTX = CANVAS.getContext('2d');
const START_BUTTON = document.getElementById("startButton");
const MAX_CANVAS_WIDTH = 800; // maximum canvas width
const MAX_CANVAS_HEIGHT = 600; // maximum canvas height

if (!CTX) {
  console.error('Failed to get 2D drawing context');
}

let canvasWidth = Math.min(
  window.visualViewport.width * 0.65,
  MAX_CANVAS_WIDTH
);
let canvasHeight = Math.min(
  window.visualViewport.height * 0.85,
  MAX_CANVAS_HEIGHT
);

let isGameRunning = false;

CANVAS.width = canvasWidth;
CANVAS.height = canvasHeight;

START_BUTTON.addEventListener("click", () => {
  if (!isGameRunning) {
    isGameRunning = true;
    START_BUTTON.style.display = "none"; // hide the start button
    PLAYER_ONE.score = 0;
    PLAYER_TWO.score = 0;

    resetBall();
    gameLoop(); // start the game loop
  }
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    // Enter key
    if (!isGameRunning) {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => {
        button.remove();
      });
      START_BUTTON.click(); // simulate a click on the start button
    }
  }
});

const PLAYER_ONE = {
  x: 10,
  y: CANVAS.height / 2 - 50,
  width: 10,
  height: 100,
  drawHeight: 95,
  speed: 4,
};

const PLAYER_TWO = {
  x: CANVAS.width - 20,
  y: CANVAS.height / 2 - 50,
  width: 10,
  height: 100,
  drawHeight: 95,
  speed: 4,
};

const BALL = {
  x: CANVAS.width / 2,
  y: CANVAS.height / 2,
  radius: 10,
  speedX:2.5,
  speedY:1.3,
};

// Define the score properties for each player
PLAYER_ONE.score = 0;
PLAYER_TWO.score = 0;

function drawCenterLine() {
  CTX.beginPath();
  CTX.strokeStyle = "white";
  CTX.lineWidth = 2;
  CTX.setLineDash([10, 10]); // dash length, gap length
  CTX.moveTo(CANVAS.width / 2, 0);
  CTX.lineTo(CANVAS.width / 2, CANVAS.height);
  CTX.stroke();
  CTX.setLineDash([]); // reset line dash
}

// Define the resetBall function
function resetBall() {
  BALL.x = CANVAS.width / 2;
  BALL.y = CANVAS.height / 2;
  BALL.speedX = 2.5;
  BALL.speedY = 1.3;
}

function drawScores() {
  CTX.font = "24px Arial";
  CTX.fillStyle = "white";
  CTX.textAlign = "left";
  CTX.textBaseline = "top";
  CTX.fillText(`Player 1: ${PLAYER_ONE.score}`, 10, 10);
  CTX.textAlign = "right";
  CTX.fillText(`Player 2: ${PLAYER_TWO.score}`, CANVAS.width - 10, 10);
}

function drawPlayers() {
  CTX.fillStyle = 'white';
  CTX.fillRect(
    PLAYER_ONE.x,
    PLAYER_ONE.y + (PLAYER_ONE.height - PLAYER_ONE.drawHeight) / 2,
    PLAYER_ONE.width,
    PLAYER_ONE.drawHeight
  );
  CTX.fillRect(
    PLAYER_TWO.x,
    PLAYER_TWO.y + (PLAYER_TWO.height - PLAYER_TWO.drawHeight) / 2,
    PLAYER_TWO.width,
    PLAYER_TWO.drawHeight
  );
  CTX.beginPath();
  CTX.arc(BALL.x, BALL.y, BALL.radius, 0, Math.PI * 2);
  CTX.fillStyle = "white";
  CTX.fill();
}

function updatePlayers() {
  // Move player 1 up
  if (keysPressed[87]) {
    PLAYER_ONE.y -= PLAYER_ONE.speed;
  }
  // Move player 1 down
  if (keysPressed[83]) {
    PLAYER_ONE.y += PLAYER_ONE.speed;
  }
  // Move player 2 up
  if (keysPressed[38]) {
    PLAYER_TWO.y -= PLAYER_TWO.speed;
  }
  // Move player 2 down
  if (keysPressed[40]) {
    PLAYER_TWO.y += PLAYER_TWO.speed;
  }

  // Prevent players from moving off the screen
  if (PLAYER_ONE.y < 0) {
    PLAYER_ONE.y = 0;
  } else if (PLAYER_ONE.y > CANVAS.height - PLAYER_ONE.height) {
    PLAYER_ONE.y = CANVAS.height - PLAYER_ONE.height;
  }
  if (PLAYER_TWO.y < 0) {
    PLAYER_TWO.y = 0;
  } else if (PLAYER_TWO.y > CANVAS.height - PLAYER_TWO.height) {
    PLAYER_TWO.y = CANVAS.height - PLAYER_TWO.height;
  }

  // Update the ball's position
  BALL.x += BALL.speedX;
  BALL.y += BALL.speedY;

  // Check if the ball hits the top or bottom of the canvas
  if (BALL.y + BALL.radius > CANVAS.height || BALL.y - BALL.radius < 0) {
    BALL.speedY *= -1;
  }

  // Check if the ball passes player
  if (BALL.x - BALL.radius < PLAYER_ONE.x) {
    // Player 1 scores
    PLAYER_ONE.score++;
    BALL.speedX = 2.5;
    BALL.speedY = 1.3;
    resetBall();
    isGameRunning = true;
  } else if (BALL.x + BALL.radius > PLAYER_TWO.x + PLAYER_TWO.width) {
    // Player 2 scores
    PLAYER_TWO.score++;
    BALL.speedX = 2.5;
    BALL.speedY = 1.3;
    resetBall();
    isGameRunning = true;
  }

  // Check if the ball hits the players
  if (
    BALL.x - BALL.radius < PLAYER_ONE.x + PLAYER_ONE.width &&
    BALL.x + BALL.radius > PLAYER_ONE.x &&
    BALL.y + BALL.radius > PLAYER_ONE.y &&
    BALL.y - BALL.radius < PLAYER_ONE.y + PLAYER_ONE.height
  ) {
    BALL.speedX *= -1; // collision with player one's paddle
    BALL.speedX += 0.01 * Math.sign(BALL.speedX); // add 0.01 to x speed
    BALL.speedY += 0.01; // add 0.01 to y speed
  }

  if (
    BALL.x - BALL.radius < PLAYER_TWO.x + PLAYER_TWO.width &&
    BALL.x + BALL.radius > PLAYER_TWO.x &&
    BALL.y + BALL.radius > PLAYER_TWO.y &&
    BALL.y - BALL.radius < PLAYER_TWO.y + PLAYER_TWO.height
  ) {
    BALL.speedX *= -1; // collision with player two's paddle
    BALL.speedX += 0.01 * Math.sign(BALL.speedX); // add 0.01 to x speed
    BALL.speedY += 0.01; // add 0.01 to y speed
  }
}

const keysPressed = {};

document.addEventListener("keydown", (e) => {
  keysPressed[e.keyCode] = true;
});
document.addEventListener("keyup", (e) => {
  keysPressed[e.keyCode] = false;
});
document.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    // Esc key
    if (isGameRunning) {
      isGameRunning = false;
      CTX.fillStyle = "white";
      CTX.font = "24px Arial";
      CTX.textAlign = "center";
      CTX.fillText(
      "Paused Game",
      CANVAS.width / 2,
      CANVAS.height / 2
      );
    } else {
      isGameRunning = true;
      gameLoop(); // restart the game loop
    }
  }
});

function gameWin() {
  if (PLAYER_ONE.score == 10 || PLAYER_TWO.score == 10) {
    isGameRunning = false;
    const RESTART_BUTTON = document.createElement("button");
    RESTART_BUTTON.textContent = "Restart Game";
    RESTART_BUTTON.addEventListener("click", () => {
     PLAYER_ONE.score = 0;
     PLAYER_TWO.score = 0;
     isGameRunning = true;
     RESTART_BUTTON.remove(); // remove the button from the screen
     gameLoop();// start the game loop
     resetBall(); 
   });
    CANVAS.parentNode.appendChild(RESTART_BUTTON); // add the button to the screen
    CTX.fillStyle = "white";
    CTX.font = "24px Arial";
    CTX.textAlign = "center";
    CTX.fillText("Game Over! Click the button to restart.", CANVAS.width / 2, CANVAS.height / 2);
  }
}

function gameLoop() {
  if (!isGameRunning) return;
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  drawPlayers();
  drawScores();
  updatePlayers();
  requestAnimationFrame(gameLoop);
  drawCenterLine();
  gameWin()
}

gameLoop();