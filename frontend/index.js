const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const socket = io('https://sleepy-island-33889.herokuapp.com/');

socket.on('init', handleInit);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('gameCode', handleGameCode);
socket.on('unknownCode', handleUnknownCode);
socket.on('tooManyPlayers', handleTooManyPlayers);

const gameScreen = document.getElementById('gameScreen');
const initialScreen = document.getElementById('initialScreen');
const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);


function newGame() {
  socket.emit('newGame');
  init();
}

function joinGame() {
  const code = gameCodeInput.value;
  socket.emit('joinGame', code);
  init();
}

let canvas, ctx;
let playerNumber;
let gameActive = false;

function init() {
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);
  gameActive = true;
}

var keyPress = [];

function keydown(e) {

  keyPress.push(e.key);
  if (keyPress.length == 3) {
    keyPress.shift();
  }
  if (keyPress.length > 1) {
    switch (keyPress[0]) {
      case "ArrowLeft":
        if (keyPress[1] == "ArrowRight") {
          console.log("cant go right");
        } else {
          socket.emit('keydown', e.keyCode);
        }
        break;
      case "ArrowRight":
        if (keyPress[1] == "ArrowLeft") {
          console.log("cant go left");
        } else {
          socket.emit('keydown', e.keyCode);
        }
        break;
      case "ArrowDown":
        if (keyPress[1] == "ArrowUp") {
          console.log("cant go up");
        } else {
          socket.emit('keydown', e.keyCode);
        }
        break;
      case "ArrowUp":
        if (keyPress[1] == "ArrowDown") {
          console.log("cant go down");
        } else {
          socket.emit('keydown', e.keyCode);
        }
        break;
      default:
        socket.emit('keydown', e.keyCode);
        break;

    }
  }
  console.log(keyPress);
  //socket.emit('keydown', e.keyCode);
}

function paintGame(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  paintPlayer(state.players[0], size, SNAKE_COLOUR);
  paintPlayer(state.players[1], size, 'red');
}

function paintPlayer(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function handleInit(number) {
  playerNumber = number;
}

function handleGameState(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => paintGame(gameState));
}

function handleGameOver(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === playerNumber) {
    alert('You Win!');
  } else {
    alert('You Lose :(');
  }
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode;
}

function handleUnknownCode() {
  reset();
  alert('Unknown Game Code')
}

function handleTooManyPlayers() {
  reset();
  alert('This game is already in progress');
}

function reset() {
  playerNumber = null;
  gameCodeInput.value = '';
  initialScreen.style.display = "block";
  gameScreen.style.display = "none";
}
