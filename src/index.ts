import { Tetris } from "./components/Tetris/Tetris";
import "./style.css";

document.body.onload = () => {
  const container = document.createElement("div");
  container.classList.add("main-container");

  const size = Math.min(window.innerHeight, window.innerWidth) - 40;

  const game = new Tetris(size);
  container.appendChild(game.canvas);
  game.canvas.hidden = true;

  const start = document.createElement("button");
  start.innerText = "Start";

  start.onclick = () => {
    game.startGame();
    pause.hidden = false;
    start.style.display = "none";
    game.canvas.hidden = false;
  };

  const gameover = document.createElement("div");
  gameover.classList.add("gameover");
  container.appendChild(gameover);
  gameover.hidden = true;

  const score = document.createElement("p");
  gameover.appendChild(score);

  const gameoverText = document.createElement("p");
  gameoverText.innerText = "Game Over!";
  gameover.appendChild(gameoverText);
  const lobbyNavBtn = document.createElement("button");
  lobbyNavBtn.innerText = "Lobby";
  gameover.appendChild(lobbyNavBtn);
  lobbyNavBtn.onclick = () => {
    gameover.hidden = true;
    start.style.display = "flex";
  };

  game.onGameOver(() => {
    game.canvas.hidden = true;
    gameover.hidden = false;
    pause.hidden = true;
    score.innerText = "Score: " + game.score;
  });

  container.appendChild(start);

  document.body.appendChild(container);

  const volIsOnIcon = new Image(50, 50);
  volIsOnIcon.classList.add("volume-icon");
  volIsOnIcon.src = require("./assets/images/volume-up.png").default;

  volIsOnIcon.onclick = () => {
    game.setVolume(0);
    volIsOnIcon.hidden = true;
    volIsOffIcon.hidden = false;
  };
  volIsOnIcon.onload = () => {
    document.body.appendChild(volIsOnIcon);
  };

  const volIsOffIcon = new Image(50, 50);
  volIsOffIcon.classList.add("volume-icon");
  volIsOffIcon.src = require("./assets/images/volume-off.png").default;
  volIsOffIcon.hidden = true;

  volIsOffIcon.onclick = () => {
    game.setVolume(1);
    volIsOffIcon.hidden = true;
    volIsOnIcon.hidden = false;
  };

  volIsOffIcon.onload = () => {
    document.body.appendChild(volIsOffIcon);
  };

  const pausedText = document.createElement("p");
  pausedText.innerText = "Paused";
  pausedText.style.fontSize = size / 8 + "px";
  pausedText.classList.add("paused-text");
  pausedText.hidden = true;
  container.appendChild(pausedText);

  const pause = new Image(50, 50);
  pause.classList.add("pause-icon");
  pause.src = require("./assets/images/pause.png").default;
  pause.hidden = true;
  const pauseGame = () => {
    game.pause();
    pause.hidden = true;
    play.hidden = false;
    pausedText.hidden = false;
  };
  pause.onclick = pauseGame;
  pause.onload = () => {
    document.body.appendChild(pause);
  };

  const play = new Image(50, 50);
  play.classList.add("pause-icon");
  play.src = require("./assets/images/play.png").default;
  play.hidden = true;
  const playGame = () => {
    game.play();
    play.hidden = true;
    pause.hidden = false;
    pausedText.hidden = true;
  };
  play.onclick = playGame;

  play.onload = () => {
    document.body.appendChild(play);
  };

  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );

  window.onblur = () => {
    if (game.hasStarted) pauseGame();
  };
  window.addEventListener("keydown", (e) => {
    if (game.hasStarted && e.key === "Escape") {
      game.isPlaying ? pauseGame() : playGame();
    }
  });
};
