var z=Object.defineProperty;var O=(e,t,n)=>t in e?z(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var r=(e,t,n)=>O(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();const j={tablet:768},S={mobile:{particleCount:30,connectionDistance:120,particleSpeed:.5,particleSize:{min:1,max:3}},desktop:{particleCount:60,connectionDistance:150,particleSpeed:.5,particleSize:{min:1,max:3}}},P={scrollThreshold:50,copyFeedbackDuration:2e3},M={galleryItemsPerPage:12,projectsPerPage:3,blogsPerPage:3,maxVisiblePages:5},c={themeToggle:"#theme-toggle",nav:".nav",navToggle:".nav-toggle",navLinks:".nav-links",heroCanvas:"#hero-canvas",featuredProjects:"#featured-projects",latestBlogs:"#latest-blogs",galleryPreview:"#gallery-preview",fadeElements:".section-header, .card, .profile-container, .hero-text"},l={active:"active",visible:"visible",scrolled:"scrolled",fadeInSection:"fade-in-section"},p={theme:"data-theme"},u={contentIndex:"/content-index.json",galleryData:"/gallery-data.json"},v={theme:"theme"},L={light:{particle:"rgba(0, 113, 227, 0.5)",connection:"rgba(0, 113, 227, 0.1)"},dark:{particle:"rgba(255, 255, 255, 0.5)",connection:"rgba(255, 255, 255, 0.1)"}};class g extends Error{constructor(n,i,a){super(n);r(this,"resource");r(this,"originalError");this.name="ContentError",this.resource=i,this.originalError=a??null}}function R(e,t){let n=null;return function(...i){n!==null&&clearTimeout(n),n=setTimeout(()=>{e.apply(this,i),n=null},t)}}function F(e,t){let n=!1;return function(...i){n||(e.apply(this,i),n=!0,setTimeout(()=>{n=!1},t))}}async function f(e){try{const t=await fetch(e);if(!t.ok)throw new g(`HTTP error ${t.status}: ${t.statusText}`,e,new Error(`HTTP ${t.status}`));return await t.json()}catch(t){throw t instanceof g?t:new g(`Failed to fetch ${e}: ${t instanceof Error?t.message:"Unknown error"}`,e,t instanceof Error?t:void 0)}}function o(e){return document.querySelector(e)}function $(e){return document.querySelectorAll(e)}function B(e,t,n,i){const a=o(e);a&&a.addEventListener(t,n,i)}function N(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function q(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function U(e=768){return window.innerWidth<e}async function W(e){try{return await navigator.clipboard.writeText(e),!0}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select();try{return document.execCommand("copy"),!0}catch{return!1}finally{document.body.removeChild(t)}}}function y(e){const t=document.createElement("div");return t.innerHTML=e,t.textContent??t.innerText??""}function A(){return document.documentElement.getAttribute(p.theme)??"light"}function I(){return A()==="dark"}function H(e){document.documentElement.setAttribute(p.theme,e),localStorage.setItem(v.theme,e),D(),V(e)}function G(){const t=A()==="dark"?"light":"dark";H(t)}function D(){const e=o(c.themeToggle);e&&(e.textContent=I()?"Light":"Dark")}function V(e){const t=new CustomEvent("themeChange",{detail:{theme:e}});document.dispatchEvent(t)}function K(){const e=localStorage.getItem(v.theme);return e&&(e==="light"||e==="dark")?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function Y(){const e=K();document.documentElement.setAttribute(p.theme,e),D(),B(c.themeToggle,"click",()=>{G()}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",n=>{localStorage.getItem(v.theme)||H(n.matches?"dark":"light")})}function _(){const e=o(c.navToggle),t=o(c.navLinks);!e||!t||(e.addEventListener("click",()=>{const n=t.classList.toggle(l.active);e.setAttribute("aria-expanded",String(n))}),t.querySelectorAll("a").forEach(n=>{n.addEventListener("click",()=>{t.classList.remove(l.active),e.setAttribute("aria-expanded","false")})}),document.addEventListener("keydown",n=>{n.key==="Escape"&&t.classList.contains(l.active)&&(t.classList.remove(l.active),e.setAttribute("aria-expanded","false"),e.focus())}),document.addEventListener("click",n=>{const i=n.target;t.classList.contains(l.active)&&!t.contains(i)&&!e.contains(i)&&(t.classList.remove(l.active),e.setAttribute("aria-expanded","false"))}))}function X(){const e=window.location.pathname;$(`${c.navLinks} a`).forEach(n=>{const i=n.getAttribute("href");if(!i)return;e===i||i!=="/"&&e.startsWith(i)?(n.classList.add(l.active),n.setAttribute("aria-current","page")):(n.classList.remove(l.active),n.removeAttribute("aria-current"))})}function J(){const e=o(c.nav);if(!e)return;const t=F(()=>{window.pageYOffset>P.scrollThreshold?e.classList.add(l.scrolled):e.classList.remove(l.scrolled)},100);window.addEventListener("scroll",t,{passive:!0}),t()}function Q(){const e=new IntersectionObserver(t=>{t.forEach(n=>{n.isIntersecting&&n.target.classList.add(l.visible)})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});$(c.fadeElements).forEach(t=>{t.classList.add(l.fadeInSection),e.observe(t)})}function Z(){document.body.addEventListener("click",e=>{const t=e.target.closest(".card[data-href]");if(t){e.preventDefault();const n=t.dataset.href;n&&(window.location.href=n)}}),document.body.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;const t=e.target.closest(".card[data-href]");if(t){e.preventDefault();const n=t.dataset.href;n&&(window.location.href=n)}})}function tt(){_(),X(),J(),Q(),Z()}class et{constructor(t){r(this,"cellSize");r(this,"grid");this.cellSize=t,this.grid=new Map}clear(){this.grid.clear()}getCellKey(t,n){const i=Math.floor(t/this.cellSize),a=Math.floor(n/this.cellSize);return`${i},${a}`}insert(t){const n=this.getCellKey(t.x,t.y),i=this.grid.get(n);i?i.push(t):this.grid.set(n,[t])}getNearby(t){const n=[],i=Math.floor(t.x/this.cellSize),a=Math.floor(t.y/this.cellSize);for(let s=-1;s<=1;s++)for(let d=-1;d<=1;d++){const b=`${i+s},${a+d}`,x=this.grid.get(b);x&&n.push(...x)}return n}}class nt{constructor(t){r(this,"canvas");r(this,"ctx");r(this,"particles",[]);r(this,"config");r(this,"spatialHash");r(this,"width",0);r(this,"height",0);r(this,"animationId",null);r(this,"isRunning",!1);r(this,"connectionDistanceSq");r(this,"animate",()=>{if(!this.isRunning)return;this.ctx.clearRect(0,0,this.width,this.height);const t=I()?L.dark:L.light;this.spatialHash.clear();for(const n of this.particles)this.updateParticle(n),this.spatialHash.insert(n);for(const n of this.particles){this.drawParticle(n,t.particle);const i=this.spatialHash.getNearby(n);for(const a of i){if(a.id>=n.id)continue;const s=n.x-a.x,d=n.y-a.y;s*s+d*d<this.connectionDistanceSq&&this.drawConnection(n,a,t.connection)}}this.animationId=requestAnimationFrame(this.animate)});this.canvas=t;const n=t.getContext("2d");if(!n)throw new Error("Could not get canvas 2D context");this.ctx=n,this.config=U(j.tablet)?S.mobile:S.desktop,this.spatialHash=new et(this.config.connectionDistance),this.connectionDistanceSq=this.config.connectionDistance**2}init(){q()||(this.resize(),this.createParticles(),this.setupEventListeners(),this.start())}resize(){this.width=window.innerWidth,this.height=window.innerHeight,this.canvas.width=this.width,this.canvas.height=this.height}createParticles(){this.particles=[];const{particleCount:t,particleSize:n}=this.config;for(let i=0;i<t;i++)this.particles.push({id:i,x:Math.random()*this.width,y:Math.random()*this.height,vx:(Math.random()-.5)*this.config.particleSpeed,vy:(Math.random()-.5)*this.config.particleSpeed,size:Math.random()*(n.max-n.min)+n.min})}setupEventListeners(){const t=R(()=>{this.resize(),this.createParticles()},250);window.addEventListener("resize",t),document.addEventListener("themeChange",()=>{}),document.addEventListener("visibilitychange",()=>{document.hidden?this.pause():this.start()})}updateParticle(t){t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.width)&&(t.vx*=-1,t.x=Math.max(0,Math.min(this.width,t.x))),(t.y<0||t.y>this.height)&&(t.vy*=-1,t.y=Math.max(0,Math.min(this.height,t.y)))}drawParticle(t,n){this.ctx.fillStyle=n,this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size,0,Math.PI*2),this.ctx.fill()}drawConnection(t,n,i){this.ctx.strokeStyle=i,this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(n.x,n.y),this.ctx.stroke()}start(){this.isRunning||(this.isRunning=!0,this.animate())}pause(){this.isRunning=!1,this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}destroy(){this.pause(),this.particles=[],this.spatialHash.clear()}}function it(){const e=o(c.heroCanvas);if(!e)return null;const t=new nt(e);return t.init(),t}function at(e){const t=e.tags.map(n=>`<span class="tag">${n}</span>`).join("");return`
    <article class="card" data-href="${e.link}" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${e.image}"
          class="card-image"
          alt="${y(e.title)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <h3><a href="${e.link}">${e.title}</a></h3>
        <p>${e.description}</p>
        <div class="tags">${t}</div>
      </div>
    </article>
  `}function st(e){const t=N(e.date),n=e.tags.slice(0,3).map(i=>`<span class="tag">${i}</span>`).join("");return`
    <article class="card" data-href="${e.link}" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${e.image}"
          alt="${y(e.title)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <p class="blog-meta">${t} · ${e.readTime}</p>
        <h3><a href="${e.link}">${e.title}</a></h3>
        <p>${e.description}</p>
        <div class="tags">${n}</div>
      </div>
    </article>
  `}function rt(e){return`
    <article class="card" data-href="/gallery.html" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${e.image}"
          class="card-image"
          alt="${y(e.caption)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <div class="tags">
          <span class="tag">${e.category}</span>
        </div>
        <p>${e.caption}</p>
      </div>
    </article>
  `}function w(e,t){e.innerHTML=`<p class="error-message">${t}</p>`}async function k(e){const t=o(c.featuredProjects);if(t)try{let n=e;n||(n=(await f(u.contentIndex)).projects);const i=[...n].sort((a,s)=>new Date(s.date).getTime()-new Date(a.date).getTime()).slice(0,M.projectsPerPage);t.innerHTML=i.map(at).join("")}catch(n){console.error("Error loading projects:",n),w(t,"Unable to load projects at this time.")}}async function T(e){const t=o(c.latestBlogs);if(t)try{let n=e;n||(n=(await f(u.contentIndex)).blogs);const i=[...n].sort((a,s)=>new Date(s.date).getTime()-new Date(a.date).getTime()).slice(0,M.blogsPerPage);t.innerHTML=i.map(st).join("")}catch(n){console.error("Error loading blogs:",n),w(t,"Unable to load blog posts at this time.")}}async function ot(){const e=o(c.galleryPreview);if(e)try{const n=(await f(u.galleryData)).slice(0,3);e.innerHTML=n.map(rt).join("")}catch(t){console.error("Error loading gallery preview:",t),w(e,"Unable to load gallery at this time.")}}async function ct(){try{const e=await f(u.contentIndex);await Promise.all([k(e.projects),T(e.blogs)])}catch(e){console.error("Error loading content:",e),await Promise.all([k(),T()])}}function lt(){const e=!!o(c.featuredProjects),t=!!o(c.latestBlogs),n=!!o(c.galleryPreview);(e||t)&&ct(),n&&ot()}function h(){return{url:window.location.href,text:document.title,hashtags:["DataVisualization","Analytics","RKJat"]}}function m(e,t=550,n=420){const i=(window.innerWidth-t)/2+window.screenX,a=(window.innerHeight-n)/2+window.screenY;window.open(e,"_blank",`width=${t},height=${n},left=${i},top=${a},scrollbars=yes,resizable=yes`)}function dt(e={}){const{url:t,text:n,hashtags:i}={...h(),...e},a=new URLSearchParams({url:t,text:n,hashtags:i.join(",")});m(`https://twitter.com/intent/tweet?${a.toString()}`)}function ht(e={}){const{url:t}={...h(),...e},n=new URLSearchParams({url:t});m(`https://www.linkedin.com/sharing/share-offsite/?${n.toString()}`)}function ut(e={}){const{url:t}={...h(),...e},n=new URLSearchParams({u:t});m(`https://www.facebook.com/sharer/sharer.php?${n.toString()}`)}function ft(e={}){const{url:t,text:n}={...h(),...e},i=new URLSearchParams({text:`${n} ${t}`});m(`https://wa.me/?${i.toString()}`)}async function mt(e={},t="copy-text"){const{url:n}={...h(),...e},i=await W(n),a=o(`#${t}`);if(a){const s=a.textContent??"Copy Link";a.textContent=i?"Copied!":"Failed",setTimeout(()=>{a.textContent=s},P.copyFeedbackDuration)}return i}function gt(e={}){return{...e},`
    <button class="share-btn twitter" data-share="twitter" title="Share on Twitter">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <span>Twitter</span>
    </button>
    <button class="share-btn linkedin" data-share="linkedin" title="Share on LinkedIn">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span>LinkedIn</span>
    </button>
    <button class="share-btn facebook" data-share="facebook" title="Share on Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>Facebook</span>
    </button>
    <button class="share-btn whatsapp" data-share="whatsapp" title="Share on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span>WhatsApp</span>
    </button>
    <button class="share-btn copy" data-share="copy" title="Copy link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span id="copy-text">Copy Link</span>
    </button>
  `}function pt(e="#share-buttons"){const t=o(e);t&&(t.innerHTML.trim()||(t.innerHTML=gt()),t.addEventListener("click",n=>{const i=n.target.closest("[data-share]");if(!i)return;switch(n.preventDefault(),i.dataset.share){case"twitter":dt();break;case"linkedin":ht();break;case"facebook":ut();break;case"whatsapp":ft();break;case"copy":mt();break}}))}function vt(){const e=o(".contact-form");e&&e.addEventListener("submit",t=>{yt(t)})}async function yt(e){e.preventDefault();const t=e.target,n=t.querySelector('button[type="submit"]');if(!n)return;const i=n.textContent??"Send Message";try{n.textContent="Sending...",n.disabled=!0,(await wt(t)).success?bt(t):C(n,i)}catch{C(n,i)}}async function wt(e){const t=new FormData(e),n=e.action;if(!n)throw new Error("Form action not specified");const i=await fetch(n,{method:"POST",body:t,headers:{Accept:"application/json"}});return i.ok?{success:!0,message:"Message sent successfully"}:{success:!1,message:`HTTP error ${i.status}`}}function bt(e){e.innerHTML=`
    <div class="form-success" style="text-align: center; padding: 40px;">
      <p style="font-size: 3rem; margin-bottom: 16px;">✅</p>
      <h3>Message Sent!</h3>
      <p style="color: var(--text-secondary);">I'll get back to you soon.</p>
    </div>
  `}function C(e,t){e.textContent="Error - Try Again",e.disabled=!1,setTimeout(()=>{e.textContent=t},2e3)}function E(){Y(),tt(),it(),lt(),pt(),vt()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",E):E();
//# sourceMappingURL=main-wvEPAvY2.js.map
