
// GSAP & Confetti Defaults
const confettiDefaults = { origin: { y: 0.7 } };

// DOM Elements
const sections = {
    opening: document.getElementById('page-opening'),
    gallery: document.getElementById('page-gallery'),
    surprises: document.getElementById('page-surprises'),
    letter: document.getElementById('page-letter'),
    final: document.getElementById('page-final')
};

const btns = {
    begin: document.getElementById('btn-begin'),
    toReasons: document.getElementById('btn-to-reasons'),
    toSurprises: document.getElementById('btn-to-surprises'),
    toLetter: document.getElementById('btn-to-letter'),
    toFinal: document.getElementById('btn-to-final'),
    replay: document.getElementById('btn-replay'),
    floatingHearts: document.getElementById('btn-floating-hearts'),
    unlockBox: document.getElementById('btn-unlock-box'),
    openLetter: document.querySelector('.btn-open-letter'),
    btnCats: document.getElementById('btn-cats'),
    musicToggle: document.getElementById('btn-music-toggle'),
    music: document.getElementById('bg-music')
};

// --- Navigation Logic ---
function switchPage(hideId, showId) {
    const hideEl = document.getElementById(hideId);
    const showEl = document.getElementById(showId);

    gsap.to(hideEl, {
        opacity: 0, y: -20, duration: 0.5, onComplete: () => {
            hideEl.classList.remove('active-page');
            hideEl.classList.add('hidden-page');

            showEl.classList.remove('hidden-page');
            showEl.classList.add('active-page');
            gsap.fromTo(showEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });
        }
    });
}

// 1. Opening Page
btns.begin.addEventListener('click', () => {
    confetti({ ...confettiDefaults, particleCount: 100, spread: 70, origin: { y: 0.6 } });
    switchPage('page-opening', 'page-gallery');

    // Animate Gallery Items Staggered
    setTimeout(() => {
        gsap.from(".gallery-item", {
            duration: 0.8,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    }, 500);
    // Attempt to play music on first interaction
    playMusic();
});

// Carousel Logic
const carousel = document.querySelector('.card-stack');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let cards = Array.from(document.querySelectorAll('.love-card'));

let activeIndex = 0;

function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'hidden-card');
        if (index === activeIndex) {
            card.classList.add('active');
        } else if (index < activeIndex) {
            card.classList.add('prev');
        } else {
            card.classList.add('hidden-card');
        }
    });
}

nextBtn.addEventListener('click', () => {
    if (activeIndex < cards.length - 1) {
        activeIndex++;
        updateCarousel();
    }
});

prevBtn.addEventListener('click', () => {
    if (activeIndex > 0) {
        activeIndex--;
        updateCarousel();
    }
});

// Music Control Interactions
let isPlaying = false;

function playMusic() {
    btns.music.volume = 0.5;
    btns.music.play().then(() => {
        isPlaying = true;
        btns.musicToggle.parentElement.classList.remove('hidden');
        btns.musicToggle.innerHTML = "🎵"; // Playing icon
    }).catch(error => {
        console.log("Auto-play prevented by browser. User must click play.");
        btns.musicToggle.parentElement.classList.remove('hidden');
        btns.musicToggle.innerHTML = "🔇"; // Muted icon if potential failure
    });
}

btns.musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        btns.music.pause();
        btns.musicToggle.innerHTML = "🔇"; // Muted/Paused
    } else {
        btns.music.play();
        btns.musicToggle.innerHTML = "🎵"; // Playing
    }
    isPlaying = !isPlaying;
});



// 2. Gallery -> Reasons
btns.toReasons.addEventListener('click', () => {
    switchPage('page-gallery', 'page-reasons');
    updateCarousel();
});

// 3. Reasons -> Surprises
btns.toSurprises.addEventListener('click', () => {
    switchPage('page-reasons', 'page-surprises');
});

// 3. Surprises Interaction
// Surprise 1: Floating Hearts
btns.floatingHearts.addEventListener('click', () => {
    const msg = document.getElementById('msg-hearts');
    msg.classList.add('visible');

    // Fire heart shape confetti
    const heartDefaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        shapes: ['heart'],
        colors: ['#FFC0CB', '#FF69B4', '#FF1493', '#C71585']
    };

    confetti({ ...heartDefaults, particleCount: 40, scalar: 1.2, origin: { x: 0.5, y: 0.5 } });
    confetti({ ...heartDefaults, particleCount: 10, scalar: 0.75, origin: { x: 0.5, y: 0.5 } });
});

// Surprise 2: Unlock Box
btns.unlockBox.addEventListener('click', () => {
    btns.unlockBox.style.display = 'none';
    const content = document.getElementById('box-memories');
    content.classList.remove('hidden');
    gsap.from("#box-memories p", { opacity: 0, x: -20, stagger: 0.3, duration: 0.5 });

    // Sparkles
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ['#ffd700'] });
});

// Surprise 3: Hidden Star
const starTrigger = document.getElementById('star-trigger');
const starMsg = document.getElementById('msg-star');

starTrigger.addEventListener('mouseenter', revealStar);
starTrigger.addEventListener('click', revealStar);

function revealStar() {
    starTrigger.classList.add('revealed');
    starMsg.classList.remove('hidden');
    gsap.to(starTrigger, { rotation: 360, duration: 1 });
}

// Surprise 4: Cute Cats
btns.btnCats.addEventListener('click', () => {
    const catContainer = document.getElementById('cat-container');
    if (catContainer.style.display === "none") {
        catContainer.style.display = "block";
        gsap.from(catContainer, { opacity: 0, y: 10, duration: 0.5 });
        btns.btnCats.innerText = "One more? 🐱";
    } else {
        // Simple logic to just show the same one or toggle (User can expand this)
        gsap.to(catContainer, { scale: 1.1, yoyo: true, repeat: 1, duration: 0.2 });
    }
});


// 4. Surprises -> Letter
btns.toLetter.addEventListener('click', () => {
    switchPage('page-surprises', 'page-letter');
});

// Open Letter
btns.openLetter.addEventListener('click', () => {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    btns.openLetter.style.display = 'none';

    setTimeout(() => {
        document.getElementById('btn-to-final').classList.remove('hidden');
    }, 2000);
});

// 5. Letter -> Final
btns.toFinal.addEventListener('click', () => {
    switchPage('page-letter', 'page-final');
    startFireworks();
});

// Final Page Fireworks
function startFireworks() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

btns.replay.addEventListener('click', () => {
    location.reload();
});

// --- Background Floating Hearts ---
function createBgHearts() {
    const container = document.getElementById('bg-hearts');
    const heartSymbols = ['❤️', '💖', '💕', '🌸', '✨'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 5 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        container.appendChild(heart);
    }
}

// Init
createBgHearts();
