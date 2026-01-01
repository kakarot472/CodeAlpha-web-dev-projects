const songs = [
    {
        id: 1,
        title: 'Family Dekhte Hain Nahi To',
        artist: 'Dragon Ball Z',
        src: 'mp3/family-dekhte-hain-nahi-to.mp3',
        duration: 0
    },
    {
        id: 2,
        title: 'I am a Legendary Super Saiyan',
        artist: 'Dragon Ball Z',
        src: 'mp3/i-am-a-legendary-super-saiyan.mp3',
        duration: 0
    },
    {
        id: 3,
        title: 'Kamehamehaa',
        artist: 'Dragon Ball Z',
        src: 'mp3/kamehamehaa.mp3',
        duration: 0
    },
    {
        id: 4,
        title: 'Vegeta Something Just Snapped',
        artist: 'Dragon Ball Z',
        src: 'mp3/vegeta-something-just-snapped_s9osoEc.mp3',
        duration: 0
    }
];

let currentSongIndex = 0;
let isPlaying = false;
let autoplay = false;

const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeRange = document.getElementById('volumeRange');
const progressRange = document.getElementById('progressRange');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const playlistEl = document.getElementById('playlist');
const autoplayToggle = document.getElementById('autoplayToggle');
const togglePlaylistBtn = document.getElementById('togglePlaylist');
const vinyl = document.getElementById('vinyl');

document.addEventListener('DOMContentLoaded', () => {
    initializePlayer();
    loadPlaylist();
    attachEventListeners();
});

function initializePlayer() {
    loadSong(currentSongIndex);
    
    audio.volume = volumeRange.value / 100;

    loadSongDurations();
}

function loadSongDurations() {
    songs.forEach((song, index) => {
        const tempAudio = new Audio(song.src);
        tempAudio.addEventListener('loadedmetadata', () => {
            songs[index].duration = tempAudio.duration;
        });
    });
}

function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    
    updateActivePlaylistItem(index);
}

function playSong() {
    audio.play();
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    vinyl.classList.add('playing');
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    vinyl.classList.remove('playing');
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function updateProgress() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        progressRange.value = percent;
        
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function setProgress(e) {
    const width = progressRange.offsetWidth;
    const clickX = e.offsetX || (e.touches ? e.touches[0].clientX - progressRange.getBoundingClientRect().left : 0);
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function updateDuration() {
    if (audio.duration) {
        durationEl.textContent = formatTime(audio.duration);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateVolume() {
    audio.volume = volumeRange.value / 100;
}


function loadPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerHTML = `
            <span class="song-number">${index + 1}</span>
            <i class="fas fa-music"></i>
            <span class="song-name">${song.title}</span>
            <span class="song-duration" id="duration-${index}">0:00</span>
        `;
        
        playlistItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(index);
            playSong();
            scrollToActivePlaylistItem();
        });
        
        playlistEl.appendChild(playlistItem);
    });
}


function updateActivePlaylistItem(index) {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}


function scrollToActivePlaylistItem() {
    const activeItem = document.querySelector('.playlist-item.active');
    if (activeItem && playlistEl.classList.contains('show')) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}


function togglePlaylist() {
    playlistEl.classList.toggle('show');
    togglePlaylistBtn.classList.toggle('expanded');
}


function updatePlaylistDurations() {
    songs.forEach((song, index) => {
        const durationEl = document.getElementById(`duration-${index}`);
        if (durationEl) {
            durationEl.textContent = formatTime(song.duration);
        }
    });
}


function attachEventListeners() {
    playBtn.addEventListener('click', togglePlayPause);

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    volumeRange.addEventListener('input', updateVolume);

    progressRange.addEventListener('click', setProgress);
    progressRange.addEventListener('input', (e) => {
        const width = progressRange.offsetWidth;
        const clickX = e.target.valueAsNumber / 100 * width;
        audio.currentTime = (e.target.value / 100) * audio.duration;
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => {
        if (autoplay) {
            nextSong();
        } else {
            pauseSong();
        }
    });

    autoplayToggle.addEventListener('change', (e) => {
        autoplay = e.target.checked;
        localStorage.setItem('autoplay', autoplay);
    });

    togglePlaylistBtn.addEventListener('click', togglePlaylist);
    document.querySelector('.playlist-header').addEventListener('click', togglePlaylist);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        } else if (e.code === 'ArrowRight') {
            nextSong();
        } else if (e.code === 'ArrowLeft') {
            prevSong();
        }
    });

    const savedAutoplay = localStorage.getItem('autoplay') === 'true';
    autoplayToggle.checked = savedAutoplay;
    autoplay = savedAutoplay;

    setInterval(() => {
        if (songs[0].duration > 0) {
            updatePlaylistDurations();
        }
    }, 1000);
}
