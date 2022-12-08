// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'F8-PLAYER'

const playlist=$('.playlist');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const player = $('.player');
const progress = $('#progress');

const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  setConfig(key,value) {
    this.config[key] =value;
    localStorage.setItem(PlAYER_STORAGE_KEY,JSON.stringify(this.config));
  },
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Lối Nhỏ",
      singer: "Đen Vâu",
      path: "./assets/music/Loi-Nho-Den-Phuong-Anh-Dao.mp3",
      image: "https://i.scdn.co/image/ab67616d00001e02539ffc79122ccceb066f5340"
    },
    {
      name: "Cho Mình Em",
      singer: "Binz",
      path: "./assets/music/Cho Minh Em - Binz Den (NhacPro.net).mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e02a1ca722c889a36ec84d48649"
    },
    {
      name: "Em Không Thể",
      singer: "Tiên Tiên",
      path:
        "./assets/music/Em Khong The - Tien Tien Touliver (NhacPro.net).mp3",
      image: "https://i.scdn.co/image/ab67616d00001e02f93d9a9e60eb1fcdb82ea00d"
    },
    {
      name: "Cô Gái Bàn Bên",
      singer: "Đen Vâu",
      path: "./assets/music/Co Gai Ban Ben - Den Lynk Lee (NhacPro.net).mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e026bc919bc35e0f9418b75aa59"
    },
    {
      name: "Diễn Viên Tồi",
      singer: "Đen Vâu",
      path: "./assets/music/Dien vien toi feat_ Thanh Bui Cadillac_.mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e0246621d967e558c7d5b960541"
    },
    {
      name: "Muốn Nói Với Em",
      singer: "T Team",
      path: "./assets/music/Muon Noi Voi Em - T Team (NhacPro.net).mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e0288167afef672dc4e1ee5de5d"
    },
    {
      name: "Tự Tình 2",
      singer: "Orinn",
      path: "./assets/music/Tu-Tinh-2-Lofi-Lam-Nguyen-x-Orinn.mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e022cbb60640643ce9fd7371e08"
    },
    {
      name: "Hẹn Ước Từ Hư Vô",
      singer: "Mỹ Tâm",
      path: "./assets/music/Hen Uoc Tu Hu Vo Live_ - My Tam_.mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e02a97c8b7dcb20c796540ffed2"
    },
    {
      name: "Anh Đợi Em Được Không",
      singer: "Orinn",
      path: "./assets/music/Anh-Doi-Em-Duoc-Khong-My-Tam.mp3",
      image:
        "https://i.scdn.co/image/ab67616d00001e0293b350dedac5e4a89ab7f057"
    },
  ],
  render() {
    const htmls = this.songs.map((song,index) => {
      return `
        <div class="song ${index == this.currentIndex ? 'active' :''}" data-index = ${index}>
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
      `
    })
    $('.playlist').innerHTML = htmls.join('');
  },
  defineProperties() {
    Object.defineProperty(this,'currentSong', {
      get: function() {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvent() {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    
    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'},
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause();

    // Xử lý phóng to/thu nhỏ
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop ;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play/pause
    playBtn.onclick = function() {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
    // Khi song được play
    audio.onplay = function() {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    }
    // Khi song bị pause
    audio.onpause = function() {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    }

    // Xử lý khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function() {
      if (audio.duration) {
        const progessPercent = audio.currentTime/audio.duration * 100;
        progress.value = progessPercent;
      }
    }
    // Xử lí khi tua
    progress.onchange = function() {
      const seekTime = progress.value*audio.duration/100;
      audio.currentTime = seekTime;
    }
    // Xử lý khi bấm next
    nextBtn.onclick = function() {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    }
    // Xử lý khi bấm prev
    prevBtn.onclick = function() {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();

    }
    // Xử lý khi bấm random
    randomBtn.onclick = function() {
      if (_this.isRepeat) {
        repeatBtn.classList.remove('active');
        _this.isRepeat=!_this.isRepeat;
      }
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    }
    // Xử lý khi bấm repeat 
    repeatBtn.onclick = function() {
      if (_this.isRandom) {
        randomBtn.classList.remove('active');
        _this.isRandom = !_this.isRandom;
      }
      _this.isRepeat =!_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);

      repeatBtn.classList.toggle('active', _this.isRepeat);
    }
    // Xử lý khi song onended
    audio.onended = function() {
      if (_this.isRandom) {
        _this.playRandomSong();
        audio.play();
      } else if (_this.isRepeat) {
        // audio.currenttime = 0;
        audio.play();
      } else {
        _this.nextSong();
        audio.play();
      }
      _this.render();
      _this.scrollToActiveSong();

    }
    // lắng nghe hành vi click vào playlist
    playlist.onclick = function(e) {
      songNode = e.target.closest('.song:not(.active)');
      if (songNode || e.target.closest('.option')) {
        // Khi click vào song khác (và khác option);
        if (songNode) {
          _this.currentIndex = songNode.dataset.index;
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        } else {

        }
      }
    }

  },
  // Nghĩ cách để cho không bị che chỗ cái đĩa
  scrollToActiveSong() {
    setTimeout(() =>{
      $('.song.active').scrollIntoView({
        behavior:'smooth',
        block: 'nearest',
      })
    },200)
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path;
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex == this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random()*this.songs.length );
    } while (newIndex == this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start() {
    //Gán cấu hình từ config vào App
    this.loadConfig();
    // Định nghĩa các thuộc tính cho obj
    this.defineProperties();

    // Lắng nghe/ xử lý các sự kiện
    this.handleEvent();

    // Tải thông tin bài hát đầu tiên vào UI
    this.loadCurrentSong();

    //Render playlist
    this.render();

    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);

  },
}
app.start();
