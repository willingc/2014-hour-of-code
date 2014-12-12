// This source code is based on the game example in
// No Starch Press' Javascript for Kids. I highly
// recommend this book. This code is merely a teaching 
// example with minor modifications. All rights belong
// to the book authors and No Starch Press.

//**************
//** Game board
//**************
// Canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

// Tiles
var tileSize = 10;
var widthInTiles = width / tileSize;
var heightInTiles = height / tileSize;

// Border
var drawBorder = function () {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, tileSize);
  ctx.fillRect(0, height - tileSize, width, tileSize);
  ctx.fillRect(0, 0, tileSize, height);
  ctx.fillRect(width - tileSize, 0, tileSize, height);
};


//**************
//** Scoring
//**************
// Start score at zero
var score = 0;

// Puts score on screen
var drawScore = function () {
  ctx.font = "20px Courier";
  ctx.fillStyle = "Black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + score, tileSize, tileSize);
};

// Game over
var gameOver = function () {
  clearInterval(intervalId);
  ctx.font = "60px Courier";
  ctx.fillStyle = "Blue";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Bye!", width / 2, height / 2);
};


//************
//** Tiles
//************
// The Tile constructor
var Tile = function (col, row) {
  this.col = col;
  this.row = row; };

// Draw a square at a tile
Tile.prototype.drawSquare = function (color) { 
  var x = this.col * tileSize;
  var y = this.row * tileSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, tileSize, tileSize);
};

// Draw a circle at a tile
Tile.prototype.drawCircle = function (color) {
  var centerX = this.col * tileSize + tileSize / 2;
  var centerY = this.row * tileSize + tileSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, tileSize / 2, true); };

// Check if tiles are same
Tile.prototype.equal = function (otherTile) {
  return this.col === otherTile.col && this.row === otherTile.row;
};


//************
//** Snake
//************
// Create
var Snake = function () {
  this.segments = [
    new Tile(7, 5),
    new Tile(6, 5),
    new Tile(5, 5)
  ];
  this.direction = "right";
  this.nextDirection = "right";
};

// Draw
Snake.prototype.draw = function () {
  for (var i = 0; i < this.segments.length; i++) {
    this.segments[i].drawSquare("Green");
  }
};

// Move 
Snake.prototype.move = function () {
  var head = this.segments[0];
  var newHead;

  this.direction = this.nextDirection;

  if (this.direction === "right") {
    newHead = new Tile(head.col + 1, head.row);
  } else if (this.direction === "down") {
    newHead = new Tile(head.col, head.row + 1);
  } else if (this.direction === "left") {
    newHead = new Tile(head.col - 1, head.row);
  } else if (this.direction === "up") {
    newHead = new Tile(head.col, head.row - 1);
  }

  if (this.checkCollision(newHead)) {
    gameOver();
    return;
  }

  this.segments.unshift(newHead);

  if (newHead.equal(apple.position)) {
    score++;
    apple.move();
  } else {
    this.segments.pop();
  }
};

// Check Collision
Snake.prototype.checkCollision = function (head) {
  var leftCollision = (head.col === 0);
  var topCollision = (head.row === 0);
  var rightCollision = (head.col === widthInTiles - 1);
  var bottomCollision = (head.row === heightInTiles - 1);

  var wallCollision = leftCollision || topCollision || 
    rightCollision || bottomCollision;

  var selfCollision = false;

  for (var i = 0; i < this.segments.length; i++) {
    if (head.equal(this.segments[i])) {
      selfCollision = true;
    }
  }

  return wallCollision || selfCollision;
};

// Set direction
Snake.prototype.setDirection = function (newDirection) {
  if (this.direction === "up" && newDirection === "down") {
    return;
  } else if (this.direction === "right" && newDirection === "left") {
    return;
  } else if (this.direction === "down" && newDirection === "up") {
    return;
  } else if (this.direction === "left" && newDirection === "right") {
    return;
  }

  this.nextDirection = newDirection;
};


//************
//** Apple
//************
// Create
var Apple = function () {
  this.position = new Tile(10, 10);
};

// Draw
Apple.prototype.draw = function () {
  this.position.drawCircle("Red");
};

// Move
Apple.prototype.move = function () {
  var randomCol = Math.floor(Math.random() * (widthInTiles - 2)) + 1;
  var randomRow = Math.floor(Math.random() * (heightInTiles - 2)) + 1;
  this.position = new Tile(randomCol, randomRow);
};


//******************
//* Utilities
//******************
var circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// Convert keycodes to directions
var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
};


//***********************
//* Playing the game
//***********************
// Create snake and apple
var snake = new Snake();
var apple = new Apple();

// Pass an animation function to setInterval
var intervalId = setInterval(function () {
  ctx.clearRect(0, 0, width, height);
  drawScore();
  snake.move();
  snake.draw();
  apple.draw();
  drawBorder();
}, 100);

// The keydown handler for handling direction key presses
$("body").keydown(function (event) {
  var newDirection = directions[event.keyCode];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
});
