/* cue-console.js — 04p 큐 콘솔 데모 (미팅 자료판).

   제안 덱(deck-nanum-kinect)에서 그대로 가져왔다. 다른 점은 하나 —
   폐회 큐에서 기본 6종을 고를 때 원본은 영상을 틀지만 여기서는 포스터 스틸을 쓴다.
   미팅 자료는 들고 다니는 파일이라 41MB 영상을 함께 옮길 이유가 없고, 이 장에서
   보여줄 것은 「큐마다 지정된 화면이 붙어 있다」이지 영상 재생 자체가 아니다.
   assets/video/ 가 없어도 동작한다.

   ---- 원본 주석 ----
   05p 큐 관리 시스템 데모.
   식순 순서대로 준비된 화면을 ← → 로 넘기는 현장 오퍼레이팅 UI.
   콘솔을 클릭(포커스)하면 방향키를 가로채고, 그 외에는 덱의 슬라이드 이동이 그대로 동작한다.

   이 장이 답하는 것은 「영상 파일을 순서대로 트는 것과 무엇이 다른가」다.
   식순을 1 · 2 · 3 세 묶음으로 나눠, 나눔이벤트(2)가 전달식 한가운데의 한 구간일
   뿐이라는 것과 그 앞뒤(1 · 3)는 같은 시스템이 이어서 돈다는 것이 함께 보이게 했다.

   화면은 대부분 정지 이미지다. 전달식이 도는 동안에는 전달식 화면 한 벌을 깔아
   두는 편이 완성도가 높고, 파티클 콘텐츠는 평시 상시 운영용이기 때문이다.
   영상이 도는 곳은 3-2 폐회 하나뿐 — 식이 끝난 뒤라 기본 6종 중 무엇을 틀어도
   되는 구간이고, 그 사실을 고르는 조작으로 보여준다. */
(function () {
  'use strict';

  var FIN = 'assets/led/finale.jpg';

  /* 폐회에서 고를 수 있는 기본 콘텐츠 6종. 여기서는 포스터 스틸만 쓴다 */
  var BASE = [
    { v: 'sarang1',               t: '아나몰픽 기본형',          s: '기본형' },
    { v: 'sarang2',               t: '아나몰픽 가로형 배너',     s: '가로형' },
    { v: 'sarang3',               t: '아나몰픽 세로형 배너',     s: '세로형' },
    { v: 'sarang_fruits_layout2', t: '3분할 후원현황',           s: '3분할' },
    { v: 'sarang4',               t: '디지털 앨범 · 캠페인 소개', s: '앨범 CM' },
    { v: 'sarang5',               t: '디지털 앨범 · 그리드형',    s: '앨범 그리드' }
  ];

  var GROUPS = [
    { g: '1', t: '전달식 진행', cues: [
      { n: '1-1', title: '입장', sig: '입장 BGM ON', screen: '전달식 화면 · 브랜드 배너', img: FIN,
        ment: '지금부터 희망나눔캠페인 ○○기업 성금 전달식을 시작하겠습니다.' },
      { n: '1-2', title: '내빈 소개', sig: '사운드 리액티브', screen: '전달식 화면 유지', img: FIN,
        ment: '먼저, 오늘 자리를 빛내주신 내빈 소개가 있겠습니다.' },
      { n: '1-3', title: '영상 상영', sig: '조명 OFF', screen: '기업 소개 영상', img: 'assets/led/screening.jpg',
        ment: '○○기업을 통해 만들어진 변화들을 영상으로 담아보았습니다. 함께 보시겠습니다.' },
      { n: '1-4', title: '인사 · 감사말씀', sig: 'BGM ON · 성금액 소개', screen: '전달식 화면 유지', img: FIN,
        ment: '○○기업 ***님을 단상으로 모시고 인사말씀을 청해 듣도록 하겠습니다.\n000억원의 소중한 성금을 기탁해주셨습니다. 여러분, 큰 박수 부탁드립니다.' }
    ]},
    /* 이번에 새로 개발하는 구간. 앞뒤 큐는 준비된 화면을 넘기는 것이지만
       여기서는 센서가 두 대표자의 위치를 읽어 화면이 그 자리에서 반응한다. */
    { g: '2', t: '나눔이벤트', cues: [
      { n: '2-1', title: '컷 1 · 마주 서다', sig: '키넥트 · 진입 판정', screen: '로고 파티클 → 사람 형상',
        img: 'assets/led/figures.jpg', key: true,
        ment: '나눔은 한 사람의 마음에서 시작하지만, 함께할 때 더 큰 사랑이 됩니다.\n대표님 두 분은 화면 앞 표시된 자리에 마주 서 주시겠습니다.' },
      { n: '2-2', title: '컷 2 · 맞닿다', sig: '판정 없음 · 자체 연출', screen: '카메라가 두 손끝으로 줌인',
        img: 'assets/led/hands.jpg',
        ment: '마주 선 두 마음이, 서로를 향해 손을 뻗습니다.' },
      { n: '2-3', title: '컷 3 · 피어나다', sig: '키넥트 · 이탈 판정', screen: '두 손에서 열매가 피어난다',
        img: 'assets/led/bloom.jpg', key: true,
        ment: '두 분의 마음을 통해, 사랑의열매가 피어났습니다.\n두 분은 양옆으로 물러나셔서 나눔의 순간들을 함께 보시겠습니다.' },
      { n: '2-4', title: '컷 4 · 나눔의 순간', sig: '판정 없음 · 자체 연출', screen: '열매 주위로 디지털 앨범이 공전',
        img: 'assets/led/carousel-corp.jpg',
        ment: '○○기업의 따뜻한 나눔이 사랑의열매와 만나, 우리 사회의 더 큰 사랑으로 이어집니다.' }
    ]},
    { g: '3', t: '마무리', cues: [
      { n: '3-1', title: '성금 · 인증패 전달', sig: '전달식 BGM ON · 조명 복귀', screen: '피날레 화면 유지 · 성금 전달로 연결',
        img: FIN,
        ment: '○○기업과 사랑의열매가 함께 만든 오늘을, 사진으로 남기겠습니다.\n이어서 희망나눔캠페인 인증패 전달 시간을 갖겠습니다.' },
      /* 식이 끝난 구간이라 화면을 무엇으로 두어도 된다. 기본 6종 중 고르는 조작을
         붙여, 평시 운영으로 그대로 돌아간다는 것을 보여준다. */
      { n: '3-2', title: '폐회', sig: '평시 운영 복귀', screen: '기본 콘텐츠 6종 중 선택 재생', pick: BASE,
        ment: '이것으로 성금 전달식을 모두 마치겠습니다. 참석해주신 내빈 여러분께 감사드립니다.' }
    ]}
  ];

  /* 평탄화 — 화면은 큐 단위로 넘기고, 그룹은 목록에서만 묶어 보여준다 */
  var CUES = [];
  GROUPS.forEach(function (gr) { gr.cues.forEach(function (c) { CUES.push(c); }); });

  var root = document.querySelector('.cue-console');
  if (!root) return;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* 큐 하나가 화면 여럿(폐회의 6종)을 가질 수 있어 1:1 대응이 깨진다.
     스토리보드와 같은 방식으로 평탄화하고 큐 → 첫 항목 인덱스를 따로 든다. */
  var lbItems = [], lbFirst = {};
  CUES.forEach(function (c, i) {
    lbFirst[i] = lbItems.length;
    var spec = (c.sig && c.sig !== '—') ? c.sig : '';
    if (c.pick) {
      c.pick.forEach(function (b) {
        lbItems.push({ k: 'i', s: 'assets/poster/' + b.v + '.webp',
                       t: 'CUE ' + c.n + ' · ' + c.title, m: b.t, spec: spec });
      });
    } else {
      lbItems.push({ k: 'i', s: c.img, t: 'CUE ' + c.n + ' · ' + c.title, m: c.screen, spec: spec });
    }
  });
  window.GALLERY = window.GALLERY || {};
  window.GALLERY.cue = { fit: 'cover', items: lbItems };

  var listEl   = root.querySelector('.cue-list');
  var stillEl  = root.querySelector('.cue-still');
  var pendEl   = root.querySelector('.cue-pending');
  var mentEl   = root.querySelector('.cue-ment__t');
  var noEl     = root.querySelector('.cue-no');
  var titleEl  = root.querySelector('.cue-title');
  var nextEl   = root.querySelector('.cue-next');
  var screenEl = root.querySelector('.cue-screen');
  var lbEl     = document.getElementById('lightbox');
  var idx = 0, pickBar = null;

  /* 큐 리스트 — 그룹 머리 + 큐 항목. 열 개가 되어 상자를 넘치므로 세로 스크롤이다
     (상자 크기는 그대로 둔다 — 콘솔이 커지면 목업이 줄어든다). */
  var html = '', flat = 0;
  GROUPS.forEach(function (gr) {
    html += '<div class="cue-group"><b>' + gr.g + '</b>' + esc(gr.t) + '</div>';
    gr.cues.forEach(function (c) {
      html += '<button class="cue-item' + (c.key ? ' is-key' : '') + '" type="button" data-no-advance' +
                ' data-i="' + (flat++) + '" role="option">' +
                '<span class="cue-item__no">' + c.n + '</span>' +
                '<span class="cue-item__body"><span class="cue-item__t">' + esc(c.title) + '</span>' +
                '<span class="cue-item__s">' + esc(c.screen) + '</span></span>' +
              '</button>';
    });
  });
  listEl.innerHTML = html;
  var items = Array.prototype.slice.call(listEl.querySelectorAll('.cue-item'));

  /* 폐회 전용 — 목업 우측 상단에서 기본 6종을 고른다 */
  function clearPick() {
    if (pickBar) { pickBar.remove(); pickBar = null; }
  }
  function buildPick(c) {
    pickBar = document.createElement('div');
    pickBar.className = 'cue-pickbar';
    pickBar.innerHTML = c.pick.map(function (b, n) {
      return '<button class="cue-pickbar__b' + (n === 0 ? ' is-on' : '') + '" type="button"' +
             ' data-no-advance data-n="' + n + '" title="' + esc(b.t) + '">' + esc(b.s) + '</button>';
    }).join('');
    screenEl.appendChild(pickBar);
    var btns = Array.prototype.slice.call(pickBar.querySelectorAll('.cue-pickbar__b'));
    function play(n) {
      var b = c.pick[n];
      btns.forEach(function (o, m) { o.classList.toggle('is-on', m === n); });
      stillEl.src = 'assets/poster/' + b.v + '.webp';
      if (screenEl) screenEl.setAttribute('data-index', String(lbFirst[idx] + n));
    }
    btns.forEach(function (o) {
      o.addEventListener('click', function (e) {
        e.stopPropagation();
        root.focus();
        play(parseInt(o.getAttribute('data-n'), 10) || 0);
      });
    });
    play(0);
  }

  function render() {
    var c = CUES[idx];
    items.forEach(function (el, i) { el.classList.toggle('is-on', i === idx); });
    clearPick();

    if (c.pick) {
      /* 여섯 종 중 고르는 구간 — 원본은 영상, 여기서는 포스터 스틸 */
      if (pendEl) pendEl.style.display = 'none';
      stillEl.style.display = '';
      buildPick(c);
    } else {
      stillEl.style.display = '';
      stillEl.src = c.img;
      if (pendEl) {
        pendEl.textContent = c.screen + ' · 생성 예정';
        pendEl.style.display = 'none';
        stillEl.onerror = function () { stillEl.style.display = 'none'; pendEl.style.display = ''; };
        stillEl.onload  = function () { pendEl.style.display = 'none'; stillEl.style.display = ''; };
      }
      if (screenEl) screenEl.setAttribute('data-index', String(lbFirst[idx]));
    }

    if (mentEl) mentEl.textContent = c.ment || '';
    noEl.textContent = 'CUE ' + c.n;
    titleEl.textContent = c.title + '  ·  ' + c.sig;
    var nx = CUES[idx + 1];
    nextEl.textContent = nx ? ('NEXT · ' + nx.title) : 'END OF SHOW';

    var on = items[idx];
    if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
  }

  function step(d) {
    idx = Math.max(0, Math.min(CUES.length - 1, idx + d));
    render();
  }

  items.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      root.focus();
      idx = parseInt(el.getAttribute('data-i'), 10) || 0;
      render();
    });
  });
  root.querySelector('[data-cue-prev]').addEventListener('click', function (e) { e.stopPropagation(); root.focus(); step(-1); });
  root.querySelector('[data-cue-next]').addEventListener('click', function (e) { e.stopPropagation(); root.focus(); step(1); });

  /* 콘솔이 활성(포커스) 상태일 때만 방향키를 가로챈다.
     클래스 상태가 아니라 document.activeElement 를 직접 보므로 focus/blur 이벤트 유실에 영향받지 않는다.
     deck.js 는 window 버블 단계에 걸려 있어, document 캡처에서 끊으면 슬라이드가 넘어가지 않는다. */
  function isArmed() {
    var a = document.activeElement;
    return a === root || root.contains(a);
  }
  function syncArmed() { root.classList.toggle('is-armed', isArmed()); }

  root.addEventListener('focusin', syncArmed);
  root.addEventListener('focusout', function () { setTimeout(syncArmed, 0); });
  root.addEventListener('mousedown', function () { root.focus(); setTimeout(syncArmed, 0); });
  root.addEventListener('click', function () { root.focus(); syncArmed(); });
  document.addEventListener('focusin', syncArmed);

  document.addEventListener('keydown', function (e) {
    /* 라이트박스가 열려 있으면 화살표는 라이트박스 몫이다 */
    if (lbEl && lbEl.classList.contains('is-open')) return;
    if (!isArmed()) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    e.stopPropagation();
    step(e.key === 'ArrowRight' ? 1 : -1);
  }, true);

  /* 슬라이드를 벗어나면 자동으로 해제해, 다른 슬라이드에서 방향키가 막히지 않게 한다 */
  var slide = root.closest('.slide');
  if (slide && window.MutationObserver) {
    new MutationObserver(function () {
      if (!slide.classList.contains('is-active') && isArmed()) { root.blur(); syncArmed(); }
    }).observe(slide, { attributes: true, attributeFilter: ['class'] });
  }

  render();
})();
