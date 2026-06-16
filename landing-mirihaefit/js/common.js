function getHeaderOffset() {
  var headerHeight = $('.gnb').outerHeight() || 0;
  return headerHeight + 0;
}

function getAnchorOffset() {
  return Math.max(0, getHeaderOffset() - 24);
}

function scrollToTarget(hash) {
  var $target = $(hash);

  if (!$target.length) {
    return;
  }

  Page__updateOffsetTop();

  var targetTop = hash === '#page-1' ? 0 : Math.max(0, $target.offset().top - getAnchorOffset());

  $('html, body').stop().animate({ scrollTop: targetTop }, 300).promise().done(Page__updateIndicatorActive);
}

function openPageDownloadDropdown() {
  var $downloadDropdown = $('.page-download .download.dropdown').first();

  if (!$downloadDropdown.length) {
    return;
  }

  $('.dropdown').not($downloadDropdown).children('ul').slideUp('fast');
  $downloadDropdown.children('ul').stop(true, true).slideDown('fast');
}

function Page__updateIndicatorActive() {
  var scrollTop = $(window).scrollTop();
  var activeScrollTop = scrollTop + getHeaderOffset() + 1;

  $($('.page').get().reverse()).each(function (index, node) {
    var $node = $(this);
    var offsetTop = $node.offset().top;

    if (activeScrollTop >= offsetTop) {
      $('.page-indicator > ul > li.active').removeClass('active');

      var currentPageIndex = $node.index();
      $('.page-indicator > ul > li').eq(currentPageIndex).addClass('active');

      $('html').attr('data-current-page-index', currentPageIndex);

      return false;
    }
  });
}

function Page__updateOffsetTop() {
  $('.page').each(function (index, node) {
    var $page = $(node);
    var offsetTop = $page.offset().top;

    $page.attr('data-offset-top', offsetTop);
  });

  Page__updateIndicatorActive();
}

function Page__updateScrolledClass() {
  if ($(window).scrollTop() > 0) {
    $('html').addClass('scrolled');
    return;
  }

  $('html').removeClass('scrolled');
}

function Page__init() {
  Page__updateOffsetTop();
}

$('.page-indicator > ul > li > a').click(function (e) {
  var href = $(this).attr('href');
  scrollToTarget(href);
  e.preventDefault();
});

$(document).on('click', '[data-download-trigger]', function (e) {
  var href = $(this).attr('href');
  var mobileUrl = $(this).data('mobile-url');
  var isMobile = window.matchMedia('(max-width: 720px)').matches;

  e.preventDefault();
  e.stopImmediatePropagation();

  if (isMobile && mobileUrl) {
    window.open(mobileUrl, '_blank');
    return;
  }

  scrollToTarget(href);
  window.setTimeout(openPageDownloadDropdown, 320);
});

$(document).on('click', 'a[href^="#page-"]', function (e) {
  var href = $(this).attr('href');

  if (!$(href).length) {
    return;
  }

  scrollToTarget(href);
  e.preventDefault();
});

Page__init();

$(window).resize(Page__updateOffsetTop);

$(window).scroll(function () {
  Page__updateIndicatorActive();
  Page__updateScrolledClass();
});

$(window).on('load', function () {
  Page__updateScrolledClass();
  Page__updateOffsetTop();
});
