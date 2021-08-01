'use strict';

document.documentElement.classList.remove('nojs');

// Оптимизация ресайза окна
(function () {
  var throttle = function (type, name, obj) {
    obj = obj || window;
    var running = false;

    var func = function () {
      if (running) {
        return;
      }

      running = true;

      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();

// Переключаетль меню
(function () {
  if (document.querySelector('.burger')) {
    var MAX_WIDTH = 1023;

    var toggle = document.querySelector('.burger');
    var header = document.querySelector('.header');
    var menu = document.querySelector('.navigation');

    var changeButtonLabel = function () {
      if (toggle.classList.contains('burger__active')) {
        toggle.children[0].innerText = 'Закрыть меню';
      } else {
        toggle.children[0].innerText = 'Открыть меню';
      }
    };

    var goUp = function () {
      var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);

      if (top > 0) {
        window.scrollBy(0, -100);
      }
    };

    var toggleShowMenu = function () {
      document.documentElement.classList.toggle('page--100vh');
      header.classList.toggle('header--menu-open');
      toggle.classList.toggle('burger__active');
      menu.classList.toggle('navigation--menu-open');

      goUp();
      changeButtonLabel();
    };

    var onMenuLinkClick = function (evt) {
      if (evt.target.tagName === 'A') {
        toggleShowMenu();
      }
    };

    var onMenuButtonClick = function () {
      toggleShowMenu();
    };

    var menuToggleHandlers = function () {
      if (window.innerWidth > MAX_WIDTH) {
        toggle.removeEventListener('click', onMenuButtonClick);
        menu.removeEventListener('click', onMenuLinkClick);
      } else {
        toggle.addEventListener('click', onMenuButtonClick);
        menu.addEventListener('click', onMenuLinkClick);
      }
    };

    toggle.addEventListener('click', onMenuButtonClick);
    menu.addEventListener('click', onMenuLinkClick);

    menuToggleHandlers();

    window.addEventListener('optimizedResize', function () {
      menuToggleHandlers();
    });
  }
})();

// Свайпер
(function () {
  if (document.querySelector('.products-slider')) {
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 30,
      loop: true,

      navigation: {
        nextEl: '.products-slider__button-next',
        prevEl: '.products-slider__button-prev',
      },

      pagination: {
        el: '.products-slider__pagination',
        type: 'bullets',
        clickable: true,
        bulletClass: 'products-slider__bullet',
        bulletActiveClass: 'products-slider__bullet-active',

        renderBullet: function (index, className) {
          return (
            '<button class="' + className + '">' + (index + 1) + '</button>'
          );
        },
      },

      breakpoints: {

        1024: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 30,
        },
      },
    });

    var setCounterSlides = function () {
      var bullets = Array.from(document.querySelectorAll('.products-slider__bullet'));
      var currentCounter = document.querySelector('.products-slider__counter-current');
      var totalCounter = document.querySelector('.products-slider__counter-total');
      var currentBullet = bullets.findIndex(function (item) {
        return item.classList.contains('products-slider__bullet-active');
      }) + 1;

      totalCounter.textContent = bullets.length;
      currentCounter.textContent = currentBullet;
    };

    window.addEventListener('optimizedResize', setCounterSlides);
    window.addEventListener('load', setCounterSlides);
    swiper.on('slideChangeTransitionEnd', setCounterSlides);
  }

  if (document.querySelector('.card-gallery__big')) {
    var galleryThumbs = new Swiper('.card-gallery__thumbs', {
      enabled: false,

      breakpoints: {
        768: {
          enabled: true,
          spaceBetween: 14,
          slidesPerView: 3,
          freeMode: true,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
        },

        1024: {
          spaceBetween: 30,
          slidesPerView: 3,
          direction: 'vertical',
        },
      },
    });

    var galleryBig = new Swiper('.card-gallery__big', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 0,
      loop: true,

      pagination: {
        el: '.card-gallery__counter',
        type: 'fraction',
        clickable: false,
        currentClass: 'card-gallery__counter-current',
        totalClass: 'card-gallery__counter-total',

        renderFraction: function (currentClass, totalClass) {
          return (
            '<span class="' + currentClass + '"></span>' +
            'of' +
            '<span class="' + totalClass + '"></span>'
          );
        },
      },

      thumbs: {
        swiper: galleryThumbs
      }
    });
  }
})();

// Аккордеон
(function () {
  if (document.querySelector('.accordeon')) {
    var accordeon = document.querySelector('.accordeon');
    var accordeonItems = accordeon.querySelectorAll('.accordeon__item');
    var accordeonToggle = accordeon.querySelectorAll('.accordeon__toggle');

    accordeonToggle.forEach(function (it, i) {
      it.addEventListener('click', function () {
        accordeonItems[i].classList.toggle('accordeon__open');
      });
    });
  }
})();

// Показ модального окна
(function () {

  // Открытыие модального окна
  var showModal = function (element) {
    document.documentElement.classList.add('page--100vh');
    element.classList.add('active-modal');

    document.addEventListener('keydown', onModalEscPress);
    element.addEventListener('click', onOverlayClick);
  };

  // Закрытие модального окна
  var closeModal = function () {
    var element = document.querySelector('.active-modal');

    document.documentElement.classList.remove('page--100vh');
    element.classList.remove('active-modal');

    document.removeEventListener('keydown', onModalEscPress);
  };

  var onOverlayClick = function (evt) {
    if (evt.target.classList.contains('active-modal')) {
      closeModal();
    }
  };

  // Нажатие на Esc закрывает окно
  var onModalEscPress = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModal();
    }
  };

  if (document.querySelector('#filter-modal')) {
    var filterModal = document.querySelector('#filter-modal');
    var filterOpenButton = document.querySelector('#filter-button');
    var filterCloseButton = filterModal.querySelector('#filter-close');

    filterOpenButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      showModal(filterModal);
    });

    filterCloseButton.addEventListener('click', function () {
      closeModal();
    });
  }

  if (document.querySelector('#add-item-modal')) {
    var addItemModal = document.querySelector('#add-item-modal');
    var addItemOpenButton = document.querySelector('#add-item-button');
    var addItemCloseButton = addItemModal.querySelector('.modal__close-button');

    addItemOpenButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      showModal(addItemModal);
    });

    addItemCloseButton.addEventListener('click', function () {
      closeModal();
    });
  }

  if (document.querySelector('#login-modal')) {
    var loginModal = document.querySelector('#login-modal');
    var loginOpenButton = document.querySelector('#login-button');
    var loginCloseButton = loginModal.querySelector('.modal__close-button');
    var loginField = loginModal.querySelector('#login-field');
    var isStorageSupport = true;
    var storageEmail = '';

    try {
      storageEmail = localStorage.getItem('email');
    } catch (err) {
      isStorageSupport = false;
    }

    var showLoginModal = function () {
      showModal(loginModal);
      var loginPassword = loginModal.querySelector('#password-field');

      if (storageEmail) {
        loginField.value = storageEmail;
        loginPassword.focus();
      } else {
        loginField.focus();
      }
    };

    loginOpenButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      showLoginModal(loginModal);
    });

    loginCloseButton.addEventListener('click', function () {
      closeModal();
    });
  }
})();
