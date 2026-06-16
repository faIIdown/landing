var scrollMotion = null;

function Motion__getSecondsValue(element, propertyName, fallback) {
  var rawValue = window.getComputedStyle(element).getPropertyValue(propertyName).trim();
  var value = parseFloat(rawValue);

  if (!value) {
    return fallback;
  }

  return rawValue.indexOf('ms') > -1 ? value / 1000 : value;
}

function Motion__initWeatherSwiper() {
  if (typeof Swiper === 'undefined') {
    return;
  }

  document.querySelectorAll('.rounding-card .weather.swiper').forEach(function (weather) {
    var card = weather.closest('.rounding-card');
    var sec = Motion__getSecondsValue(card, '--sec', 3);

    new Swiper(weather, {
      direction: 'vertical',
      loop: true,
      allowTouchMove: false,
      speed: Math.min(sec * 160, 600),
      autoplay: {
        delay: sec * 1000,
        disableOnInteraction: false,
      },
      on: {
        init: function (swiper) {
          card.classList.toggle('is-weather-disabled', swiper.realIndex >= 3);
        },
        slideChange: function (swiper) {
          card.classList.toggle('is-weather-disabled', swiper.realIndex >= 3);
        },
      },
    });
  });
}

function Motion__refresh() {
  if (typeof ScrollTrigger === 'undefined') {
    return;
  }

  ScrollTrigger.refresh();
}

function Motion__revealUpSequence(targets, trigger, start) {
  var items = gsap.utils.toArray(targets);

  if (!items.length) {
    return;
  }

  gsap.set(items, {
    y: 110, // 등장 전 아래로 밀어둘 거리. 클수록 더 깊게 올라오는 느낌.
    autoAlpha: 0, // opacity + visibility를 함께 제어해서 깜빡임을 줄임.
    force3D: true, // GPU 합성을 유도해 스크롤 모션 떨림을 줄임.
    backfaceVisibility: 'hidden', // transform 중 잔상/깜빡임 방지.
  });

  gsap.to(items, {
    y: 0, // 최종 위치. 0이면 원래 CSS 위치로 돌아감.
    autoAlpha: 1, // 최종 표시 상태.
    duration: 1.05, // 등장 시간. 클수록 느리고 부드러움.
    ease: 'power4.out', // 초반 빠르고 후반 천천히 멈추는 느낌.
    stagger: {
      each: 0.13, // 아이템 사이 등장 간격. 클수록 순차감이 강함.
      from: 'start', // DOM 순서대로 시작. 그리드에서는 왼쪽에서 오른쪽 흐름.
      grid: 'auto', // 그리드 배치를 자동 인식해서 순서를 계산.
    },
    scrollTrigger: {
      trigger: trigger, // 이 요소가 기준 위치에 오면 애니메이션 시작.
      start: start, // 예: 'top 78%'. 숫자가 클수록 더 일찍 시작.
      once: false, // 한 번 등장한 뒤 스크롤을 되돌려도 다시 숨기지 않음.
    },
  });
}

function Motion__revealUpScrollSequence(targets, trigger, options) {
  var items = gsap.utils.toArray(targets);

  if (!items.length) {
    return;
  }

  var vars = options || {};

  gsap.set(items, {
    y: vars.y || 96, // 순차 등장 전 아래로 밀어둘 거리.
    autoAlpha: 0, // 시작 표시 상태.
    force3D: true, // transform 안정화.
    backfaceVisibility: 'hidden', // transform 중 잔상/깜빡임 방지.
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: trigger, // 카드 묶음 전체를 스크롤 구간 기준으로 사용.
        start: vars.start || Motion__startAt('top 82%', 'top 92%'), // 첫 카드 등장 시작 위치.
        end: vars.end || Motion__startAt('bottom 56%', 'bottom 78%'), // 마지막 카드까지 등장할 스크롤 구간.
        scrub: vars.scrub || 0.8, // 스크롤 위치에 따라 순차 진행.
      },
    })
    .to(items, {
      y: 0, // 최종 위치.
      autoAlpha: 1, // 최종 표시 상태.
      duration: vars.duration || 0.85, // 카드 하나가 올라오는 시간.
      ease: vars.ease || 'power3.out', // 기본 감속 곡선.
      stagger: {
        each: vars.each || 0.38, // 카드가 하나씩 등장하는 간격.
        from: 'start', // DOM 순서대로 1개씩 등장.
      },
    });
}

function Motion__revealUp(targets, options) {
  var items = gsap.utils.toArray(targets);

  if (!items.length) {
    return;
  }

  var vars = options || {};
  var toVars = {
    y: 0, // 최종 위치.
    autoAlpha: 1, // 최종 표시 상태.
    duration: vars.duration || 0.9, // 기본 등장 시간.
    ease: vars.ease || 'power3.out', // 기본 감속 곡선.
    stagger: vars.stagger || 0.08, // 여러 요소일 때 기본 등장 간격.
    overwrite: 'auto', // 같은 요소에 겹친 애니메이션이 있으면 자연스럽게 정리.
  };

  if (vars.scrollTrigger) {
    toVars.scrollTrigger = vars.scrollTrigger; // 호출부에서 넘긴 ScrollTrigger 설정을 그대로 사용.
  }

  gsap.fromTo(
    items,
    {
      y: vars.y || 58, // 등장 전 아래로 밀어둘 거리.
      autoAlpha: 0, // 시작 표시 상태.
      force3D: true, // GPU 합성 유도.
    },
    toVars,
  );
}

function Motion__isMobile() {
  return window.matchMedia('(max-width: 720px)').matches;
}

function Motion__startAt(desktopStart, mobileStart) {
  return function () {
    return Motion__isMobile() ? mobileStart : desktopStart;
  };
}

function Motion__init() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || scrollMotion) {
    document.documentElement.classList.remove('motion-enabled');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true, // 모바일 주소창 높이 변화로 refresh가 자주 발생하는 것 방지.
  });
  ScrollTrigger.defaults({
    invalidateOnRefresh: true, // 리사이즈/refresh 때 함수형 값들을 다시 계산.
  });

  scrollMotion = gsap.matchMedia();

  scrollMotion.add('(prefers-reduced-motion: no-preference)', function () {
    // 모션 감소 설정이 꺼진 사용자에게만 기본 모션 적용.
    gsap.set('.page-intro .img, .primary-hero__device, .primary-hero__screen, .primary-hero__scroll img, .screenshot, .page-trainer .phone img', {
      transformOrigin: '50% 50%', // scale/transform 기준점.
      force3D: true, // transform 대상 GPU 합성 유도.
      backfaceVisibility: 'hidden', // transform 중 깜빡임 방지.
      willChange: 'transform, opacity, background-position', // 브라우저에 변경될 속성을 미리 알려줌.
    });

    var introReveal = Motion__isMobile() ? { y: 28, duration: 0.62, stagger: 0.05 } : { y: 56, duration: 1, stagger: 0.1 };

    Motion__revealUp('.page-intro .title .left > *', {
      y: introReveal.y, // 히어로 텍스트가 올라오는 거리. 모바일은 더 빨리 보이도록 짧게 설정.
      duration: introReveal.duration, // 히어로 텍스트 등장 시간. 모바일은 대기감을 줄임.
      stagger: introReveal.stagger, // 히어로 텍스트 줄별 등장 간격.
    });

    Motion__revealUp('.overview h2, .overview .text h3, .overview__questions p, .overview__statement', {
      y: 58, // overview 문장들이 올라오는 거리.
      duration: 0.9, // overview 등장 시간.
      stagger: 0.08, // overview 문장 사이 간격.
      scrollTrigger: {
        trigger: '.overview', // overview 영역 기준.
        start: Motion__startAt('top 78%', 'top 92%'), // 모바일에서는 더 이른 시점에 overview 등장.
        once: false, // 재진입 시 반복하지 않음.
      },
    });

    gsap.utils.toArray('.primary-hero__section').forEach(function (section) {
      var copyItems = section.querySelectorAll('.primary-hero__copy .eyebrow, .primary-hero__copy h2, .primary-hero__copy .text, .primary-highlights li');
      var device = section.querySelector('.primary-hero__device');
      var screenScroll = section.querySelector('.primary-hero__scroll');

      Motion__revealUp(copyItems, {
        y: 48, // primary hero 텍스트/하이라이트가 올라오는 거리.
        duration: 0.85, // primary hero 텍스트 등장 시간.
        stagger: 0.07, // 텍스트와 리스트 항목 간 등장 간격.
        scrollTrigger: {
          trigger: section, // 각 primary hero 섹션 기준.
          start: Motion__startAt('top 72%', 'top 92%'), // 모바일에서는 더 이른 시점에 hero 등장.
          once: false, // 반복 방지.
        },
      });

      if (device) {
        gsap.fromTo(
          device,
          {
            y: 80, // 목업 시작 위치. 양수면 아래에서 시작.
            scale: 1, // 목업 시작 크기.
            force3D: true, // transform 안정화.
          },
          {
            y: -70, // 목업 끝 위치. 음수면 위로 이동.
            scale: 1, // 목업 끝 크기.
            ease: 'none', // 스크롤 위치와 1:1로 연결.
            force3D: true, // transform 안정화.
            overwrite: 'auto', // 중복 애니메이션 정리.
            scrollTrigger: {
              trigger: section, // 섹션 전체 기준으로 목업 패럴랙스 진행.
              start: 'top bottom', // 섹션 top이 화면 하단에 닿을 때 시작.
              end: 'bottom top', // 섹션 bottom이 화면 상단에 닿을 때 종료.
              scrub: 1.2, // 스크롤 추적 지연감. 클수록 부드럽고 늦게 따라옴.
            },
          },
        );
      }

      if (screenScroll && device) {
        gsap.fromTo(
          screenScroll,
          { scrollTop: 0 }, // 목업 내부 스크롤 시작 위치.
          {
            scrollTop: function () {
              var maxScroll = Math.max(0, screenScroll.scrollHeight - screenScroll.clientHeight); // 실제로 스크롤 가능한 최대 거리.
              var contentLimit = maxScroll * 0.22; // 전체 스크롤 가능 거리 중 사용할 비율. 클수록 더 많이 내려감.
              var viewportLimit = screenScroll.clientHeight * 0.35; // 화면 높이 기준 제한값. 클수록 더 많이 내려감.
              return Math.min(contentLimit, viewportLimit); // 두 제한값 중 작은 값으로 과한 내부 스크롤을 방지.
            },
            ease: 'none', // 스크롤과 1:1로 연결.
            overwrite: 'auto', // 중복 애니메이션 정리.
            scrollTrigger: {
              trigger: device, // 목업 기기 기준.
              start: function () {
                var headerOffset = typeof getHeaderOffset === 'function' ? getHeaderOffset() : 0;
                var hiddenOffset = device.offsetHeight / 4; // 목업이 1/4 가려진 뒤 내부 스크롤 시작.
                return 'top ' + (headerOffset - hiddenOffset) + 'px'; // GNB 높이와 가려진 높이를 합산한 시작점.
              },
              end: 'bottom top', // 목업 bottom이 화면 상단에 닿을 때 종료.
              scrub: 1.2, // 내부 스크롤 추적 지연감.
            },
          },
        );
      }
    });

    Motion__revealUpScrollSequence('.strength > li', '.strength', {
      y: 96, // strength 카드가 올라오는 거리.
      duration: 0.85, // 카드별 등장 시간.
      each: 0.38, // 한 줄이 아니라 li 하나씩 순차 등장하게 하는 간격.
      scrub: 0.8, // 스크롤 위치에 맞춰 순차 진행.
      start: Motion__startAt('top 82%', 'top 92%'), // 첫 카드 등장 시작 위치.
      end: Motion__startAt('bottom 76%', 'bottom 98%'), // 마지막 카드까지 등장할 스크롤 구간.
    });

    Motion__revealUp('.page-trainer .title .eyebrow, .page-trainer .title h1, .page-trainer .title .text, .page-trainer .btnset', {
      y: 58, // trainer 텍스트가 올라오는 거리.
      duration: 1.1, // trainer 텍스트 등장 시간.
      stagger: 0.08, // trainer 텍스트 사이 등장 간격.
      scrollTrigger: {
        trigger: '.page-trainer', // trainer 섹션 기준.
        start: Motion__startAt('top 72%', 'top 90%'), // 모바일에서는 더 이른 시점에 trainer 등장.
        once: false, // 반복 방지.
      },
    });

    Motion__revealUp('.page-support .split > li, .page-download .title > *', {
      y: 58, // support/download 요소가 올라오는 거리.
      duration: 0.9, // support/download 등장 시간.
      stagger: 0.08, // 요소 간 등장 간격.
      scrollTrigger: {
        trigger: '.page-support', // support 섹션 기준.
        start: Motion__startAt('top 72%', 'top 90%'), // 모바일에서는 더 이른 시점에 support/download 등장.
        once: false, // 반복 방지.
      },
    });

    Motion__revealUp('.page-notice .title', {
      y: 58, // news 제목이 올라오는 거리.
      duration: 0.9, // news 제목 등장 시간.
      scrollTrigger: {
        trigger: '.page-notice', // news 섹션 기준.
        start: Motion__startAt('top 76%', 'top 92%'), // 모바일에서는 더 이른 시점에 news 제목 등장.
        once: false, // 반복 방지.
      },
    });
    Motion__revealUpSequence(
      '.page-notice .item', // 순차 등장할 news 카드.
      '.page-notice .news', // news 리스트 묶음을 시작 기준으로 사용.
      Motion__startAt('top 78%', 'top 92%'), // 모바일에서는 더 이른 시점에 news 카드 등장.
    );

    gsap.to('.overview__questions p', {
      color: 'rgba(44, 46, 61, 0.6)', // 스크롤되며 진해질 최종 문장 색.
      stagger: 0.12, // 문장별 색 변화 간격.
      ease: 'none', // 스크롤과 1:1로 연결.
      scrollTrigger: {
        trigger: '.overview__questions', // overview 질문 문장 묶음 기준.
        start: Motion__startAt('top 72%', 'top 90%'), // 모바일에서는 더 이른 시점에 색 변화 시작.
        end: 'bottom 38%', // 묶음 bottom이 화면 38% 지점에 오면 색 변화 종료.
        scrub: 1, // 색 변화가 스크롤을 따라오는 지연감.
      },
    });
  });

  scrollMotion.add('(prefers-reduced-motion: no-preference)', function () {
    // 모바일 포함 전체 해상도에서 이미지/폰 패럴랙스 적용.
    gsap.fromTo(
      '.page-intro .img',
      {
        backgroundPosition: '50% 58%', // intro 이미지 시작 배경 위치.
        scale: 1, // intro 이미지 시작 확대율.
        force3D: true, // transform 안정화.
      },
      {
        backgroundPosition: '50% 0', // intro 이미지 끝 배경 위치.
        scale: 1, // intro 이미지 끝 확대율.
        force3D: true, // transform 안정화.
        overwrite: 'auto', // 중복 애니메이션 정리.
        scrollTrigger: {
          trigger: '.page-intro', // intro 섹션 기준.
          start: 'top top', // 섹션 top이 화면 top에 닿으면 시작.
          end: 'bottom top', // 섹션 bottom이 화면 top에 닿으면 종료.
          scrub: 1.1, // 스크롤 추적 지연감.
        },
      },
    );

    gsap.fromTo(
      '.screenshot',
      {
        backgroundPosition: '0& center', // screenshot 배경 시작 위치.
      },
      {
        backgroundPosition: '100% center', // screenshot 배경 끝 위치.
        ease: 'none', // 스크롤과 1:1로 연결.
        overwrite: 'auto', // 중복 애니메이션 정리.
        scrollTrigger: {
          trigger: '.screenshot', // screenshot 영역 기준.
          start: 'top bottom', // 영역 top이 화면 하단에 닿으면 시작.
          end: 'bottom top', // 영역 bottom이 화면 상단에 닿으면 종료.
          scrub: 1.2, // 스크롤 추적 지연감.
        },
      },
    );

    var trainerPhoneLayers = gsap.utils.toArray('.page-trainer .phone .phone-set');
    var trainerDepths = [
      { fromY: 120, toY: -38, fromZ: -4, toZ: -154 }, // 뒤 레이어. 시작은 거의 겹치고 끝에서 뒤로 크게 빠짐.
      { fromY: 120, toY: -70, fromZ: 0, toZ: 0 }, // 중간 레이어. 묶음의 중심 기준.
      { fromY: 120, toY: -112, fromZ: 4, toZ: 122 }, // 앞 레이어. 시작은 거의 겹치고 끝에서 앞으로 크게 펼쳐짐.
    ];

    if (trainerPhoneLayers.length) {
      var trainerPhoneMotion = gsap.timeline({
        scrollTrigger: {
          trigger: '.page-trainer', // trainer 섹션 기준.
          start: 'top bottom', // 섹션 top이 화면 하단에 닿으면 시작.
          end: 'bottom top', // 섹션 bottom이 화면 상단에 닿으면 종료.
          scrub: 1.1, // 스크롤 추적 지연감.
        },
      });

      trainerPhoneLayers.forEach(function (layer, index) {
        var depth = trainerDepths[index] || trainerDepths[trainerDepths.length - 1];

        trainerPhoneMotion.fromTo(
          layer,
          {
            y: depth.fromY, // 레이어별 시작 y 위치.
            z: depth.fromZ, // 레이어별 시작 깊이. 값 차이가 클수록 투시감이 강함.
            scale: 1, // 직접 확대/축소하지 않고 perspective에 맡김.
            force3D: true, // transform 안정화.
          },
          {
            y: depth.toY, // 레이어별 종료 y 위치.
            z: depth.toZ, // 레이어별 종료 깊이.
            scale: 1, // 직접 확대/축소하지 않고 perspective에 맡김.
            ease: 'none', // 스크롤과 1:1로 연결.
            force3D: true, // transform 안정화.
            overwrite: 'auto', // 중복 애니메이션 정리.
          },
          0, // 세 레이어를 같은 시점에 시작.
        );
      });
    }
  });

  scrollMotion.add('(prefers-reduced-motion: reduce)', function () {
    // 모션 감소 설정 사용자에게는 숨김 초기 상태를 제거.
    document.documentElement.classList.remove('motion-enabled');
  });
}

Motion__initWeatherSwiper();
Motion__init();

$(window).on('load resize', Motion__refresh);
