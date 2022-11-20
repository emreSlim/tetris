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
    playpause.hidden = false;
    start.hidden = true;
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
    start.hidden = false;
  };

  game.onGameOver(() => {
    game.canvas.hidden = true;
    gameover.hidden = false;
    playpause.hidden = true;
    score.innerText = "Score: " + game.score;
  });

  container.appendChild(start);

  document.body.appendChild(container);

  const volumeIcon = new Image(50, 50);
  volumeIcon.classList.add("volume-icon");
  volumeIcon.src = require("./assets/images/volume-up.png").default;
  let isVolOn = true;

  volumeIcon.onclick = () => {
    isVolOn = !isVolOn;
    game.setVolume(isVolOn ? 1 : 0);
    volumeIcon.src = require(`./assets/images/volume-${
      isVolOn ? "up" : "off"
    }.png`).default;
  };

  volumeIcon.onload = () => {
    document.body.appendChild(volumeIcon);
  };

  const playpause = new Image(50, 50);
  playpause.classList.add("pause-icon");
  playpause.src = require("./assets/images/pause.png").default;
  playpause.hidden = true;

  playpause.onclick = () => {
    game.isPlaying ? game.pause() : game.play();

    playpause.src = require(`./assets/images/${
      game.isPlaying ? "pause" : "play"
    }.png`).default;
    playpause.title = game.isPlaying ? "pause" : "play";
  };

  playpause.onload = () => {
    document.body.appendChild(playpause);
  };

  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
};
