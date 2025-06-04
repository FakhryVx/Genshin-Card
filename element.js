let startTime, timerInterval;
const archons = [
    { name: "Anemo", img: "assets/a.png" },
    { name: "Geo", img: "assets/ge.png" },
    { name: "Electro", img: "assets/el.png" },
    { name: "Dendro", img: "assets/dndr.png" },
    { name: "Hydro", img: "assets/hy.png" },
    { name: "Pyro", img: "assets/py.png" },
    { name: "Cryo", img: "assets/cry.png" },
    { name: "mondstadt", img: "assets/mondo.png" },
    { name: "liyue", img: "assets/liy.png" },
    { name: "inazzuma", img: "assets/inaz.png" },
    { name: "sumeru", img: "assets/sume.png" },
    { name: "fontaine", img: "assets/font.png" },
    { name: "natlan", img: "assets/natl.png" },
    { name: "snezhnaya", img: "assets/snezh.png" },
    
];

const pairs = {
    "Anemo": "mondstadt", "mondstadt": "Anemo",
    "Geo": "liyue", "liyue": "Geo",
    "Electro": "inazuma", "inazuma": "Electro",
    "Dendro": "sumeru", "sumeru": "Dendro",
    "Hydro": "fontaine", "fontaine": "Hydro",
    "Pyro": "natlan", "natlan": "Pyro",
    "Cryo": "snezhnaya", "snezhnaya": "Cryo",

};

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let lockBoard = false;
let moves = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startGame() {
    const board = document.getElementById('game-board');
    const info = document.getElementById('info');
    board.innerHTML = '';
    moves = 0;
    matchedCount = 0;
    info.textContent = "Cocokkan pasangan archon dengan elementnya!";
    const selected = [
        "Anemo", "Geo", "Electro", "Dendro", "Hydro", "Pyro", "Cryo",
        "mondstadt", "liyue", "inazuma", "sumeru", "fontaine", "natlan", "snezhnaya"
    ];
    cards = shuffle(archons.filter(a => selected.includes(a.name)));
    cards = shuffle(archons.filter(a => selected.includes(a.name)));
    flippedCards = [];
    lockBoard = false;

    startTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {}, 1000);

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';

    cards.forEach((archon) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.name = archon.name;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${archon.img}" alt="${archon.name}">
                </div>
                <div class="card-back">?</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (lockBoard || card.classList.contains('flip') || card.classList.contains('matched')) return;
    card.classList.add('flip');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        lockBoard = true;
        moves++;
        const name1 = flippedCards[0].dataset.name;
        const name2 = flippedCards[1].dataset.name;
        if (pairs[name1] === name2) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
            matchedCount += 2;
            flippedCards = [];
            lockBoard = false;
            if (matchedCount === cards.length) {
                clearInterval(timerInterval);
                showOverlay();
            }
        } else {
            setTimeout(() => {
                flippedCards[0].classList.remove('flip');
                flippedCards[1].classList.remove('flip');
                flippedCards = [];
                lockBoard = false;
            }, 900);
        }
    }
}

function showOverlay() {
    const overlay = document.getElementById('overlay');
    const overlayMoves = document.getElementById('overlay-moves');
    const overlayTime = document.getElementById('overlay-time');
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    if (overlayMoves) overlayMoves.textContent = `Langkah: ${moves}`;
    if (overlayTime) overlayTime.textContent = `Waktu: ${minutes} menit ${seconds} detik`;
    if (overlay) overlay.style.display = 'flex';
}

function restartGame() {
    startGame();
}

window.onload = startGame;