//  Buka Undangan  //
const cover    = document.getElementById('cover');
const main     = document.getElementById('main');
const music    = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const openBtn  = document.getElementById('openBtn');

if(openBtn) {
  openBtn.addEventListener('click', function(){
    cover.classList.add('hide');
    document.body.classList.remove('locked');
    main.classList.add('show');
    window.scrollTo(0,0);

    // Autoplay musik //
    if(music){
      music.volume = 0.55;
      const playPromise = music.play();
      if(playPromise !== undefined){
        playPromise.then(()=>{
          if(musicBtn) musicBtn.classList.add('playing');
        }).catch(()=>{
          if(musicBtn) musicBtn.classList.remove('playing');
        });
      }
    }
    setTimeout(initReveal, 300);
  });
}

// Tombol musik //
if(musicBtn && music){
  musicBtn.addEventListener('click', function(){
    if(music.paused){
      music.play();
      musicBtn.classList.add('playing');
    }else{
      music.pause();
      musicBtn.classList.remove('playing');
    }
  });
}

// COUNTDOWN //
const targetDate = new Date('2027-11-28T18:00:00').getTime();

function pad(n){ return n < 10 ? '0' + n : '' + n; }

function updateCountdown(){
  const now  = new Date().getTime();
  const diff = targetDate - now;

  const elD = document.getElementById('cd-d');
  const elH = document.getElementById('cd-h');
  const elM = document.getElementById('cd-m');
  const elS = document.getElementById('cd-s');

  if(!elD || !elH || !elM || !elS) return;

  if(diff <= 0){
    elD.textContent = '00';
    elH.textContent = '00';
    elM.textContent = '00';
    elS.textContent = '00';
    return;
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  elD.textContent = pad(d);
  elH.textContent = pad(h);
  elM.textContent = pad(m);
  elS.textContent = pad(s);
}
updateCountdown();
setInterval(updateCountdown, 1000);

//  Reveal Animasi   //
function initReveal(){
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(function(el){ observer.observe(el); });
}

//  RSVP   // 
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQINtmFv9dtk1HLG3tZq0z0FyWJ3EoBYV-GKNijvTX4lTos0HWEdVeHrN-WHzKWE-I/exec';

const rsvpForm = document.getElementById('rsvpForm');
if(rsvpForm){
  rsvpForm.addEventListener('submit', function(e){
    e.preventDefault();

    const btnSubmit = this.querySelector('button[type="submit"]');
    const originalBtnText = btnSubmit.innerHTML;

    const nama  = document.getElementById('inNama').value.trim();
    const hadir = document.getElementById('inHadir').value;

    if(!nama || !hadir){
      alert('Mohon lengkapi nama dan konfirmasi kehadiran Anda.');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Mengirim...';

    // Kirim data ke Google Sheets
    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ nama: nama, hadir: hadir })
    })
    .then(res => res.json())
    .then(data => {
      alert(`Terima kasih ${nama}, konfirmasi kehadiran Anda telah tersimpan!`);
      rsvpForm.reset();
    })
    .catch(err => {
      alert('Terjadi kesalahan saat menyimpan konfirmasi. Silakan coba lagi.');
      console.error(err);
    })
    .finally(() => {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnText;
    });
  });
}

const navLinks = document.querySelectorAll('.bottom-nav a');
const sections = document.querySelectorAll('section[id]');

// Efek  ikon diklik //
navLinks.forEach(link => {
  link.addEventListener('click', function(){
    navLinks.forEach(nav => nav.classList.remove('active'));
    this.classList.add('active');
  });
});

// animasi scroll halaman //
window.addEventListener('scroll', function(){
  let current = '';
  const scrollPos = window.scrollY + 200;

  sections.forEach(function(sec){
    if(scrollPos >= sec.offsetTop){
      current = sec.getAttribute('id');
    }
  });

  if(current){
    navLinks.forEach(function(link){
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
});