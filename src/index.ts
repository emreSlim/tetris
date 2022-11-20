import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import "./style.css";

document.body.onload = () => {
  const container = document.createElement("div");
  container.classList.add("main-container");

  const size = Math.min(window.innerHeight, window.innerWidth) - 40;

  const game = new GameCanvas(size, size);
  container.appendChild(game.node);
  game.node.hidden = true;

  const start = document.createElement("button");
  start.innerText = "Start";

  start.onclick = () => {
    game.startGame();
    start.hidden = true;
    game.node.hidden = false;
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

  game.onGameOver = (s) => {
    game.node.hidden = true;
    gameover.hidden = false;
    score.innerText = "Score: " + s;
  };

  container.appendChild(start);

  document.body.appendChild(container);

  const volumeIcon = new Image(50, 50);
  volumeIcon.classList.add("volume-icon");
  volumeIcon.src = require("./assets/images/volume-up.png").default;
  let is = true;

  volumeIcon.onclick = () => {
    is = !is;

    game.setVolume(is ? 1 : 0);

    volumeIcon.src = require(`./assets/images/volume-${
      is ? "up" : "off"
    }.png`).default;
  };

  volumeIcon.onload = () => {
    document.body.appendChild(volumeIcon);
  };

  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
};
