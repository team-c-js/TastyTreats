import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_CONFIG = {
  BASE_URL: 'https://tasty-treats-backend.p.goit.global/api',
  ENDPOINTS: {
    POPULAR: '/recipes/popular',
    RECIPE_DETAIL: '/recipes/',
    ORDERS: '/orders/add/',
  },
};

const handleError = (error, context = '') => {
  console.error(`[${context}] Hata:`, error);

  const errorContainer = document.querySelector('.error-message');
  if (errorContainer) {
    errorContainer.textContent = `Veri yüklenirken hata oluştu: ${error.message}`;
    errorContainer.style.display = 'block';
  }

  return null;
};

const ApiService = {
  async getFood() {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.POPULAR}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, 'getPopularRecipes');
    }
  },

  async getRecipeDetail(recipeId) {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECIPE_DETAIL}${recipeId}`
      );
      return response.data;
    } catch (error) {
      return handleError(error, 'getRecipeDetail');
    }
  },

  async createOrder(orderData) {
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDERS}`,
        orderData
      );
      return response.data;
    } catch (error) {
      return handleError(error, 'createOrder');
    }
  },

  async submitRating(ratingData) {
    try {
      console.log(ratingData.rating);
      console.log(ratingData.email);
      const response = await axios.patch(
        `${API_CONFIG.BASE_URL}/recipes/${ratingData.recipeId}/rating`,
      {
        rate: ratingData.rating,
        email: ratingData.email,
      },

      );
      return response.data;
    } catch (error) {
      return handleError(error, 'submitRating');
    }
  }
};

const UIManager = {
  currentRecipeId: null,

  async openPopup(popupType, recipeId) {
    this.currentRecipeId = recipeId;
    const popup = document.querySelector('.popup');
    popup.classList.remove('popup-food', 'popup-raiting', 'popup-order');
    popup.classList.add(`${popupType}`);
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
    this.resetPopupContent();

    if(popupType === 'popup-food'){
      await this.fillPopupContent(recipeId);
    }else if(popupType === 'popup-order'){
      await this.fillPopupOrder(recipeId);
      this.setupOrderFormListener();
    }else if(popupType === 'popup-raiting'){
      await this.fillRatingPopup(recipeId);
      this.setupRatingListener();
    }
  },

  resetPopupContent() {
    const popup = document.querySelector('.popup-content');
    popup.innerHTML = '';
  },

  closePopup() {
    const closeBtn = document.querySelector('.popup-close');

    const popup = document.querySelector('.popup');
    function close(){
      const video = document.querySelector('.popup-video');
      popup.style.display = 'none';
      popup.className = 'popup';
      document.body.style.overflow = 'auto';
      video.innerHTML = '';
    }
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          close();
        }
      });
  },

  async fillPopupContent(recipeId) {
    try {
      const recipe = await ApiService.getRecipeDetail(recipeId);
      if (!recipe) return;

      const popup = document.querySelector('.popup-content');
      popup.innerHTML = '';
      const videoId = new URL(recipe.youtube).searchParams.get("v");
      const favorites = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
      const isFavorite = favorites.includes(recipeId);
      const btnText = isFavorite ? 'Remove To Favorite' : 'Add to Favorite';
      popup.innerHTML = `
        <h3 class="popup-title">${recipe.title}</h3>
        <div class="popup-video">
          <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/${videoId}"
            title=""
            frameborder="0"
            allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
          </iframe>
        </div>
        <div class="popup-tags-raiting">
            <ul class="popup-tag-list">
              ${recipe.tags.length > 0
                  ? recipe.tags.map(tag => `<li class='tag-list-item'># ${tag}</li>`).join('')
                  : ''}
            </ul>
            <div class="popup-raiting-food">
                <span class="popup-rainting-counter">
                    ${Math.ceil(recipe.rating * 10) / 10}
                </span>
                <div class="popup-starts">
                    ${this.getStars(recipe.rating)}
                </div>
                <span class="popup-time">
                    ${recipe.time} min
                </span>
            </div>
        </div>

        <ul class="popup-recipt">
            ${recipe.ingredients.map(ing => `
                <li class="popup-recipt-item">
                    <b>${ing.name}</b>
                    <span>${ing.measure}</span>
                </li>`
            ).join('')}
        </ul>
        <div class="popup-desc">
            ${recipe.instructions}
        </div>

        <div class="popup-buttons">
            <button class="popup-green-btn"
            data-favorite="${isFavorite ? 'true' : 'false'}"
            data-id="${recipeId}"
            id="addtofavotie"
            >${btnText}</button>
            <button class="popup-outline-green-btn"
              data-id="${recipeId}"
              data-popup="popup-raiting">
              Give a rating
            </button>
        </div>
      `;

    } catch (error) {
      console.error('Popup içeriği yüklenirken hata:', error);
    }
  },

  async fillPopupOrder(recipeId) {
  try {
    const popup = document.querySelector('.popup-content');
    popup.innerHTML = `
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
    `;
    setTimeout(() => {
      this.setupOrderFormListener();
    }, 50);
  } catch(error) {
    console.error('Order popup oluşturulurken hata:', error);
  }
},

  async fillRatingPopup(recipeId) {
    try {
      const popup = document.querySelector('.popup-content');
      popup.innerHTML = `
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
      `;
    } catch(error) {
      console.error('Rating popup oluşturulurken hata:', error);
    }
  },

  setupRatingListener() {
    const stars = document.querySelectorAll('.raiting-stars .popup-star');
    const ratingCounter = document.querySelector('.raiting-counter');
    const ratingForm = document.querySelector('.popup-order-form');
    let currentRating = 0;

    stars.forEach(star => {
      star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-value'));
        ratingCounter.textContent = currentRating.toFixed(1);
        this.updateStars(stars, currentRating);
      });

      star.addEventListener('mouseover', () => {
        const hoverRating = parseInt(star.getAttribute('data-value'));
        this.updateStars(stars, hoverRating);
      });

      star.addEventListener('mouseout', () => {
        this.updateStars(stars, currentRating);
      });
    });

    // Form gönderimi
    if (ratingForm) {
      ratingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = ratingForm.querySelector('#email').value.trim();


        if (!email) {
          alert('Lütfen e-posta adresinizi girin');
          return;
        }

        if (currentRating === 0) {
          alert('Lütfen bir puan seçin');
          return;
        }

        try {
          const ratingData = {
            recipeId: this.currentRecipeId,
            rating: currentRating,
            email: email
          };

          const result = await ApiService.submitRating(ratingData);
          if (result) {

            const popup = document.querySelector('.popup');
            popup.style.display = 'none';
            iziToast.success({
              title: 'Teşekkürler!',
              message: 'Değerlendirmeniz için teşekkür ederiz!',
              position: 'topRight',
              timeout: 3000,
            });

          }
        } catch (error) {
          iziToast.success({
              title: 'Hata!',
              message: 'Bazı Şeyler Yanlış Gitti...',
              position: 'topRight',
              timeout: 3000,
            });
        }
      });
    }
  },

  updateStars(stars, activeCount) {
    stars.forEach(star => {
      const value = parseInt(star.getAttribute('data-value'));
      if (value <= activeCount) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  },

  setupOrderFormListener() {
  const orderForm = document.querySelector('.popup-order-form');
  if (!orderForm) return;
  orderForm.replaceWith(orderForm.cloneNode(true));
  const newOrderForm = document.querySelector('.popup-order-form');

  const inputs = newOrderForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      this.validateField(input);
    });

    input.addEventListener('blur', () => {
      this.validateField(input);
    });
  });

  newOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    const formData = {
      name: newOrderForm.querySelector('#name').value.trim(),
      phone: newOrderForm.querySelector('#phone-number').value.trim(),
      email: newOrderForm.querySelector('#email').value.trim(),
      comment: newOrderForm.querySelector('#user-comment').value.trim()
    };

    try {
      const result = await ApiService.createOrder(formData);
      if (result) {
        const popup = document.querySelector('.popup');
        popup.style.display = 'none';
        iziToast.success({
          title: 'Teşekkürler!',
          message: 'Siparişiniz Başarıyla Alındı!',
          position: 'topRight',
          timeout: 3000,
        });
      }
    } catch (error) {
      iziToast.error({
        title: 'Hata!',
        message: 'Sipariş gönderilirken hata oluştu',
        position: 'topRight',
        timeout: 3000,
      });
    }
  });
},

validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  this.removeError(field);

  switch (field.id) {
    case 'name':
      if (!value) {
        errorMessage = 'İsim alanı zorunludur';
        isValid = false;
      } else if (value.length < 3) {
        errorMessage = 'İsim en az 3 karakter olmalıdır';
        isValid = false;
      }
      break;

    case 'phone-number':
      if (!value) {
        errorMessage = 'Telefon numarası zorunludur';
        isValid = false;
      } else if (!/^\+380\d{9}$/.test(value)) {
        errorMessage = 'Geçerli bir telefon numarası girin (örn. +380730000000)';
        isValid = false;
      }
      break;

    case 'email':
      if (!value) {
        errorMessage = 'E-posta adresi zorunludur';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessage = 'Geçerli bir e-posta adresi girin';
        isValid = false;
      }
      break;

    case 'user-comment':
      if (!value) {
        errorMessage = 'Yorum alanı zorunludur';
        isValid = false;
      }
      break;
  }

  if (!isValid) {
    this.showError(field, errorMessage);
  }

  return isValid;
},

showError(field, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.color = 'red';
  errorDiv.style.fontSize = '12px';
  errorDiv.style.marginTop = '5px';
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);
  field.style.borderColor = 'red';
},

removeError(field) {
  const errorDiv = field.parentNode.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.remove();
  }
  field.style.borderColor = '';
},


  setupPopupListeners() {
    document.body.addEventListener('click', async (event) => {
      const trigger = event.target.closest('[data-popup][data-id]');
      if (!trigger) return;

      const recipeId = trigger.getAttribute('data-id');
      const popupType = trigger.getAttribute('data-popup');
      await this.openPopup(popupType, recipeId);
    });
  },

  getStars(star) {
    let starsHtml = ``;
    const raitingStar = Math.floor(star);
    const TotalStars = 5;
    for (let i = 0; i < TotalStars; i++) {
      if (i < raitingStar) {
        starsHtml += `<i class="fa fa-star popup-star active" aria-hidden="true"></i>`;
      } else {
        starsHtml += `<i class="fa fa-star popup-star" aria-hidden="true"></i>`;
      }
    }
    return starsHtml;
  },
  addFavoriteBtn(){
    document.addEventListener('click', (e)=> {
        const btn = e.target.closest('#addtofavotie');
        if(!btn) return;
        const recipeId = btn.dataset.id;
        const isFavorite = btn.dataset.favorite === 'true';

        if(isFavorite){
          let favoriteFoods = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
          favoriteFoods = favoriteFoods.filter(id => id !== recipeId);
          localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));

          const listItem = document.querySelector(`.foodsList-item [data-id="${recipeId}"]`);
          console.log(listItem);
          if (listItem) {
              listItem.classList.remove('fa-heart');
              listItem.classList.add('fa-heart-o');
              btn.textContent = 'Add to Favorite';
          }
          btn.dataset.favorite = 'false';
        }else{
          let favoriteIds = JSON.parse(localStorage.getItem('favoriteFoods')) || [];

          if (!favoriteIds.includes(recipeId)) {
            favoriteIds.push(recipeId);
            localStorage.setItem('favoriteFoods', JSON.stringify(favoriteIds));
          }

          const listItem = document.querySelector(`.foodsList-item [data-id="${recipeId}"]`);
          console.log(listItem);
          if (listItem) {
              listItem.classList.remove('fa-heart-o');
              listItem.classList.add('fa-heart');
              btn.textContent = 'Remove To Favorite';
          }
          btn.dataset.favorite = 'true';
        }
    });
  }
};

const PopupApp = {
  async init() {
    try {
      UIManager.setupPopupListeners();
      UIManager.closePopup();
      UIManager.addFavoriteBtn();
    } catch (error) {
      console.error('Uygulama başlatılırken bir hata oluştu:', error);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => PopupApp.init());