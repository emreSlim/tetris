import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import { Tetris } from "./components/Tetris/Tetris";
import "./style.css";

const canvas = new GameCanvas(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas.node);
