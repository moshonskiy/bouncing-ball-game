const canv = document.getElementById("canvas");
const ctx = canv.getContext("2d");

canv.width = 1200;
canv.height = 800;

// game variables
const obstacleMinHeight = 50;
const obstacleMaxHeight = 120;
const obstacleMinWidth = 30;
const obstacleMaxWidth = 50;
const minGapBetweenObstacles = 200;
const maxGapBetweenObstacles = 500;
const yBottomOffset = 85;
let frame = 0;
let gap = randomGap();
let score = 0;

const obstacles = [];

const player = {
  x: canv.width / 2,
  y: canv.height - yBottomOffset,
  yv: 0,
  update: function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();
  },
  newYPosition: function () {
    if (this.y < canv.height - 350) {
      this.yv = 4;
    }
    this.y += this.yv;

    if (this.yv === 4 && this.y === canv.height - yBottomOffset) {
      this.yv = 0;
    }
  },
  crash: function (obstacle) {
    if (
      this.x + 15 > obstacle.x &&
      this.x < obstacle.x + obstacle.width &&
      this.y + 15 > obstacle.y
    ) {
      return true;
    }
    return false;
  },
};

// generate rectance
function generateNewObstacle(n) {
  if (frame % n === 0) {
    return true;
  } else {
    return false;
  }
}

// generate random gap between obstacles
function randomGap() {
  return Math.floor(
    minGapBetweenObstacles +
      Math.random() * (maxGapBetweenObstacles - minGapBetweenObstacles + 1)
  );
}

// changing player's y velocity to jump
function playerJump() {
  player.yv = -4;
}

// clear canvas
function clear() {
  ctx.clearRect(0, 0, canv.width, canv.height);
}

// stop game
function stopTheGame(gameId, alertText) {
  cancelAnimationFrame(gameId);
  alert(alertText);
  document.location.reload(true);
}

// show score
function scoreText(text, x, y) {
  ctx.font = "30px Calibri";
  ctx.fillText(text, x, y);
}

// Obstacle constructor
function Obstacle() {
  this.width = Math.floor(
    obstacleMinWidth + Math.random() * (obstacleMaxWidth - obstacleMinWidth + 1)
  );
  this.height = Math.floor(
    obstacleMinHeight +
      Math.random() * (obstacleMaxHeight - obstacleMinHeight + 1)
  );
  this.x = 1200;
  this.y = canv.height - this.height - yBottomOffset + 15;
  this.draw = function () {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.crossYLine = false;
}

// moving obstacles on the Y axis
function moveObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 2;
    obstacles[i].draw();
    if (obstacles[i].x + obstacles[i].width < canv.width / 2) {
      obstacles[i].noHitCross = true;
    }
  }
}

// update
function update() {
  ctx.fillStyle = "#960018";
  let game = requestAnimationFrame(update);

  if (score === 5) {
    stopTheGame(game, "Cogrants! :)))");
  }

  for (let i = 0; i < obstacles.length; i++) {
    if (player.crash(obstacles[i])) {
      stopTheGame(game, "Game over! :((");
    }
  }

  clear();

  if (generateNewObstacle(gap) && gap >= minGapBetweenObstacles) {
    obstacles.push(new Obstacle());
    gap = randomGap();
    frame = 0;
  }

  scoreText(`Score: ${score}`, 100, 100);
  scoreText("Press any key to bounce", 100, 150);
  scoreText("If you score 5, you win!", 100, 200);

  player.newYPosition();
  player.update();

  window.addEventListener("keydown", playerJump);

  // calculate the score
  score = obstacles.filter((obs) => obs.noHitCross === true).length;

  moveObstacles();
  frame++;
}

update();
