export class CustomAudio {
  readonly audio: HTMLAudioElement;
  private isMuted = false;
  constructor(fileName: string) {
    this.audio = new Audio(require("../../assets/sound/" + fileName).default);
  }

  replay(from = 0) {
    if (!this.isMuted) {
      this.audio.currentTime = from;
      this.audio.play();
    }
  }

  mute() {
    this.isMuted = true;
  }
}
