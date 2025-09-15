(function(){
  const grid = document.querySelector('#Experimentations') || document;
  const itemSelector = 'a[href*=".png"],a[href*=".jpg"],a[href*=".jpeg"],a[href*=".webp"],a[href*=".gif"],a[data-lightbox]';

  const items = Array.from(grid.querySelectorAll(itemSelector));
  if (!items.length) return;

  const root = document.getElementById('exp-lightbox');
  const mediaWrap = document.getElementById('exp-lightbox-media');
  const captionEl = document.getElementById('exp-lightbox-caption');
  const btnClose = root.querySelector('.close');
  const btnPrev = root.querySelector('.nav.prev');
  const btnNext = root.querySelector('.nav.next');

  let index = 0;
  let lastActive = null;

  const slides = items.map(a => ({
    el: a,
    src: (a.getAttribute('data-src') || a.getAttribute('href')).replace(/#$/,''),
    caption: a.getAttribute('data-caption') || a.getAttribute('aria-label') || (a.querySelector('img')?.alt) || a.textContent.trim()
  }));

  function openAt(i){
    index = (i + slides.length) % slides.length;
    const slide = slides[index];
    root.classList.add('open');
    root.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('lightbox-open');

    mediaWrap.innerHTML = '';
    const url = slide.src;
    const isVideo = /\.(mp4|webm|mov)$/i.test(url);
    const node = isVideo ? document.createElement('video') : document.createElement('img');
    node.setAttribute('alt', slide.caption || 'Preview');
    if (isVideo) { node.controls = true; node.autoplay = true; node.src = url; }
    else { node.loading = 'eager'; node.src = url; }
    mediaWrap.appendChild(node);

    captionEl.textContent = slide.caption || '';
    btnClose.focus();
  }

  function close(){
    root.classList.remove('open');
    root.setAttribute('aria-hidden', 'true');
    mediaWrap.innerHTML = '';
    document.body.style.overflow = '';
    document.body.classList.remove('lightbox-open');
    if (lastActive) lastActive.focus();
  }

  function next(){ openAt(index+1); }
  function prev(){ openAt(index-1); }

  items.forEach((a, i) => {
    a.addEventListener('click', (e) => {
      if (!a.matches(itemSelector)) return;
      e.preventDefault();
      lastActive = a;
      openAt(i);
    });
  });

  btnClose.addEventListener('click', close);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  root.addEventListener('click', (e)=>{ if (e.target === root) close(); });

  document.addEventListener('keydown', (e)=>{
    if (!root.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });

  if (location.hash.startsWith('#lightbox=')) {
    const i = parseInt(location.hash.split('=')[1], 10);
    if (!Number.isNaN(i) && i>=0 && i<slides.length) openAt(i);
  }
})();
// after $log, $form, $input, $send:
const $orbWrap = document.querySelector('.orb-wrap');
function setOrbState(state){
  if(!$orbWrap) return;
  $orbWrap.classList.remove('state-idle','state-typing','state-sending','state-reply');
  $orbWrap.classList.add(`state-${state}`);
}

// after initial greeting append(...):
setOrbState('idle');

// typing detector
let typingTimer;
$input.addEventListener('input', () => {
  setOrbState('typing');
  clearTimeout(typingTimer);
  typingTimer = setTimeout(()=> setOrbState('idle'), 1200);
});

// keep Enter-to-send:
$input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    $form.dispatchEvent(new Event('submit'));
  }
});

// in submit handler:
setOrbState('sending');         // right after validating q
// inside try BEFORE typing(true):
setOrbState('reply');
// in catch and finally:
setOrbState('idle');