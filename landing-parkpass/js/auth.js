(function ($) {
  var STORAGE_KEY = 'mirihaefit-auth-logged-in';
  var state = {
    loggedIn: window.localStorage.getItem(STORAGE_KEY) === '1',
    dDay: 12,
  };

  function setModalActive(modalClass) {
    $('.modal.active').removeClass('active');
    $('body').addClass('modal-poped');
    $('.modal.' + modalClass).addClass('active');
  }

  function closeModal() {
    $('.modal.active').removeClass('active');
    $('body').removeClass('modal-poped');
  }

  function closeDropdowns() {
    $('.dropdown').children('ul').slideUp('fast');
  }

  function persistState() {
    window.localStorage.setItem(STORAGE_KEY, state.loggedIn ? '1' : '0');
  }

  function renderProfileMenu() {
    var html;

    if (state.loggedIn) {
      html = [
        '<li><a href="#" data-auth-action="purchase"><span class="menu-icon material-symbols-sharp" aria-hidden="true">shopping_bag</span><span class="menu-label">이용권 구매</span></a></li>',
        '<li class="logout"><a href="#" data-auth-action="logout"><span class="menu-icon material-symbols-sharp" aria-hidden="true">logout</span><span class="menu-label">로그아웃</span></a></li>',
      ].join('');
    } else {
      html = [
        '<li class="note"><span>회원가입은 앱에서 진행해주세요.</span></li>',
        '<li><a href="#" data-auth-action="trainer-login"><span class="menu-icon material-symbols-sharp" aria-hidden="true">login</span><span class="menu-label">강사 로그인</span></a></li>',
      ].join('');
    }

    $('[data-auth-menu]').html(html);
  }

  function setLoggedIn(nextValue) {
    state.loggedIn = nextValue;
    persistState();
    renderProfileMenu();
  }

  function openAuthFlow(modalClass) {
    setModalActive(modalClass);
  }

  function openPurchaseFlow() {
    if (!state.loggedIn) {
      openAuthFlow('auth-login');
      return;
    }

    setModalActive('purchase');
  }

  function openProfileFlow() {
    if (state.loggedIn) {
      openPurchaseFlow();
      return;
    }

    openAuthFlow('auth-login');
  }

  function openModalFromQuery() {
    var params = new URLSearchParams(window.location.search);

    if (params.get('modal') !== 'on') {
      return;
    }

    var idx = params.get('idx');
    var modalClass = idx;

    if (/^\d+$/.test(idx || '')) {
      var modalMap = ['privacy', 'auth-login', 'auth-signup', 'purchase', 'faq'];
      modalClass = modalMap[parseInt(idx, 10) - 1] || modalMap[0];
    }

    if (!modalClass) {
      modalClass = 'auth-login';
    }

    if (modalClass === 'purchase' && !state.loggedIn) {
      modalClass = 'auth-login';
    }

    openAuthFlow(modalClass);
  }

  $(function () {
    renderProfileMenu();
    openModalFromQuery();

    $(document).on('click', '.purchase-trigger', function (e) {
      e.preventDefault();
      openPurchaseFlow();
    });

    $(document).on('click', '.profile-button', function (e) {
      if (!state.loggedIn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeDropdowns();
        openAuthFlow('auth-login');
      }
    });

    $(document).on('click', '[data-auth-action]', function (e) {
      var action = $(this).data('auth-action');

      e.preventDefault();
      closeDropdowns();

      if (action === 'trainer-login') {
        openAuthFlow('auth-login');
        return;
      }

      if (action === 'purchase' || action === 'ticket-info') {
        openPurchaseFlow();
        return;
      }

      if (action === 'logout') {
        setLoggedIn(false);
        closeModal();
      }
    });

    $(document).on('click', '.auth-login-submit, .auth-signup-submit', function (e) {
      e.preventDefault();
      setLoggedIn(true);
      closeDropdowns();
      setModalActive('purchase');
    });

    $(document).on('click', '.auth-login-open', function (e) {
      e.preventDefault();
      openAuthFlow('auth-login');
    });

    $(document).on('click', '.purchase-buy', function (e) {
      e.preventDefault();
      alert('이용권 구매는 준비중입니다.');
    });

  });
})(jQuery);
