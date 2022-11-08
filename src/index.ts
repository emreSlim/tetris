import { GameCanvas } from "./components/GameCanvas/GameCanvas";
import "./style.css";

const canvas = new GameCanvas(window.innerWidth, window.innerHeight);

document.body.appendChild(canvas.node);
