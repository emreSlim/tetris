import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import "./style.css";

const game = new GameCanvas(512, 512);

const container = document.createElement("div");
container.classList.add("main-container");

container.appendChild(game.node);

game.startGame();

document.body.appendChild(container);
