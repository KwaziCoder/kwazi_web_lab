{
    class AudioPlayer extends HTMLElement {
        playing = false;
        currentTime = 0;
        duration = 0;
        volume = 0.4;

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
            this.gainNode = this.audioCtx.createGain();

            this.track
            .connect(this.gainNode)
            .connect(this.audioCtx.destination);        
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

        changeVolume() {
            this.volume = this.volumeBar.value;
            this.gainNode.gain.value = this.volume;
        }

        moveTo(value) {
            this.audio.currentTime = value;
        }

        attachEvents() {
            this.playPauseBtn.addEventListener("click", this.togglePlay.bind(this));

            this.volumeBar.addEventListener("input", this.changeVolume.bind(this))
            
            this.progressBar.addEventListener("input", () => {
                this.moveTo(this.progressBar.value);
            })
            

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

            this.audio.addEventListener("ended", () => {
                this.playing = false;
                this.playPauseBtn.textContent = "play";
            })
        }

        render() {
            this.shadowRoot.innerHTML = `
            <audio controls src="./audio.ogg" style="display: none"></audio>    
            <button class="play-btn" type="button">play</button>    
            <div class="progress-indicator">
                <span class="current-time">0:00</span>
                <input type="range" max="100" value="0" class="progress-bar"/>
                <span class="duration">0:00</span>
            </div>
            <div class="volume-bar">
                <input type="range" min="0" max="2" step="0.01" value="${this.volume}" class="volume-field"/>
            </div>
            `;

            this.audio = this.shadowRoot.querySelector('audio');
            this.playPauseBtn = this.shadowRoot.querySelector('.play-btn');
            this.volumeBar = this.shadowRoot.querySelector('.volume-field');
            this.progressIndicator = this.shadowRoot.querySelector('.progress-indicator');
            this.currentTimeElem = this.progressIndicator.children[0];
            this.progressBar = this.progressIndicator.children[1];
            this.durationElem = this.progressIndicator.children[2];
        }

    }
    customElements.define('audio-player', AudioPlayer);
}