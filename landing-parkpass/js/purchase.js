$(function () {
  var $purchaseModal = $('.modal.purchase, .purchase-modal').first();
  if (!$purchaseModal.length) {
    return;
  }

  var $body = $purchaseModal.find('.purchase-modal__body, .purchase-body').first();
  if (!$body.length) {
    return;
  }

  $body.removeClass('purchase-modal__body').addClass('purchase-body');

  if ($body.find('.ticket-summary').length) {
    return;
  }

  $body.html(
    '<div class="ticket-summary">' +
      '<div class="ticket-summary__copy">' +
        '<p class="eyebrow">현재 이용권</p>' +
        '<strong class="title">3개월 이용권</strong>' +
        '<div class="ticket-summary__meta">' +
          '<span class="trainer">강사 김수빈</span>' +
          '<span class="lesson">PT 레슨</span>' +
        '</div>' +
        '<span class="period">2026.05.01 - 2026.08.01</span>' +
      '</div>' +
      '<div class="ticket-summary__qr">' +
        '<span class="day">D-12</span>' +
        '<span class="qr material-symbols-sharp" aria-hidden="true">qr_code_2</span>' +
        '<span class="zoom">+ 확대보기</span>' +
      '</div>' +
    '</div>' +
    '<div class="ticket-history">' +
      '<div class="ticket-history__head">' +
        '<p class="eyebrow">이용내역</p>' +
        '<span class="count">최근 3건</span>' +
      '</div>' +
      '<ul class="ticket-history__list">' +
        '<li><strong>2026.06.04</strong><span>PT 1회차 이용</span></li>' +
        '<li><strong>2026.06.02</strong><span>운동일지 등록 완료</span></li>' +
        '<li><strong>2026.05.30</strong><span>예약 변경 내역 확인</span></li>' +
      '</ul>' +
    '</div>' +
    '<div class="payment-section">' +
      '<p class="eyebrow">결제 수단</p>' +
      '<div class="dropdown dropdown--form payment-dropdown">' +
        '<a href="#">' +
          '<span class="dropdown__icon material-symbols-sharp">credit_card</span>' +
          '<span class="dropdown__value">카드를 선택해 주세요</span>' +
          '<span class="expand material-symbols-sharp">expand_more</span>' +
        '</a>' +
        '<ul>' +
          '<li><a href="#" data-label="신용카드" data-icon="credit_card"><span class="material-symbols-sharp">credit_card</span>신용카드</a></li>' +
          '<li><a href="#" data-label="간편결제" data-icon="payments"><span class="material-symbols-sharp">payments</span>간편결제</a></li>' +
          '<li><a href="#" data-label="계좌이체" data-icon="account_balance"><span class="material-symbols-sharp">account_balance</span>계좌이체</a></li>' +
          '<li><a href="#" data-label="휴대폰 결제" data-icon="smartphone"><span class="material-symbols-sharp">smartphone</span>휴대폰 결제</a></li>' +
        '</ul>' +
      '</div>' +
    '</div>' +
    '<div class="actions">' +
      '<a href="#" class="button purchase-buy">이용권 구매하기</a>' +
    '</div>'
  );
});
