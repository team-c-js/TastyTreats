import{i as c,a as p}from"./vendor-Dj3mOgk7.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const i of s.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(a){if(a.ep)return;a.ep=!0;const s=r(a);fetch(a.href,s)}})();const v=document.querySelector(".mobile-menu"),y=document.querySelector(".burger-menu"),h=document.querySelector("#mobile-close");y.addEventListener("click",t=>{t.preventDefault(),v.style.display="flex"});h.addEventListener("click",t=>{t.preventDefault(),v.style.display="none"});document.addEventListener("DOMContentLoaded",()=>{const t=document.querySelectorAll(".input-switcher"),e=localStorage.getItem("theme");if(e){const r=e==="dark";r?document.body.classList.add("dark-theme"):document.body.classList.remove("dark-theme"),t.forEach(o=>{o.checked=r})}t.forEach(r=>{r.addEventListener("change",()=>{const o=r.checked;o?(document.body.classList.add("dark-theme"),localStorage.setItem("theme","dark")):(document.body.classList.remove("dark-theme"),localStorage.setItem("theme","light")),t.forEach(a=>{a.checked=o})})})});const f=document.getElementById("scrollToTopBtn");window.addEventListener("scroll",()=>{window.scrollY>300?f.style.display="block":f.style.display="none"});f.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"})});const l={BASE_URL:"https://tasty-treats-backend.p.goit.global/api",ENDPOINTS:{POPULAR:"/recipes/popular",RECIPE_DETAIL:"/recipes/",ORDERS:"/orders/add/"}},u=(t,e="")=>{console.error(`[${e}] Hata:`,t);const r=document.querySelector(".error-message");return r&&(r.textContent=`Veri yüklenirken hata oluştu: ${t.message}`,r.style.display="block"),null},d={async getFood(){try{return(await p.get(`${l.BASE_URL}${l.ENDPOINTS.POPULAR}`)).data}catch(t){return u(t,"getPopularRecipes")}},async getRecipeDetail(t){try{return(await p.get(`${l.BASE_URL}${l.ENDPOINTS.RECIPE_DETAIL}${t}`)).data}catch(e){return u(e,"getRecipeDetail")}},async createOrder(t){try{return(await p.post(`${l.BASE_URL}${l.ENDPOINTS.ORDERS}`,t)).data}catch(e){return u(e,"createOrder")}},async submitRating(t){try{return console.log(t.rating),console.log(t.email),(await p.patch(`${l.BASE_URL}/recipes/${t.recipeId}/rating`,{rate:t.rating,email:t.email})).data}catch(e){return u(e,"submitRating")}}},m={currentRecipeId:null,async openPopup(t,e){this.currentRecipeId=e;const r=document.querySelector(".popup");r.classList.remove("popup-food","popup-raiting","popup-order"),r.classList.add(`${t}`),r.style.display="block",document.body.style.overflow="hidden",this.resetPopupContent(),t==="popup-food"?await this.fillPopupContent(e):t==="popup-order"?(await this.fillPopupOrder(e),this.setupOrderFormListener()):t==="popup-raiting"&&(await this.fillRatingPopup(e),this.setupRatingListener())},resetPopupContent(){const t=document.querySelector(".popup-content");t.innerHTML=""},closePopup(){const t=document.querySelector(".popup-close"),e=document.querySelector(".popup");function r(){const o=document.querySelector(".popup-video");e.style.display="none",e.className="popup",document.body.style.overflow="auto",o.innerHTML=""}t.addEventListener("click",o=>{o.preventDefault(),r()}),document.addEventListener("keydown",o=>{o.key==="Escape"&&r()})},async fillPopupContent(t){try{const e=await d.getRecipeDetail(t);if(!e)return;const r=document.querySelector(".popup-content");r.innerHTML="";const o=new URL(e.youtube).searchParams.get("v"),s=(JSON.parse(localStorage.getItem("favoriteFoods"))||[]).includes(t),i=s?"Remove To Favorite":"Add to Favorite";r.innerHTML=`
        <h3 class="popup-title">${e.title}</h3>
        <div class="popup-video">
          <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/${o}"
            title=""
            frameborder="0"
            allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
        <div class="popup-tags-raiting">
            <ul class="popup-tag-list">
              ${e.tags.length>0?e.tags.map(n=>`<li class='tag-list-item'># ${n}</li>`).join(""):""}
            </ul>
            <div class="popup-raiting-food">
                <span class="popup-rainting-counter">
                    ${Math.ceil(e.rating*10)/10}
                </span>
                <div class="popup-starts">
                    ${this.getStars(e.rating)}
                </div>
                <span class="popup-time">
                    ${e.time} min
                </span>
            </div>
        </div>

        <ul class="popup-recipt">
            ${e.ingredients.map(n=>`
                <li class="popup-recipt-item">
                    <b>${n.name}</b>
                    <span>${n.measure}</span>
                </li>`).join("")}
        </ul>
        <div class="popup-desc">
            ${e.instructions}
        </div>

        <div class="popup-buttons">
            <button class="popup-green-btn"
            data-favorite="${s?"true":"false"}"
            data-id="${t}"
            id="addtofavotie"
            >${i}</button>
            <button class="popup-outline-green-btn"
              data-id="${t}"
              data-popup="popup-raiting">
              Give a rating
            </button>
        </div>
      `}catch(e){console.error("Popup içeriği yüklenirken hata:",e)}},async fillPopupOrder(t){try{const e=document.querySelector(".popup-content");e.innerHTML=`
      <h3 class="popup-title">ORDER NOW</h3>
      <form class="popup-order-form">
        <div class="form-row">
          <label for="name">Name</label>
          <input type="text" class="popup-input" id="name" required>
        </div>
        <div class="form-row">
          <label for="phone-number">Phone number</label>
          <input type="tel" class="popup-input" id="phone-number" required value="+380730000000"
                 placeholder="380730000000">
        </div>
        <div class="form-row">
          <label for="email">Email</label>
          <input type="email" class="popup-input" id="email" required>
        </div>
        <div class="form-row">
          <label for="user-comment">Comment</label>
          <textarea name="user_comment" id="user-comment" class="popup-input" required></textarea>
        </div>
        <button type="submit" class="popup-green-btn">Send</button>
      </form>
    `,setTimeout(()=>{this.setupOrderFormListener()},50)}catch(e){console.error("Order popup oluşturulurken hata:",e)}},async fillRatingPopup(t){try{const e=document.querySelector(".popup-content");e.innerHTML=`
        <h3 class="popup-title">Rating</h3>
        <div class="raiting">
            <span class="raiting-counter">0.0</span>
            <div class="raiting-stars">
                <i class="fa fa-star popup-star" data-value="1"></i>
                <i class="fa fa-star popup-star" data-value="2"></i>
                <i class="fa fa-star popup-star" data-value="3"></i>
                <i class="fa fa-star popup-star" data-value="4"></i>
                <i class="fa fa-star popup-star" data-value="5"></i>
            </div>
        </div>
        <form class="popup-order-form">
          <div class="form-row">
            <label for="email">Email</label>
            <input type="email" class="popup-input" id="email" pattern="([A-z0-9_.-]{1,})@([A-z0-9_.-]{1,}).([A-z]{2,8})" required />
          </div>
          <button type="submit" class="popup-green-btn">Send Rating</button>
        </form>
      `}catch(e){console.error("Rating popup oluşturulurken hata:",e)}},setupRatingListener(){const t=document.querySelectorAll(".raiting-stars .popup-star"),e=document.querySelector(".raiting-counter"),r=document.querySelector(".popup-order-form");let o=0;t.forEach(a=>{a.addEventListener("click",()=>{o=parseInt(a.getAttribute("data-value")),e.textContent=o.toFixed(1),this.updateStars(t,o)}),a.addEventListener("mouseover",()=>{const s=parseInt(a.getAttribute("data-value"));this.updateStars(t,s)}),a.addEventListener("mouseout",()=>{this.updateStars(t,o)})}),r&&r.addEventListener("submit",async a=>{a.preventDefault();const s=r.querySelector("#email").value.trim();if(!s){alert("Lütfen e-posta adresinizi girin");return}if(o===0){alert("Lütfen bir puan seçin");return}try{const i={recipeId:this.currentRecipeId,rating:o,email:s};if(await d.submitRating(i)){const g=document.querySelector(".popup");g.style.display="none",c.success({title:"Teşekkürler!",message:"Değerlendirmeniz için teşekkür ederiz!",position:"topRight",timeout:3e3})}}catch{c.success({title:"Hata!",message:"Bazı Şeyler Yanlış Gitti...",position:"topRight",timeout:3e3})}})},updateStars(t,e){t.forEach(r=>{parseInt(r.getAttribute("data-value"))<=e?r.classList.add("active"):r.classList.remove("active")})},setupOrderFormListener(){const t=document.querySelector(".popup-order-form");if(!t)return;t.replaceWith(t.cloneNode(!0));const e=document.querySelector(".popup-order-form"),r=e.querySelectorAll("input, textarea");r.forEach(o=>{o.addEventListener("input",()=>{this.validateField(o)}),o.addEventListener("blur",()=>{this.validateField(o)})}),e.addEventListener("submit",async o=>{o.preventDefault();let a=!0;if(r.forEach(i=>{this.validateField(i)||(a=!1)}),!a)return;const s={name:e.querySelector("#name").value.trim(),phone:e.querySelector("#phone-number").value.trim(),email:e.querySelector("#email").value.trim(),comment:e.querySelector("#user-comment").value.trim()};try{if(await d.createOrder(s)){const n=document.querySelector(".popup");n.style.display="none",c.success({title:"Teşekkürler!",message:"Siparişiniz Başarıyla Alındı!",position:"topRight",timeout:3e3})}}catch{c.error({title:"Hata!",message:"Sipariş gönderilirken hata oluştu",position:"topRight",timeout:3e3})}})},validateField(t){const e=t.value.trim();let r=!0,o="";switch(this.removeError(t),t.id){case"name":e?e.length<3&&(o="İsim en az 3 karakter olmalıdır",r=!1):(o="İsim alanı zorunludur",r=!1);break;case"phone-number":e?/^\+380\d{9}$/.test(e)||(o="Geçerli bir telefon numarası girin (örn. +380730000000)",r=!1):(o="Telefon numarası zorunludur",r=!1);break;case"email":e?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||(o="Geçerli bir e-posta adresi girin",r=!1):(o="E-posta adresi zorunludur",r=!1);break;case"user-comment":e||(o="Yorum alanı zorunludur",r=!1);break}return r||this.showError(t,o),r},showError(t,e){const r=document.createElement("div");r.className="error-message",r.style.color="red",r.style.fontSize="12px",r.style.marginTop="5px",r.textContent=e,t.parentNode.appendChild(r),t.style.borderColor="red"},removeError(t){const e=t.parentNode.querySelector(".error-message");e&&e.remove(),t.style.borderColor=""},setupPopupListeners(){document.body.addEventListener("click",async t=>{const e=t.target.closest("[data-popup][data-id]");if(!e)return;const r=e.getAttribute("data-id"),o=e.getAttribute("data-popup");await this.openPopup(o,r)})},getStars(t){let e="";const r=Math.floor(t),o=5;for(let a=0;a<o;a++)a<r?e+='<i class="fa fa-star popup-star active" aria-hidden="true"></i>':e+='<i class="fa fa-star popup-star" aria-hidden="true"></i>';return e},addFavoriteBtn(){document.addEventListener("click",t=>{const e=t.target.closest("#addtofavotie");if(!e)return;const r=e.dataset.id;if(e.dataset.favorite==="true"){let a=JSON.parse(localStorage.getItem("favoriteFoods"))||[];a=a.filter(i=>i!==r),localStorage.setItem("favoriteFoods",JSON.stringify(a));const s=document.querySelector(`.foodsList-item [data-id="${r}"]`);console.log(s),s&&(s.classList.remove("fa-heart"),s.classList.add("fa-heart-o"),e.textContent="Add to Favorite"),e.dataset.favorite="false"}else{let a=JSON.parse(localStorage.getItem("favoriteFoods"))||[];a.includes(r)||(a.push(r),localStorage.setItem("favoriteFoods",JSON.stringify(a)));const s=document.querySelector(`.foodsList-item [data-id="${r}"]`);console.log(s),s&&(s.classList.remove("fa-heart-o"),s.classList.add("fa-heart"),e.textContent="Remove To Favorite"),e.dataset.favorite="true"}})}},b={async init(){try{m.setupPopupListeners(),m.closePopup(),m.addFavoriteBtn()}catch(t){console.error("Uygulama başlatılırken bir hata oluştu:",t)}}};document.addEventListener("DOMContentLoaded",()=>b.init());
//# sourceMappingURL=popus-CbQYsb2V.js.map
