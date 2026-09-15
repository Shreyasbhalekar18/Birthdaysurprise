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

// Buttons & controls (fixed — no stray colons)
const btns = {
    begin: document.getElementById('btn-begin'),          // update id if your HTML uses a different one
    toReasons: document.getElementById('btn-to-reasons'),
    toSurprises: document.getElementById('btn-to-surprises'),
    toTimeline: document.getElementById('btn-to-timeline'),
    toPromises: document.getElementById('btn-to-promises'),
    toLetter: document.getElementById('btn-to-letter'),
    toFinal: document.getElementById('btn-to-final'),
    replay: document.getElementById('btn-replay'),
    floatingHearts: document.getElementById('btn-floating-hearts'),
    unlockBox: document.getElementById('btn-unlock-box'),
    openLetter: document.querySelector('.btn-open-letter'),
    letterOverlay: document.getElementById('letter-overlay'),
    closeLetter: document.getElementById('close-letter'),
    btnCats: document.getElementById('btn-cats'),
    musicToggle: document.getElementById('btn-music-toggle'),
    music: document.getElementById('bg-music'),
    typingText: document.getElementById('typing-text')
};

// Safe addEventListener helper — avoids errors when elements are missing
function safeAdd(el, event, handler) {
    if (!el) return;
    el.addEventListener(event, handler);
}
// Optional: ensure DOM is ready before using elements (safe)
document.addEventListener('DOMContentLoaded', () => {
    // If your script currently runs code immediately that uses `btns` or `sections`,
    // you can move that initialization into this function (or ensure <script> is after HTML).
});


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
safeAdd(btns.begin, 'click', () => {
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

safeAdd(nextBtn, 'click', () => {
    if (activeIndex < cards.length - 1) {
        activeIndex++;
        updateCarousel();
    }
});

safeAdd(prevBtn, 'click', () => {
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

safeAdd(btns.musicToggle, 'click', () => {
    if (!btns.music) return;
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
safeAdd(btns.toReasons, 'click', () => {
    switchPage('page-gallery', 'page-reasons');
    updateCarousel();
});

// 3. Reasons -> Surprises
safeAdd(btns.toSurprises, 'click', () => {
    switchPage('page-reasons', 'page-surprises');
});

// 3. Surprises Interaction
// Surprise 1: Floating Hearts
safeAdd(btns.floatingHearts, 'click', () => {
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
safeAdd(btns.unlockBox, 'click', () => {
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

safeAdd(starTrigger, 'mouseenter', revealStar);
safeAdd(starTrigger, 'click', revealStar);

function revealStar() {
    starTrigger.classList.add('revealed');
    starMsg.classList.remove('hidden');
    gsap.to(starTrigger, { rotation: 360, duration: 1 });
}

// Surprise 4: Cute Cats
safeAdd(btns.btnCats, 'click', () => {
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

// 4. Surprises -> Timeline
safeAdd(btns.toTimeline, 'click', () => {
    switchPage('page-surprises', 'page-timeline');
    // Animate timeline items
    gsap.from('.timeline-item', { opacity: 0, x: -50, stagger: 0.3, duration: 1, scrollTrigger: '.timeline-container' });
});

// 5. Timeline -> Promises
safeAdd(btns.toPromises, 'click', () => {
    switchPage('page-timeline', 'page-promises');
});

// 6. Promises -> Letter
safeAdd(btns.toLetter, 'click', () => {
    switchPage('page-promises', 'page-letter');
});

// Open Letter Modal
safeAdd(btns.openLetter, 'click', () => {
    // Open Envelope Animation
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
    btns.openLetter.style.display = 'none';

    // Show Modal after envelope opens
    setTimeout(() => {
        btns.letterOverlay.classList.remove('hidden');
        btns.letterOverlay.classList.add('visible');
    }, 800);
});

// Close Letter Modal
safeAdd(btns.closeLetter, 'click', () => {
    btns.letterOverlay.classList.remove('visible');
    setTimeout(() => {
        btns.letterOverlay.classList.add('hidden');
        // Show button to final page
        document.getElementById('btn-to-final').classList.remove('hidden');
        // Actually, let's just go to final page immediately for better flow?
        // Or let user choose. Let's redirect to final page.
        switchPage('page-letter', 'page-final');
        startFireworks();
    }, 500);
});

// 5. Letter -> Final
safeAdd(btns.toFinal, 'click', () => {
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

safeAdd(btns.replay, 'click', () => {
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

// --- BEAUTY EFFECTS ---

// 1. Typing Effect
const textToType = "Turning 20 and more beautiful than ever ✨";
let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        btns.typingText.innerHTML += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeWriter, 50);
    }
}
// Start typing after a short delay
setTimeout(typeWriter, 1000);

// 2. Cursor Sparkle Trail
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 1000);
});

// 3. Parallax Background
const bgHearts = document.getElementById('bg-hearts');
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth - e.pageX) / 50;
    const y = (window.innerHeight - e.pageY) / 50;
    bgHearts.style.transform = `translate(${x}px, ${y}px)`;
});
