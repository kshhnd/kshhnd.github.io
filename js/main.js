/* HnD website script */
(function () {
  /* ----- Mobile menu ----- */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ----- Portfolio filter ----- */
  var filterBar = document.querySelector('.filters');
  if (filterBar) {
    var buttons = filterBar.querySelectorAll('button');
    var cases = document.querySelectorAll('.case');
    var apply = function (cat) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.cat === cat ? 'true' : 'false'); });
      cases.forEach(function (c) { c.hidden = !(cat === 'all' || c.dataset.cat === cat); });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.dataset.cat); });
    });
    var h = (location.hash || '').replace('#cat-', '');
    var valid = Array.prototype.some.call(buttons, function (b) { return b.dataset.cat === h; });
    apply(valid ? h : 'all');
    window.addEventListener('hashchange', function () {
      var k = (location.hash || '').replace('#cat-', '');
      if (Array.prototype.some.call(buttons, function (b) { return b.dataset.cat === k; })) apply(k);
    });
  }

  /* ----- Contact form ----- */
  /* 5단계에서 Google Apps Script 웹 앱 URL을 아래에 넣으면 문의가 메일로 전송됩니다. */
  var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyxtT3x7bHPlCG-_4Wqt72rDaSeUqFMFWcBVPoFGBB3tlhZnlTZnyh19-3GmiPjekjI/exec';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var startedAt = Date.now();
  var show = function (type, msg) {
    status.className = 'form-status ' + type;
    status.textContent = msg;
    status.hidden = false;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    // 스팸 방지: 숨김 칸이 채워졌거나 3초 안에 제출되면 무시
    if (form.website.value || Date.now() - startedAt < 3000) {
      show('ok', '문의가 접수되었습니다.');
      return;
    }

    if (!FORM_ENDPOINT) {
      show('info', '문의 폼은 현재 연결 준비 중입니다. 번거로우시겠지만 오른쪽(모바일은 아래) 이메일로 연락 주시면 빠르게 회신드리겠습니다.');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '전송 중…';
    var data = new URLSearchParams(new FormData(form));
    data.append('page', location.href);

    fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () {
        form.reset();
        show('ok', '문의가 접수되었습니다. 확인 후 영업일 기준 1~2일 안에 회신드리겠습니다.');
      })
      .catch(function () {
        show('err', '전송하지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도하시거나 페이지의 이메일로 연락 주세요.');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = '문의 보내기';
      });
  });
})();
