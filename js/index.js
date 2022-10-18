const player = document.querySelector(".player"),
      title = document.querySelector(".title"),
      playBtn = document.querySelector(".play"),
      nextBtn = document.querySelector(".next"),
      prevBtn = document.querySelector(".prev"),
      audio = document.querySelector(".audio"),
      progressContainer = document.querySelector(".progress__container"),
      progress = document.querySelector(".progress"),
      cover = document.querySelector(".cover__image"),
      imgSrc = document.querySelector(".img__src");


    
const songs = ["Let it go", "Its raining men", "Call me maybe"];

let songIndex = 0;
let isPlaying = false;

function initPlayer() {
    loadSong(songIndex);
}

function loadSong(songIndex) {
    title.textContent = songs[songIndex];
    audio.src = `audio/${songs[songIndex]}.mp3`;
    cover.src = `img/${songs[songIndex]}.svg`;

}

function playPauseSong() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        imgSrc.src = "img/play.svg";
        cover.classList.remove("active");
    } 
    else {
        audio.play();
        isPlaying = true;
        imgSrc.src = "img/pause.svg";
        cover.classList.add("active");
    }
    
}

function forcePlaySong() {
    audio.play();
    isPlaying = true;
    imgSrc.src = "img/pause.svg";
    cover.classList.add("active");
}

function changeSong(newIndex) {
    if (newIndex === songs.length || newIndex === -1) return;
    songIndex = newIndex;
    loadSong(songIndex);
    forcePlaySong();
}

function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPersentage = (currentTime / duration) * 100;
    progress.style.width = `${progressPersentage}%`;
}

function setProggress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const progressPersentage = (clickX / width) * 100;
    const duration = audio.duration;

    audio.currentTime = progressPersentage / 100 * duration;
    progress.style.width = `${progressPersentage}%`;
    
}

initPlayer();

playBtn.addEventListener("click", playPauseSong);
nextBtn.addEventListener("click", () => {
    changeSong(songIndex + 1);
});
prevBtn.addEventListener("click", () => {
    changeSong(songIndex - 1);
});
audio.addEventListener("timeupdate", updateProgress)
progressContainer.addEventListener("click", setProggress)
audio.addEventListener("ended", () => {
    if (songs.length === songIndex + 1) {
        cover.classList.remove("active");
    }
    changeSong(songIndex + 1);
})