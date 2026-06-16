/* =========================================================
   NayePankh Foundation - Shared JS
   ========================================================= */

// ---------- Inject navbar & footer ----------
const NAV_LINKS = [
  ["index.html","Home"],
  ["about.html","About"],
  ["programs.html","Programs"],
  ["volunteer.html","Volunteer"],
  ["stories.html","Stories"],
  ["contact.html","Contact"],
];

function buildNavbar(){
  const current = location.pathname.split("/").pop() || "index.html";
  const linksHTML = NAV_LINKS.map(([h,l])=>{
    const active = h===current ? " active" : "";
    return `<a class="${active.trim()}" href="${h}">${l}</a>`;
  }).join("");
  const mobileLinks = NAV_LINKS.map(([h,l])=>`<a href="${h}">${l}</a>`).join("");
  return `
  <div class="scroll-progress" id="scrollProgress"></div>
  <nav class="navbar" id="navbar">
    <div class="container nav-inner">
      <a class="logo" href="index.html">🕊️ <span><span class="b">NayePankh</span> <span class="o">Foundation</span></span></a>
      <div class="nav-links">${linksHTML}</div>
      <div class="nav-right">
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">🌙</button>
        <a class="btn btn-accent" href="#donate" onclick="openDonateModal();return false;">Donate Now</a>
        <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </nav>
  <div class="mobile-menu" id="mobileMenu">${mobileLinks}<a class="btn btn-accent" href="#" onclick="openDonateModal();return false;">Donate Now</a></div>
  `;
}

function buildFooter(){
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="brand-col">
          <div class="logo" style="color:#fff">🕊️ <span><span class="b">NayePankh</span> <span class="o">Foundation</span></span></div>
          <p>Giving Wings to Dreams. Empowering underprivileged youth across India through education, skills, and opportunity.</p>
          <div class="socials">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">◐</a>
            <a href="#" aria-label="LinkedIn">in</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="programs.html">Programs</a></li>
            <li><a href="stories.html">Stories</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4>Programs</h4>
          <ul>
            <li><a href="programs.html?category=Education">Education</a></li>
            <li><a href="programs.html?category=Digital">Digital</a></li>
            <li><a href="programs.html?category=Career">Career</a></li>
            <li><a href="programs.html?category=Women">Women</a></li>
          </ul>
        </div>
        <div>
          <h4>Stay Connected</h4>
          <p style="font-size:.9rem;color:#a0a0ad">Subscribe to our newsletter for updates and stories.</p>
          <form class="newsletter" onsubmit="event.preventDefault();showToast('Subscribed! Thank you 💌');this.reset();">
            <input type="email" required placeholder="your@email.com">
            <button class="btn btn-accent" type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} NayePankh Foundation. All rights reserved.</span>
        <span><a href="#">Privacy Policy</a> · <a href="#">Terms</a></span>
      </div>
    </div>
  </footer>`;
}

function mountChrome(){
  const navHost = document.getElementById("nav-host");
  const footHost = document.getElementById("footer-host");
  if(navHost) navHost.innerHTML = buildNavbar();
  if(footHost) footHost.innerHTML = buildFooter();
  initNav();
}

function initNav(){
  const nav = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  const onScroll = () => {
    if(window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h>0 ? (window.scrollY/h)*100 : 0;
    progress.style.width = pct + "%";
  };
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  const burger = document.getElementById("hamburger");
  const menu = document.getElementById("mobileMenu");
  burger.addEventListener("click",()=>{
    burger.classList.toggle("open");
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    burger.classList.remove("open");menu.classList.remove("open");
  }));

  // Dark mode
  const t = document.getElementById("themeToggle");
  const saved = localStorage.getItem("np_theme");
  if(saved==="dark") document.documentElement.classList.add("dark");
  t.textContent = document.documentElement.classList.contains("dark")?"☀️":"🌙";
  t.addEventListener("click",()=>{
    document.documentElement.classList.toggle("dark");
    const dark = document.documentElement.classList.contains("dark");
    t.textContent = dark?"☀️":"🌙";
    localStorage.setItem("np_theme",dark?"dark":"light");
  });
}

// ---------- Reveal on scroll ----------
function initReveal(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll("[data-reveal], .tl-item").forEach(el=>obs.observe(el));
}

// ---------- Toast ----------
function showToast(msg, type="success"){
  let stack = document.getElementById("toastStack");
  if(!stack){
    stack = document.createElement("div");
    stack.id="toastStack";stack.className="toast-stack";document.body.appendChild(stack);
  }
  const t = document.createElement("div");
  t.className = "toast " + (type==="error"?"error":type==="info"?"info":"");
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(()=>{t.style.opacity="0";t.style.transition="opacity .3s";},2700);
  setTimeout(()=>t.remove(),3100);
}

// ---------- Modal ----------
function openModal(html){
  let bd = document.getElementById("modalBackdrop");
  if(!bd){
    bd = document.createElement("div");
    bd.id="modalBackdrop";bd.className="modal-backdrop";
    bd.addEventListener("click",e=>{ if(e.target===bd) closeModal(); });
    document.body.appendChild(bd);
  }
  bd.innerHTML = `<div class="modal"><button class="close" onclick="closeModal()" aria-label="Close">×</button>${html}</div>`;
  bd.classList.add("open");
  document.body.style.overflow="hidden";
}
function closeModal(){
  const bd = document.getElementById("modalBackdrop");
  if(bd){ bd.classList.remove("open"); document.body.style.overflow="";}
}
function openDonateModal(){
  openModal(`
    <h3>Donate to NayePankh 💛</h3>
    <p style="color:var(--text-soft);margin-bottom:18px">Your contribution gives wings to a young dream. Choose an amount:</p>
    <div class="toggle-group" id="donateAmt">
      ${[500,1000,2500,5000].map(a=>`<button onclick="document.querySelectorAll('#donateAmt button').forEach(b=>b.classList.remove('on'));this.classList.add('on')">₹${a}</button>`).join("")}
    </div>
    <input class="search-input" type="number" placeholder="Or enter custom amount (₹)" style="margin-top:14px">
    <button class="btn btn-accent" style="margin-top:18px;width:100%" onclick="closeModal();showToast('Thank you for your generous donation! 🙏')">Donate Now</button>
  `);
}

// ---------- Counter animation ----------
function initCounters(){
  const els = document.querySelectorAll("[data-count]");
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count,10);
      const suffix = el.dataset.suffix || "";
      let cur=0;const step=Math.max(1,Math.ceil(target/60));
      const tick=()=>{ cur+=step; if(cur>=target){el.textContent=target.toLocaleString()+suffix;return;} el.textContent=cur.toLocaleString()+suffix; requestAnimationFrame(tick);};
      tick(); obs.unobserve(el);
    });
  },{threshold:.4});
  els.forEach(el=>obs.observe(el));
}

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded",()=>{
  mountChrome();
  initReveal();
  initCounters();
  if(typeof pageInit==="function") pageInit();
});