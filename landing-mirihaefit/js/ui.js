$(function () {
  function getDropdownMenuHeight($dropdown) {
    var $menu = $dropdown.children('ul').first();

    if (!$menu.length) {
      return 0;
    }

    var $clone = $menu.clone();
    $clone.css({
      display: 'block',
      visibility: 'hidden',
      position: 'absolute',
      left: '-9999px',
      top: '-9999px',
    });
    $('body').append($clone);

    var height = $clone.outerHeight(true) || $clone[0].scrollHeight || 0;
    $clone.remove();

    return height;
  }

  $(document).on('click', '.dropdown > a', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var $dropdown = $(this).parent();
    var $menu = $dropdown.children('ul');
    var isOpen = $menu.is(':visible');
    var isMobile = window.matchMedia('(max-width: 720px)').matches;
    var mobileUrl = $(this).data('mobile-url');

    if (isMobile && mobileUrl) {
      window.open(mobileUrl, '_blank');
      return;
    }

    $('.dropdown').not($dropdown).children('ul').stop(true, true).slideUp('fast');

    if (isOpen) {
      $menu.stop(true, true).slideUp('fast');
      return;
    }

    $menu.stop(true, true).slideDown('fast');
  });

  $('.dropdown--form ul a').click(function (e) {
    e.preventDefault();

    var $dropdown = $(this).closest('.dropdown--form');
    var value = $(this).data('value');
    var label = $(this).data('label');
    var icon = $(this).data('icon');

    $dropdown.find('.dropdown__value').text(label);
    $dropdown.find('input[type="hidden"]').val(value);
    $dropdown.find('.dropdown__icon').text(icon);
    $dropdown.children('ul').slideUp('fast');
  });

  $(document).click(function () {
    $('.dropdown').children('ul').slideUp('fast');
  });

  $('a[href="#"]').click(function (e) {
    e.preventDefault();
  });

  $('.modal-call').click(function (e) {
    e.preventDefault();
    $('body').addClass('modal-poped');
    var modalID = $(this).attr('rel');
    console.log(modalID);
    $('.' + modalID).addClass('active');
  });

  $('a.close').click(function (e) {
    $(this).parent().parent().removeClass('active');
    $('body').removeClass('modal-poped');
  });

  $('.faq .list a').click(function (e) {
    $('.faq .list .a').slideUp('fast');
    $(this).next().slideToggle('fast');
  });
});
