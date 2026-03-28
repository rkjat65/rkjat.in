var f=Object.defineProperty;var y=(h,e,a)=>e in h?f(h,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):h[e]=a;var u=(h,e,a)=>y(h,typeof e!="symbol"?e+"":e,a);import{g as r,S as o,P as p,f as k,A as m,C as l,s as b,a as w,b as L,c as C,d as x,e as H,i as P,h as E}from"./share-7wz8QcD6.js";class S{constructor(){u(this,"state");u(this,"boundHandlers");u(this,"isInitialized",!1);this.state={data:[],currentFilter:"all",currentView:"grid",currentPage:1,currentImageIndex:0,itemsPerPage:p.galleryItemsPerPage},this.boundHandlers=new Map}async init(){this.isInitialized||(await this.loadData(),this.setupEventListeners(),this.render(),this.isInitialized=!0)}async loadData(){try{this.state.data=await k(m.galleryData)}catch(e){console.error("Error loading gallery data:",e),this.state.data=this.getSampleData()}}getSampleData(){return[{id:1,image:"/images/gallery/sample1.png",category:"economics",caption:"Economic growth trends analysis"},{id:2,image:"/images/gallery/sample2.png",category:"politics",caption:"Political landscape visualization"},{id:3,image:"/images/gallery/sample3.png",category:"social",caption:"Social indicators breakdown"}]}setupEventListeners(){const e=r(o.galleryGrid);if(e&&!this.boundHandlers.has("gridClick")){const i=this.handleGridClick.bind(this);this.boundHandlers.set("gridClick",i),e.addEventListener("click",i)}const a=r(o.pagination);if(a&&!this.boundHandlers.has("paginationClick")){const i=this.handlePaginationClick.bind(this);this.boundHandlers.set("paginationClick",i),a.addEventListener("click",i)}const t=document.querySelector(".gallery-filters");if(t&&!this.boundHandlers.has("filterClick")){const i=this.handleFilterClick.bind(this);this.boundHandlers.set("filterClick",i),t.addEventListener("click",i)}const n=document.querySelector(".view-toggle");if(n&&!this.boundHandlers.has("viewClick")){const i=this.handleViewToggle.bind(this);this.boundHandlers.set("viewClick",i),n.addEventListener("click",i)}if(this.setupLightboxListeners(),!this.boundHandlers.has("keyboard")){const i=this.handleKeyboard.bind(this);this.boundHandlers.set("keyboard",i),document.addEventListener("keydown",i)}}setupLightboxListeners(){const e=r(o.lightbox);if(!e)return;const a=r(o.lightboxClose);a&&a.addEventListener("click",()=>this.closeLightbox());const t=r(o.lightboxPrev);t&&t.addEventListener("click",()=>this.navigate(-1));const n=r(o.lightboxNext);n&&n.addEventListener("click",()=>this.navigate(1)),e.addEventListener("click",s=>{s.target.id==="lightbox"&&this.closeLightbox()});const i=r(o.shareButtons);if(i&&!this.boundHandlers.has("shareClick")){const s=this.handleShareClick.bind(this);this.boundHandlers.set("shareClick",s),i.addEventListener("click",s)}}handleGridClick(e){const t=e.target.closest(".gallery-item");if(t){const n=parseInt(t.dataset.index??"0",10);this.openLightbox(n)}}handlePaginationClick(e){const t=e.target.closest(".pagination-btn");if(t&&!t.disabled){const n=parseInt(t.dataset.page??"1",10);n&&n!==this.state.currentPage&&(this.state.currentPage=n,this.render(),window.scrollTo({top:0,behavior:"smooth"}))}}handleFilterClick(e){const t=e.target.closest(".filter-btn");if(t){const n=t.dataset.filter??"all";document.querySelectorAll(".filter-btn").forEach(i=>i.classList.remove(l.active)),t.classList.add(l.active),this.state.currentFilter=n,this.state.currentPage=1,this.render()}}handleViewToggle(e){const t=e.target.closest(".view-btn");if(t){const n=t.dataset.view??"grid";document.querySelectorAll(".view-btn").forEach(s=>s.classList.remove(l.active)),t.classList.add(l.active);const i=r(o.galleryGrid);i&&(n==="masonry"?i.classList.add(l.masonryView):i.classList.remove(l.masonryView)),this.state.currentView=n}}handleShareClick(e){const t=e.target.closest("[data-share]");if(!t)return;e.preventDefault();const n=t.dataset.share,i=this.getFilteredData()[this.state.currentImageIndex];if(!i)return;const s={url:window.location.href,text:b(i.caption)||"Check out this data visualization"};switch(n){case"twitter":x(s);break;case"linkedin":C(s);break;case"facebook":L(s);break;case"whatsapp":w(s);break;case"copy":this.handleCopyLink(t);break}}async handleCopyLink(e){const a=await H(window.location.href),t=e.innerHTML;e.innerHTML=a?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!':"Failed",setTimeout(()=>{e.innerHTML=t},2e3)}handleKeyboard(e){const a=e,t=r(o.lightbox);if(t!=null&&t.classList.contains(l.active))switch(a.key){case"Escape":this.closeLightbox();break;case"ArrowLeft":this.navigate(-1);break;case"ArrowRight":this.navigate(1);break}}getFilteredData(){return this.state.currentFilter==="all"?this.state.data:this.state.data.filter(e=>e.category===this.state.currentFilter)}getPaginatedData(){const e=this.getFilteredData(),a=(this.state.currentPage-1)*this.state.itemsPerPage,t=a+this.state.itemsPerPage;return e.slice(a,t)}render(){this.renderGallery(),this.renderPagination()}renderGallery(){const e=r(o.galleryGrid);if(!e)return;const a=this.getPaginatedData();if(a.length===0){e.innerHTML='<div class="loading-placeholder">No images found in this category</div>';return}e.innerHTML=a.map((t,n)=>{const i=(this.state.currentPage-1)*this.state.itemsPerPage+n,s=b(t.caption);return`
        <div class="gallery-item"
             data-id="${t.id}"
             data-index="${i}"
             data-category="${t.category}"
             tabindex="0"
             role="button"
             aria-label="View ${s}">
          <img src="${t.image}" alt="${s}" class="gallery-item-image" loading="lazy">
          <div class="gallery-item-info">
            <div class="gallery-item-category">${t.category}</div>
            <div class="gallery-item-caption">${t.caption}</div>
          </div>
        </div>
      `}).join("")}renderPagination(){const e=r(o.pagination);if(!e)return;const a=this.getFilteredData(),t=Math.ceil(a.length/this.state.itemsPerPage);if(t<=1){e.innerHTML="";return}const{currentPage:n}=this.state,i=p.maxVisiblePages;let s=Math.max(1,n-Math.floor(i/2));const d=Math.min(t,s+i-1);d-s<i-1&&(s=Math.max(1,d-i+1));let c=`
      <button class="pagination-btn ${n===1?l.disabled:""}"
              data-page="${n-1}"
              ${n===1?"disabled":""}
              aria-label="Previous page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Previous
      </button>
    `;s>1&&(c+='<button class="pagination-btn" data-page="1">1</button>',s>2&&(c+='<span class="pagination-ellipsis">...</span>'));for(let g=s;g<=d;g++)c+=`
        <button class="pagination-btn ${g===n?l.active:""}"
                data-page="${g}"
                ${g===n?'aria-current="page"':""}>
          ${g}
        </button>
      `;d<t&&(d<t-1&&(c+='<span class="pagination-ellipsis">...</span>'),c+=`<button class="pagination-btn" data-page="${t}">${t}</button>`),c+=`
      <button class="pagination-btn ${n===t?l.disabled:""}"
              data-page="${n+1}"
              ${n===t?"disabled":""}
              aria-label="Next page">
        Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `,e.innerHTML=c}openLightbox(e){const a=this.getFilteredData(),t=a[e];if(!t)return;this.state.currentImageIndex=e;const n=r(o.lightbox),i=r(o.lightboxImage),s=r(o.lightboxCaption),d=r(o.lightboxPrev),c=r(o.lightboxNext);n&&i&&s&&(i.src=t.image,i.alt=b(t.caption),s.innerHTML=t.caption||'<em style="opacity: 0.6;">No caption available</em>',this.renderShareButtons(t),d&&(d.disabled=e===0),c&&(c.disabled=e===a.length-1),n.classList.add(l.active),document.body.style.overflow="hidden")}renderShareButtons(e){const a=r(o.shareButtons);a&&(a.innerHTML=`
      <button class="share-btn twitter" data-share="twitter" title="Share on Twitter">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </button>
      <button class="share-btn linkedin" data-share="linkedin" title="Share on LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </button>
      <button class="share-btn facebook" data-share="facebook" title="Share on Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
      <button class="share-btn whatsapp" data-share="whatsapp" title="Share on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </button>
      <button class="share-btn copy" data-share="copy" title="Copy link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Link
      </button>
    `)}closeLightbox(){const e=r(o.lightbox);e&&(e.classList.remove(l.active),document.body.style.overflow="")}navigate(e){const a=this.getFilteredData(),t=this.state.currentImageIndex+e;t>=0&&t<a.length&&this.openLightbox(t)}destroy(){this.boundHandlers.forEach((e,a)=>{let t=null;switch(a){case"gridClick":t=r(o.galleryGrid);break;case"paginationClick":t=r(o.pagination);break;case"filterClick":t=document.querySelector(".gallery-filters");break;case"viewClick":t=document.querySelector(".view-toggle");break;case"shareClick":t=r(o.shareButtons);break;case"keyboard":document.removeEventListener("keydown",e);return}t==null||t.removeEventListener("click",e)}),this.boundHandlers.clear(),this.isInitialized=!1}}function I(){if(!r(o.galleryGrid))return null;const e=new S;return e.init(),e}function v(){P(),E(),I()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v):v();
//# sourceMappingURL=gallery-DwKb7W-k.js.map
