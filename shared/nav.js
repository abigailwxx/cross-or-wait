/* Site nav, shared by every page (Figma: DS3 file, component "site nav").
   Add it as the first thing inside <body>:
     <script src="../shared/nav.js" data-active="game"></script>
   data-active: motion | quiz | game | data, or empty. A page can change it later with window.ntgNav.setActive(key).
   The nav is fixed at the top; its height is published as --ntg-nav-h so pages can start their content below it.
   Hide it (e.g. during full-screen play) with <body class="ntg-nav-off">. */
(() => {
const me = document.currentScript;
const root = new URL('../', me.src);            // this file lives in shared/, the site root is one level up
const at = p => new URL(p, root).href;
// order decided by Abi: MOTION · QUIZ · GAME · DATA
const ITEMS = [
  ['motion', 'MOTION', at('motion/index.html')],
  ['quiz',   'QUIZ',   at('index.html#quiz')],
  ['game',   'GAME',   at('game/index.html')],
  ['data',   'DATA',   at('data/index.html')],     // quiz + game results together
];

const css = `
:root{--ntg-nav-h:80px}
.ntg-nav{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;gap:12px 24px;flex-wrap:wrap;
  min-height:80px;padding:calc(env(safe-area-inset-top,0px)) max(72px,env(safe-area-inset-right,0px)) 0 max(72px,env(safe-area-inset-left,0px));
  background:#111931;border-bottom:1px solid rgba(117,251,253,.15);font-family:'DM Mono',ui-monospace,Menlo,monospace;box-sizing:border-box}
.ntg-nav *{box-sizing:border-box}
.ntg-nav .ntg-home{font:700 22px/1 'Doto','DM Mono',ui-monospace,monospace;color:#bafd50;text-decoration:none;letter-spacing:0}
.ntg-nav .ntg-home:hover{text-shadow:0 0 12px rgba(186,253,80,.6)}
.ntg-nav ul{display:flex;gap:12px;margin:0;padding:0;list-style:none}
.ntg-nav a.ntg-pill{display:flex;align-items:center;gap:10px;height:40px;padding:0 18px;border-radius:22px;border:1.5px solid #2a3566;
  color:#75fbfd;font:500 13px/1 'DM Mono',ui-monospace,Menlo,monospace;letter-spacing:.08em;text-decoration:none;white-space:nowrap;
  transition:border-color .2s ease,background .2s ease}
.ntg-nav a.ntg-pill i{width:10px;height:10px;border-radius:50%;background:#2a3566;flex:none;transition:background .2s ease,box-shadow .2s ease}
.ntg-nav a.ntg-pill:hover{border-color:rgba(117,251,253,.55)}
.ntg-nav a.ntg-pill:hover i{background:#75fbfd}
.ntg-nav a.ntg-pill[aria-current="page"]{background:#1b2547;border-color:#bafd50;color:#bafd50}
.ntg-nav a.ntg-pill[aria-current="page"] i{background:#bafd50;box-shadow:0 0 8px rgba(186,253,80,.8)}
.ntg-nav :focus-visible{outline:2px solid #bafd50;outline-offset:3px}
body.ntg-nav-off .ntg-nav{display:none}
@media (max-width:900px){
  .ntg-nav{padding-left:max(24px,env(safe-area-inset-left,0px));padding-right:max(24px,env(safe-area-inset-right,0px))}
}
@media (max-width:640px){
  .ntg-nav{min-height:0;padding-top:calc(14px + env(safe-area-inset-top,0px));padding-bottom:14px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
  .ntg-nav .ntg-home{font-size:18px}
  .ntg-nav ul{width:100%;gap:6px}
  .ntg-nav ul li{flex:1}
  .ntg-nav a.ntg-pill{height:34px;padding:0 8px;gap:6px;font-size:11px;justify-content:center}
  .ntg-nav a.ntg-pill i{width:7px;height:7px}
}`;
const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

const nav = document.createElement('nav');
nav.className = 'ntg-nav';
nav.setAttribute('aria-label', 'Site');
nav.innerHTML = `<a class="ntg-home" href="${at('index.html')}">HOMEPAGE</a><ul>` +
  ITEMS.map(([k, label, href]) => `<li><a class="ntg-pill" data-k="${k}" href="${href}"><i aria-hidden="true"></i>${label}</a></li>`).join('') + '</ul>';
me.parentNode.insertBefore(nav, me);

function setActive(key) {
  for (const a of nav.querySelectorAll('.ntg-pill')) {
    if (a.dataset.k === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
}
setActive(me.dataset.active || null);

// keep --ntg-nav-h equal to the nav's real height (it grows to two rows on phones)
const publish = () => { if (nav.offsetHeight) document.documentElement.style.setProperty('--ntg-nav-h', nav.offsetHeight + 'px'); };
if (window.ResizeObserver) new ResizeObserver(publish).observe(nav);
publish();

document.documentElement.classList.add('has-ntg-nav'); // pages hide their own brand line with this
// the crosswalk beep (880 Hz square wave, from the quiz) on everything you can press, on every page.
// Buttons whose page already beeps in its own press animation carry data-own-sound. SOUND OFF in the game silences it.
let actx = null;
function beep() {
  try { if (localStorage.getItem('wyc-muted') === '1') return; } catch (e) {}
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = 880;
    g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + .09);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + .1);
  } catch (e) {}
}
addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('a[href],button,[role=button]');
  if (!t || t.disabled || t.closest('[data-own-sound]')) return;
  beep();
  // a link to another page waits a moment so the beep is heard before the page changes
  if (t.tagName === 'A' && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
      (!t.target || t.target === '_self') && !t.hasAttribute('download')) {
    const url = new URL(t.href, location.href);
    if (url.pathname !== location.pathname || url.search !== location.search) {
      e.preventDefault(); setTimeout(() => { location.href = url.href; }, 140);
    }
  }
}, true);

window.ntgNav = { setActive, beep };
})();
