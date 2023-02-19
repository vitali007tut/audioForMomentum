const audio = document.querySelector('.audio')
const player = document.querySelector('.player')
const playBtn = document.querySelector('.playBtn')
const prevBtn = document.querySelector('.prevBtn')
const nextBtn = document.querySelector('.nextBtn')
const muteBtn = document.querySelector('.muteBtn')
const progressContaner = document.querySelector('.progress_contaner')
const progress = document.querySelector('.progress')
const title = document.querySelector('.song')
let isPlaying
const songs = ['A Sense Of Symmetry', 'Elegy For The Arctic', 'High Heels', 'Le Onde', 'The Earth Prelude', 'Walk']
// set custom playList
songs.forEach(el => {
    const li = document.createElement('li')
    li.classList.add('play-item')
    li.textContent = el
    document.querySelector('.custom-playList').append(li)
})
const playBtnsPlaylist = document.querySelectorAll('.play-item')

let songIndex = 0

function loadSong(song) {
    title.innerHTML = song
    audio.src = `./Songs/${song}.mp3`
}
loadSong(songs[songIndex])

function playSong() {
    player.classList.add('play')
    playBtn.classList.add('pause')
    playBtnsPlaylist[songIndex].classList.add('item-active')
    audio.play()
}

function pauseSong() {
    player.classList.remove('play')
    playBtn.classList.remove('pause')
    playBtnsPlaylist.forEach(e => e.classList.remove('item-active'))
    audio.pause()
}

playBtn.addEventListener('click', () => {
    isPlaying = player.classList.contains('play')
    if (isPlaying) {
        pauseSong()
    } else {
        playSong()
    }
})

function nextSong() {
    playBtnsPlaylist.forEach(e => e.classList.remove('item-active'))
    songIndex++
    if (songIndex === songs.length) songIndex = 0
    loadSong(songs[songIndex])
    playSong()
}
nextBtn.addEventListener('click', nextSong)

function prevSong() {
    playBtnsPlaylist.forEach(e => e.classList.remove('item-active'))
    songIndex--
    if (songIndex < 0) songIndex = songs.length - 1
    loadSong(songs[songIndex])
    playSong()
}
prevBtn.addEventListener('click', prevSong)

// Progress bar
function updateProgress(e) {
    //const {duration , currentTime} = e.srcElement
    const duration = audio.duration
    const currentTime = audio.currentTime
    const progressPercent = (currentTime / duration) * 100
    progress.style.width = `${progressPercent}%`
}

audio.addEventListener('timeupdate', updateProgress)

// Set progress
function setProgress(e) {
    const width = this.clientWidth
    const clickX = e.offsetX
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration
}
progressContaner.addEventListener('click', setProgress)

// Autoplay
audio.addEventListener('ended', nextSong)

// Регулируем громкость
var soundVolume = document.querySelector(".soundVolume");
soundVolume.addEventListener('input', function () {
    audio.volume = soundVolume.value
})

// Включаем/выключаем звук кнопкой Mute
let muted = false
function muter() {
    if (!muted) {
        currentVolume = audio.volume
        audio.volume = 0
        muted = true
    } else {
        audio.volume = currentVolume
        muted = false
    }
}
muteBtn.addEventListener('click', muter)

// таймер трека
const timer = document.querySelector('.timer')
const duration = document.querySelector('.duration')

function formatTime(secs) {
    let minutes = Math.floor(secs / 60) || 0;
    let seconds = (secs - minutes * 60) || 0;
    seconds = seconds.toFixed()
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function setTimer() {
    timer.innerHTML = formatTime(audio.currentTime)
    duration.innerText = formatTime(audio.duration)
}
audio.addEventListener('timeupdate', setTimer)

const pauseTimeObject = {}

playBtnsPlaylist.forEach(e => {
    e.addEventListener('click', () => {
        let pauseTime = audio.currentTime

        loadSong(e.innerHTML)
        songIndex = songs.indexOf(e.innerHTML)

        isPlaying = player.classList.contains('play')
        isPlayItemFromPlaylist = e.classList.contains('item-active')
        if (isPlaying && isPlayItemFromPlaylist) {

            playBtnsPlaylist.forEach(e => e.classList.remove('item-active'))
            pauseTimeObject[e.innerHTML] = pauseTime
            pauseSong()

        } else {
            playBtnsPlaylist.forEach(e => e.classList.remove('item-active'))
            if (pauseTimeObject[e.innerHTML]) audio.currentTime = pauseTimeObject[e.innerHTML]
            e.classList.add('item-active')
            playSong()
        }
    })
})