const cards = [
  {
    id: '003/005',
    title: 'Goldfish Brain',
    rarity: 'SUPER MEGA COMMON',
    meta: 'Somehow still surprised.',
    image: '003-goldfish-brain.webp'
  },
  {
    id: '002/005',
    title: 'After Dark Polaris',
    rarity: 'COMMON',
    meta: 'Frequently sighted at unreasonable hours.',
    image: '002-after-dark-polaris.webp'
  },
  {
    id: '004/005',
    title: 'Horse Brain Activated',
    rarity: 'RARE',
    meta: 'Conversation successfully derailed.',
    image: '004-horse-brain-activated.webp'
  },
  {
    id: '005/005',
    title: 'PAWS Worm Division',
    rarity: 'RARE',
    meta: 'The worms did not cooperate.',
    image: '005-paws-worm-division.webp'
  },
  {
    id: '001/005',
    title: 'Mr. Mshmsh',
    rarity: 'ULTRA RARE',
    meta: 'One second. Maximum psychic damage.',
    image: '001-mr-mshmsh.webp'
  }
];


/* ELEMENTS */

const screens = [...document.querySelectorAll('.screen')];

const intro = document.getElementById('intro');
const pack = document.getElementById('pack');
const collection = document.getElementById('collection');

const cardShell = document.getElementById('cardShell');
const cardBack = document.getElementById('cardBack');
const cardImage = document.getElementById('cardImage');

const rarityPop = document.getElementById('rarityPop');

const progress = document.getElementById('progress');
const pullLabel = document.getElementById('pullLabel');
const pullTitle = document.getElementById('pullTitle');
const pullMeta = document.getElementById('pullMeta');

const nextCard = document.getElementById('nextCard');
const viewCollection = document.getElementById('viewCollection');

const gallery = document.getElementById('gallery');

let index = 0;
let revealed = false;


/* SCREEN CONTROL */

function show(screen) {
  screens.forEach(s => {
    s.classList.toggle('active', s === screen);
  });

  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
}


/* PREPARE CARD */

function prepareCard(i) {
  const c = cards[i];

  revealed = false;

  cardShell.classList.remove('revealed');

  progress.textContent =
    `Card ${i + 1} of ${cards.length}`;

  pullLabel.textContent =
    'UNKNOWN PULL';

  pullTitle.textContent =
    '???';

  pullMeta.textContent =
    'Tap the card to reveal.';

  nextCard.classList.add('hidden');
  viewCollection.classList.add('hidden');

  rarityPop.textContent =
    c.rarity;

  cardImage.src =
    c.image;

  cardImage.alt =
    `${c.title} — ${c.rarity} Polaris Collection card`;
}


/* SPARK EFFECT */

function sparkBurst() {
  const rect =
    cardShell.getBoundingClientRect();

  const cx =
    rect.left + rect.width / 2;

  const cy =
    rect.top + rect.height / 2;

  for (let i = 0; i < 18; i++) {
    const s =
      document.createElement('span');

    s.className = 'burst';

    const angle =
      (Math.PI * 2 * i / 18)
      + Math.random() * .15;

    const distance =
      70 + Math.random() * 120;

    s.style.left =
      `${cx}px`;

    s.style.top =
      `${cy}px`;

    s.style.setProperty(
      '--x',
      `${Math.cos(angle) * distance}px`
    );

    s.style.setProperty(
      '--y',
      `${Math.sin(angle) * distance}px`
    );

    document.body.appendChild(s);

    setTimeout(
      () => s.remove(),
      1000
    );
  }
}


/* REVEAL CARD */

function reveal() {
  if (revealed) return;

  revealed = true;

  const c = cards[index];

  cardShell.classList.add('revealed');

  setTimeout(
    sparkBurst,
    460
  );

  if (navigator.vibrate) {
    navigator.vibrate(22);
  }

  setTimeout(() => {
    pullLabel.textContent =
      `${c.rarity} · ${c.id}`;

    pullTitle.textContent =
      c.title;

    pullMeta.textContent =
      c.meta;

    if (index < cards.length - 1) {
      nextCard.classList.remove('hidden');
    } else {
      viewCollection.classList.remove('hidden');
    }
  }, 660);
}


/* DOWNLOAD FILE NAME */

function getDownloadName(card) {
  return card.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    + '.webp';
}


/* BUILD COLLECTION */

function buildGallery() {
  gallery.innerHTML = '';

  const ordered =
    [...cards].sort(
      (a, b) =>
        a.id.localeCompare(b.id)
    );

  ordered.forEach(c => {
    const item =
      document.createElement('article');

    item.className =
      'gallery-card';

    item.innerHTML = `
      <img
        src="${c.image}"
        alt="${c.title}"
        loading="lazy"
      >

      <div class="tag">
        ${c.id} · ${c.rarity}
      </div>

      <a
        class="download-card"
        href="${c.image}"
        download="${getDownloadName(c)}"
        aria-label="Download ${c.title}"
      >
        ↓ DOWNLOAD CARD
      </a>
    `;

    gallery.appendChild(item);
  });
}


/* BUTTON EVENTS */

document
  .getElementById('openPack')
  .addEventListener('click', () => {
    index = 0;

    prepareCard(index);

    show(pack);
  });


document
  .getElementById('backToCover')
  .addEventListener('click', () => {
    show(intro);
  });


cardBack.addEventListener(
  'click',
  reveal
);


cardBack.addEventListener(
  'keydown',
  e => {
    if (
      e.key === 'Enter'
      || e.key === ' '
    ) {
      e.preventDefault();

      reveal();
    }
  }
);


nextCard.addEventListener(
  'click',
  () => {
    index++;

    prepareCard(index);
  }
);


viewCollection.addEventListener(
  'click',
  () => {
    buildGallery();

    show(collection);
  }
);


document
  .getElementById('replay')
  .addEventListener('click', () => {
    index = 0;

    prepareCard(index);

    show(pack);
  });


/* PRELOAD CARD IMAGES */

cards.forEach(c => {
  const img = new Image();

  img.src = c.image;
});
