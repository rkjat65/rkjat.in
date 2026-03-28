var b=Object.defineProperty;var $=(e,t,i)=>t in e?b(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var n=(e,t,i)=>$(e,typeof t!="symbol"?t+"":t,i);import{g as o,S as c,j as y,k as M,p as C,l as T,m as E,n as p,B as D,f as h,A as d,P as S,s as g,o as L,i as z,h as k,q as H}from"./share-7wz8QcD6.js";class I{constructor(t){n(this,"cellSize");n(this,"grid");this.cellSize=t,this.grid=new Map}clear(){this.grid.clear()}getCellKey(t,i){const s=Math.floor(t/this.cellSize),a=Math.floor(i/this.cellSize);return`${s},${a}`}insert(t){const i=this.getCellKey(t.x,t.y),s=this.grid.get(i);s?s.push(t):this.grid.set(i,[t])}getNearby(t){const i=[],s=Math.floor(t.x/this.cellSize),a=Math.floor(t.y/this.cellSize);for(let r=-1;r<=1;r++)for(let l=-1;l<=1;l++){const f=`${s+r},${a+l}`,u=this.grid.get(f);u&&i.push(...u)}return i}}class j{constructor(t){n(this,"canvas");n(this,"ctx");n(this,"particles",[]);n(this,"config");n(this,"spatialHash");n(this,"width",0);n(this,"height",0);n(this,"animationId",null);n(this,"isRunning",!1);n(this,"connectionDistanceSq");n(this,"animate",()=>{if(!this.isRunning)return;this.ctx.clearRect(0,0,this.width,this.height);const t=E()?p.dark:p.light;this.spatialHash.clear();for(const i of this.particles)this.updateParticle(i),this.spatialHash.insert(i);for(const i of this.particles){this.drawParticle(i,t.particle);const s=this.spatialHash.getNearby(i);for(const a of s){if(a.id>=i.id)continue;const r=i.x-a.x,l=i.y-a.y;r*r+l*l<this.connectionDistanceSq&&this.drawConnection(i,a,t.connection)}}this.animationId=requestAnimationFrame(this.animate)});this.canvas=t;const i=t.getContext("2d");if(!i)throw new Error("Could not get canvas 2D context");this.ctx=i,this.config=M(D.tablet)?y.mobile:y.desktop,this.spatialHash=new I(this.config.connectionDistance),this.connectionDistanceSq=this.config.connectionDistance**2}init(){C()||(this.resize(),this.createParticles(),this.setupEventListeners(),this.start())}resize(){this.width=window.innerWidth,this.height=window.innerHeight,this.canvas.width=this.width,this.canvas.height=this.height}createParticles(){this.particles=[];const{particleCount:t,particleSize:i}=this.config;for(let s=0;s<t;s++)this.particles.push({id:s,x:Math.random()*this.width,y:Math.random()*this.height,vx:(Math.random()-.5)*this.config.particleSpeed,vy:(Math.random()-.5)*this.config.particleSpeed,size:Math.random()*(i.max-i.min)+i.min})}setupEventListeners(){const t=T(()=>{this.resize(),this.createParticles()},250);window.addEventListener("resize",t),document.addEventListener("themeChange",()=>{}),document.addEventListener("visibilitychange",()=>{document.hidden?this.pause():this.start()})}updateParticle(t){t.x+=t.vx,t.y+=t.vy,(t.x<0||t.x>this.width)&&(t.vx*=-1,t.x=Math.max(0,Math.min(this.width,t.x))),(t.y<0||t.y>this.height)&&(t.vy*=-1,t.y=Math.max(0,Math.min(this.height,t.y)))}drawParticle(t,i){this.ctx.fillStyle=i,this.ctx.beginPath(),this.ctx.arc(t.x,t.y,t.size,0,Math.PI*2),this.ctx.fill()}drawConnection(t,i,s){this.ctx.strokeStyle=s,this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(t.x,t.y),this.ctx.lineTo(i.x,i.y),this.ctx.stroke()}start(){this.isRunning||(this.isRunning=!0,this.animate())}pause(){this.isRunning=!1,this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null)}destroy(){this.pause(),this.particles=[],this.spatialHash.clear()}}function R(){const e=o(c.heroCanvas);if(!e)return null;const t=new j(e);return t.init(),t}function A(e){const t=e.tags.map(i=>`<span class="tag">${i}</span>`).join("");return`
    <article class="card" data-href="${e.link}" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${e.image}"
          class="card-image"
          alt="${g(e.title)}"
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
  `}function B(e){const t=L(e.date),i=e.tags.slice(0,3).map(s=>`<span class="tag">${s}</span>`).join("");return`
    <article class="card" data-href="${e.link}" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${e.image}"
          alt="${g(e.title)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <p class="blog-meta">${t} · ${e.readTime}</p>
        <h3><a href="${e.link}">${e.title}</a></h3>
        <p>${e.description}</p>
        <div class="tags">${i}</div>
      </div>
    </article>
  `}function F(e){return`
    <article class="card" data-href="/gallery.html" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${e.image}"
          class="card-image"
          alt="${g(e.caption)}"
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
  `}function m(e,t){e.innerHTML=`<p class="error-message">${t}</p>`}async function v(e){const t=o(c.featuredProjects);if(t)try{let i=e;i||(i=(await h(d.contentIndex)).projects);const s=[...i].sort((a,r)=>new Date(r.date).getTime()-new Date(a.date).getTime()).slice(0,S.projectsPerPage);t.innerHTML=s.map(A).join("")}catch(i){console.error("Error loading projects:",i),m(t,"Unable to load projects at this time.")}}async function x(e){const t=o(c.latestBlogs);if(t)try{let i=e;i||(i=(await h(d.contentIndex)).blogs);const s=[...i].sort((a,r)=>new Date(r.date).getTime()-new Date(a.date).getTime()).slice(0,S.blogsPerPage);t.innerHTML=s.map(B).join("")}catch(i){console.error("Error loading blogs:",i),m(t,"Unable to load blog posts at this time.")}}async function O(){const e=o(c.galleryPreview);if(e)try{const i=(await h(d.galleryData)).slice(0,3);e.innerHTML=i.map(F).join("")}catch(t){console.error("Error loading gallery preview:",t),m(e,"Unable to load gallery at this time.")}}async function q(){try{const e=await h(d.contentIndex);await Promise.all([v(e.projects),x(e.blogs)])}catch(e){console.error("Error loading content:",e),await Promise.all([v(),x()])}}function N(){const e=!!o(c.featuredProjects),t=!!o(c.latestBlogs),i=!!o(c.galleryPreview);(e||t)&&q(),i&&O()}function G(){const e=o(".contact-form");e&&e.addEventListener("submit",t=>{K(t)})}async function K(e){e.preventDefault();const t=e.target,i=t.querySelector('button[type="submit"]');if(!i)return;const s=i.textContent??"Send Message";try{i.textContent="Sending...",i.disabled=!0,(await U(t)).success?W(t):w(i,s)}catch{w(i,s)}}async function U(e){const t=new FormData(e),i=e.action;if(!i)throw new Error("Form action not specified");const s=await fetch(i,{method:"POST",body:t,headers:{Accept:"application/json"}});return s.ok?{success:!0,message:"Message sent successfully"}:{success:!1,message:`HTTP error ${s.status}`}}function W(e){e.innerHTML=`
    <div class="form-success" style="text-align: center; padding: 40px;">
      <p style="font-size: 3rem; margin-bottom: 16px;">✅</p>
      <h3>Message Sent!</h3>
      <p style="color: var(--text-secondary);">I'll get back to you soon.</p>
    </div>
  `}function w(e,t){e.textContent="Error - Try Again",e.disabled=!1,setTimeout(()=>{e.textContent=t},2e3)}function P(){z(),k(),R(),N(),H(),G()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",P):P();
//# sourceMappingURL=main-AVMpKZzQ.js.map
