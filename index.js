{
    class AudioPlayer extends HTMLElement {
        playing = false;
        currentTime = 0;
        duration = 0;

        constructor() {
            super();

            this.attachShadow({mode: "open"})
            this.render();
            this.intializeAudio();       
            this.attachEvents();
        }

        intializeAudio() {
            this.audioCtx = new AudioContext();

            this.track = this.audioCtx.createMediaElementSource(this.audio);

            this.track.connect(this.audioCtx.destination);
        }

        async togglePlay() {
            if (this.audioCtx.state === "suspended") {
                await this.audioCtx.resume();
            }

            if (this.playing) {
                await this.audio.pause();
                this.playing = false;
                this.playPauseBtn.textContent = "play";
            }
            else {
                await this.audio.play();
                this.playing = true;
                this.playPauseBtn.textContent = "pause";
            }
        }

        updateAudioTime(time) {
            this.currentTime = time;

            this.progressBar.value = this.currentTime;

            const seconds = `${parseInt(`${time % 60}`, 10)}`.padStart(2, "0");
            const minutes = parseInt(`${(time/60) % 60}`, 10);

            this.currentTimeElem.textContent = `${minutes}:${seconds}`;
        }

        attachEvents() {
            this.playPauseBtn.addEventListener("click", this.togglePlay.bind(this));

            this.audio.addEventListener("loadedmetadata", () => {
                this.duration = this.audio.duration;
                this.progressBar.max = this.duration;

                const seconds = parseInt(`${this.duration % 60}`, 10);
                const minutes = parseInt(`${(this.duration/60) % 60}`, 10);

                this.durationElem.textContent = `${minutes}:${seconds}`;
            })

            this.audio.addEventListener("timeupdate", () => {
                this.updateAudioTime(this.audio.currentTime);
            })
        }

        render() {
            this.shadowRoot.innerHTML = `
            <audio controls src="https://github.com/SirGooseTheNaughty/dyotanya-portfolio/raw/main/media/sophie.mp3" style="display: none"></audio>    
            <button class="play-btn" type="button">play</button>    
            <div class="progress-indicator">
                <span class="current-time">0:00</span>
                <input type="range" max="100" value="0" class="progress-bar"/>
                <span class="duration">0:00</span>
            </div>`  
            ;

            this.audio = this.shadowRoot.querySelector('audio');
            this.playPauseBtn = this.shadowRoot.querySelector('.play-btn');
            this.progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
            this.currentTimeElem = this.progressIndicator.children[0];
            this.progressBar = this.progressIndicator.children[1];
            this.durationElem = this.progressIndicator.children[2];
        }

    }
    customElements.define('audio-player', AudioPlayer);
}