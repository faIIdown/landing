var newsMasonry = null;
var newsMasonryMode = null;
var newsMasonryFrame = null;

function News__getMode() {
  return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop';
}

function News__refreshPage() {
  if (typeof Page__updateOffsetTop === 'function') {
    Page__updateOffsetTop();
  }

  if (typeof Motion__refresh === 'function') {
    Motion__refresh();
  }
}

function News__getGutter(container, fallback) {
  var news = container.closest('.news');
  var value = news ? getComputedStyle(news).getPropertyValue('--news-gap') : '';
  var gutter = parseFloat(value);

  return Number.isFinite(gutter) ? gutter : fallback;
}

function News__initMasonry() {
  var container = document.querySelector('.page-notice .container');
  if (!container || typeof Masonry === 'undefined') {
    return;
  }

  if (newsMasonry) {
    newsMasonry.destroy();
  }

  newsMasonryMode = News__getMode();
  var isMobile = newsMasonryMode === 'mobile';
  var gutter = News__getGutter(container, isMobile ? 12 : 16);

  newsMasonry = new Masonry(container, {
    itemSelector: '.item',
    columnWidth: '.item',
    gutter: gutter,
    percentPosition: true,
    horizontalOrder: true,
    transitionDuration: '0.2s',
  });

  News__refreshPage();
}

function News__layoutMasonry(isResize) {
  if (!newsMasonry) {
    News__initMasonry();
    return;
  }

  var container = newsMasonry.element;
  var isMobile = News__getMode() === 'mobile';

  newsMasonry.options.gutter = News__getGutter(container, isMobile ? 12 : 16);
  newsMasonry.options.transitionDuration = isResize ? '0s' : '0.2s';
  newsMasonry.reloadItems();
  newsMasonry.layout();
  News__refreshPage();
}

function News__scheduleMasonryLayout() {
  if (newsMasonryFrame) {
    return;
  }

  newsMasonryFrame = requestAnimationFrame(function () {
    newsMasonryFrame = requestAnimationFrame(function () {
      newsMasonryFrame = null;
      News__layoutMasonry(true);
    });
  });
}

$(window).on('load', News__initMasonry);

$(window).on('resize', function () {
  var nextMode = News__getMode();

  if (newsMasonry && nextMode !== newsMasonryMode) {
    News__initMasonry();
    News__scheduleMasonryLayout();
    return;
  }

  if (newsMasonry) {
    News__scheduleMasonryLayout();
  }
});
