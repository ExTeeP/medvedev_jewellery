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

  var showerMenu = function () {
    document.documentElement.classList.toggle('page--100vh');
    header.classList.toggle('header--menu-open');
    toggle.classList.toggle('burger__active');
    menu.classList.toggle('navigation--menu-open');

    changeButtonLabel();
  };

  var onMenuLinkClick = function (evt) {
    if (evt.target.tagName === 'A') {
      showerMenu();
    }
  };

  var onMenuButtonClick = function () {
    showerMenu();
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
})();

// Плавная прокрутка по якорям
(function () {
  var pageAnchors = document.querySelectorAll('a[href^="#block-"]');

  pageAnchors.forEach(function (link) {

    link.addEventListener('click', function (evt) {
      evt.preventDefault();

      var blockID = link.getAttribute('href');
      document.querySelector(blockID).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
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
})();
