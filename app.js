// 꼼꼼이 (KkomKkom) - State & UI Controller

// Sample baby avatars/photos for demo moments
const SAMPLE_MOMENTS = [
  {
    id: 'mom_1',
    author: '엄마',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&auto=format&fit=crop&q=80',
    caption: '오늘 분유 140ml 원샷하고 배냇짓 웃음 폭발! 너무 귀여워요 💕',
    time: '13:30',
    likes: 3
  },
  {
    id: 'mom_2',
    author: '아빠',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&auto=format&fit=crop&q=80',
    caption: '낮잠 2차 들어가는 중. 속싸개 포근하게 감싸주니 바로 딥슬립 💤',
    time: '14:15',
    likes: 5
  }
];

// Initial State with realistic baby logs
const DEFAULT_LOGS = {
  activeUser: '엄마', // '엄마' | '아빠'
  feeds: [
    { id: 'f1', type: '분유', amount: 120, time: '03:00', author: '엄마' },
    { id: 'f2', type: '분유', amount: 140, time: '07:30', author: '아빠' },
    { id: 'f3', type: '분유', amount: 160, time: '11:30', author: '엄마' },
    { id: 'f4', type: '분유', amount: 140, time: '13:20', author: '아빠' }
  ],
  sleeps: [
    { id: 's1', type: 'night', label: '밤잠', startTime: '00:00', endTime: '06:30', author: '엄마' },
    { id: 's2', type: 'nap', label: '낮잠 1차', startTime: '09:30', endTime: '11:00', author: '엄마' },
    { id: 's3', type: 'nap', label: '낮잠 2차', startTime: '14:00', endTime: '15:15', author: '아빠' }
  ],
  diapers: [
    { id: 'd1', type: 'pee', time: '03:10', author: '엄마' },
    { id: 'd2', type: 'poo', color: '황금', state: '보통', time: '07:00', author: '아빠' },
    { id: 'd3', type: 'pee', time: '09:20', author: '엄마' },
    { id: 'd4', type: 'pee', time: '12:00', author: '엄마' },
    { id: 'd5', type: 'both', color: '황금', state: '보통', time: '13:45', author: '아빠' },
    { id: 'd6', type: 'pee', time: '15:00', author: '아빠' }
  ],
  memos: [
    {
      id: 'm1',
      author: '아빠',
      text: '오후 1시 20분에 분유 140ml 원샷했습니다! 트림 시원하게 하고 낮잠 2차 들어갔어요 👶',
      time: '13:40',
      isPinned: true
    },
    {
      id: 'm2',
      author: '엄마',
      text: '아침 10시에 유산균이랑 비타민D 복용 완료했습니다. 오후에 소아과 접종 일정 체크 필요해요.',
      time: '10:30',
      isPinned: false
    }
  ],
  moments: SAMPLE_MOMENTS,
  babyProfile: {
    status: 'unborn', // 'unborn' (출산 예정) | 'born' (출생 후)
    name: '꼼꼼이',
    date: '2026-11-20', // 예정일 또는 생일
    gender: 'secret',
    passcode: '1212'
  },
  babyState: {
    status: 'sleep',
    statusSince: '14:00',
    statusDuration: '1시간 15분째 수면 중'
  }
};

const STORAGE_KEY = 'kkomkkom_baby_data_v3';

// Standard Pediatric Health Metrics Guide Data
const HEALTH_STANDARDS = {
  newborn: {
    title: '신생아 (0~1개월)',
    metrics: [
      { icon: '🍼', title: '일일 총 수유량', val: '600 ~ 800ml', sub: '1회 60~120ml (2.5~3시간 텀)' },
      { icon: '💤', title: '하루 총 수면', val: '15 ~ 18시간', sub: '낮과 밤 구분 없이 2~3시간씩 수면' },
      { icon: '💧', title: '소변 기저귀', val: '최소 6회 이상', sub: '묵직해야 탈수 위험 없음 (필수 체크)' },
      { icon: '💩', title: '대변 기저귀', val: '1 ~ 4회', sub: '황금변/녹변 정상 (모유는 더 잦음)' }
    ]
  },
  infant1: {
    title: '영아 초기 (1~3개월)',
    metrics: [
      { icon: '🍼', title: '일일 총 수유량', val: '700 ~ 900ml', sub: '1회 120~160ml (3~4시간 텀)' },
      { icon: '💤', title: '하루 총 수면', val: '14 ~ 16시간', sub: '밤잠 8~10시간 (밤잠 텀 형성 시작)' },
      { icon: '💧', title: '소변 기저귀', val: '하루 6 ~ 8회', sub: '기저귀 색상 및 냄새 체크' },
      { icon: '💩', title: '대변 기저귀', val: '1 ~ 3회', sub: '장 발달로 2~3일에 1회 볼 수도 있음' }
    ]
  },
  infant2: {
    title: '영아 중기 (4~6개월)',
    metrics: [
      { icon: '🍼', title: '일일 총 수유량', val: '800 ~ 1,000ml', sub: '1회 160~200ml (4시간 텀)' },
      { icon: '💤', title: '하루 총 수면', val: '13 ~ 15시간', sub: '밤중 수유 점차 중단 및 통잠' },
      { icon: '🥣', title: '이유식 준비', val: '1일 1회 미음', sub: '체중 7kg 이상 또는 5~6개월 시작' },
      { icon: '💧', title: '소변 기저귀', val: '하루 5 ~ 7회', sub: '정상 수분 공급 유지' }
    ]
  }
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { 
      const parsed = JSON.parse(saved);
      if (!parsed.babyProfile) parsed.babyProfile = JSON.parse(JSON.stringify(DEFAULT_LOGS.babyProfile));
      return parsed; 
    } catch (e) { console.error(e); }
  }
  return JSON.parse(JSON.stringify(DEFAULT_LOGS));
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let appState = loadState();

// Helper Functions
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function formatMinutes(totalMins) {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

function getCurrentTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// 1. Active User Switcher Controller
function setActiveUser(user) {
  appState.activeUser = user;
  saveState(appState);

  const momBtn = document.getElementById('selectMomBtn');
  const dadBtn = document.getElementById('selectDadBtn');
  const indicator = document.getElementById('currentActiveIndicator');

  if (user === '엄마') {
    momBtn.classList.add('active');
    dadBtn.classList.remove('active');
    indicator.innerHTML = '현재 조작: <strong class="author-mom">👩 엄마</strong>';
    showToast('👩 지금부터 [엄마] 모드로 기록됩니다');
  } else {
    dadBtn.classList.add('active');
    momBtn.classList.remove('active');
    indicator.innerHTML = '현재 조작: <strong class="author-dad">👨 아빠</strong>';
    showToast('👨 지금부터 [아빠] 모드로 기록됩니다');
  }

  // Synchronize default author in all modals
  syncModalAuthors(user);
}

function syncModalAuthors(user) {
  const formSelectors = [
    '#feedForm input[name="feedRecorder"]',
    '#sleepForm input[name="sleepRecorder"]',
    '#diaperForm input[name="diaperRecorder"]',
    '#memoInputBox input[name="memoAuthor"]',
    '#mediaForm input[name="mediaRecorder"]'
  ];

  formSelectors.forEach(sel => {
    const radio = document.querySelector(`${sel}[value="${user}"]`);
    if (radio) radio.checked = true;
  });
}

// 2. Dashboard KPIs Update
function updateDashboard() {
  // A. Feeding KPI
  const totalAmount = appState.feeds.reduce((sum, f) => sum + Number(f.amount), 0);
  const feedCount = appState.feeds.length;
  document.getElementById('totalFeedAmount').textContent = totalAmount;
  document.getElementById('feedCountBadge').textContent = `${feedCount}회`;

  const targetAmount = 800;
  const feedPct = Math.min(100, Math.round((totalAmount / targetAmount) * 100));
  document.getElementById('feedProgressBar').style.width = `${feedPct}%`;

  // B. Sleep KPI
  let totalSleepMinutes = 0;
  let nightMinutes = 0;
  let napMinutes = 0;

  appState.sleeps.forEach(s => {
    const start = timeToMinutes(s.startTime);
    const end = timeToMinutes(s.endTime);
    let dur = end - start;
    if (dur < 0) dur += 24 * 60;
    totalSleepMinutes += dur;
    if (s.type === 'night') nightMinutes += dur;
    else napMinutes += dur;
  });

  const sleepH = Math.floor(totalSleepMinutes / 60);
  const sleepM = totalSleepMinutes % 60;
  document.getElementById('totalSleepHours').textContent = sleepH;
  document.getElementById('totalSleepMins').textContent = sleepM;
  document.getElementById('sleepCountBadge').textContent = `총 ${appState.sleeps.length}회`;

  const nightSummaryTag = document.querySelector('.tag-night');
  const napSummaryTag = document.querySelector('.tag-nap');
  if (nightSummaryTag) nightSummaryTag.textContent = `밤잠 ${formatMinutes(nightMinutes)}`;
  if (napSummaryTag) napSummaryTag.textContent = `낮잠 ${formatMinutes(napMinutes)}`;

  // C. Diaper KPI
  let peeCount = 0;
  let pooCount = 0;
  appState.diapers.forEach(d => {
    if (d.type === 'pee' || d.type === 'both') peeCount++;
    if (d.type === 'poo' || d.type === 'both') pooCount++;
  });
  document.getElementById('diaperPeeCount').textContent = peeCount;
  document.getElementById('diaperPooCount').textContent = pooCount;
  document.getElementById('diaperTotalBadge').textContent = `총 ${appState.diapers.length}회`;

  // D. Feeding Term Calculation
  if (appState.feeds.length > 0) {
    const sortedFeeds = [...appState.feeds].sort((a, b) => timeToMinutes(b.time) - timeToMinutes(a.time));
    const lastFeed = sortedFeeds[0];
    const nowMins = timeToMinutes(getCurrentTimeStr());
    const lastFeedMins = timeToMinutes(lastFeed.time);
    let diff = nowMins - lastFeedMins;
    if (diff < 0) diff += 24 * 60;
    
    const diffH = Math.floor(diff / 60);
    const diffM = diff % 60;
    const termStr = diffH > 0 ? `${diffH}시간 ${diffM}분` : `${diffM}분`;

    document.getElementById('feedingTermInfo').textContent = `수유한 지 ${termStr} 경과`;
    const lastFeedDetail = document.querySelector('.status-detail-row span:first-child');
    if (lastFeedDetail) {
      const authorBadge = lastFeed.author === '엄마' ? '👩 엄마' : '👨 아빠';
      lastFeedDetail.innerHTML = `마지막 수유: <strong>${lastFeed.time} (${lastFeed.type} ${lastFeed.amount}ml)</strong> [${authorBadge}]`;
    }
  }

  // E. Live Baby Status Banner
  const statusBadge = document.getElementById('babyStatusBadge');
  const statusEmoji = document.getElementById('babyStatusEmoji');
  const quickSleepBtn = document.getElementById('quickSleepToggleBtn');
  const durationText = document.getElementById('babyStatusDuration');

  if (appState.babyState.status === 'sleep') {
    statusBadge.className = 'status-badge sleep';
    statusBadge.textContent = '수면 중';
    statusEmoji.textContent = '😴';
    quickSleepBtn.textContent = '기상 기록 ☀️';
    durationText.textContent = `${appState.babyState.statusSince}부터 수면 중`;
  } else {
    statusBadge.className = 'status-badge awake';
    statusBadge.textContent = '깨어있음';
    statusEmoji.textContent = '👶';
    quickSleepBtn.textContent = '잠자기 시작 💤';
    durationText.textContent = `${appState.babyState.statusSince}부터 깨어있는 중`;
  }
}

// 3. Render 24-Hour Gantt Timeline
function renderGanttTimeline() {
  const rulerBar = document.getElementById('ganttBar');
  rulerBar.innerHTML = '<div id="currentTimeIndicator" class="current-time-marker" title="현재 시각"></div>';

  const TOTAL_MINUTES = 24 * 60;

  // Render Sleep Blocks
  appState.sleeps.forEach(sleep => {
    const startMins = timeToMinutes(sleep.startTime);
    const endMins = timeToMinutes(sleep.endTime);
    let durMins = endMins - startMins;
    if (durMins < 0) durMins += TOTAL_MINUTES;

    const leftPct = (startMins / TOTAL_MINUTES) * 100;
    const widthPct = (durMins / TOTAL_MINUTES) * 100;

    const block = document.createElement('div');
    block.className = 'gantt-sleep-block';
    block.style.left = `${leftPct}%`;
    block.style.width = `${widthPct}%`;
    block.title = `${sleep.label} (${sleep.startTime} ~ ${sleep.endTime}, ${sleep.author})`;
    if (durMins >= 75) {
      block.textContent = `${sleep.label}`;
    }
    block.addEventListener('click', () => {
      showToast(`💤 ${sleep.label} | ${sleep.startTime} ~ ${sleep.endTime} (${formatMinutes(durMins)}) - 기록: ${sleep.author}`);
    });
    rulerBar.appendChild(block);
  });

  // Render Feed Pins
  appState.feeds.forEach(feed => {
    const mins = timeToMinutes(feed.time);
    const leftPct = (mins / TOTAL_MINUTES) * 100;

    const pin = document.createElement('div');
    pin.className = 'gantt-feed-pin';
    pin.style.left = `${leftPct}%`;
    pin.title = `수유: ${feed.type} ${feed.amount}ml (${feed.time}, ${feed.author})`;

    const dot = document.createElement('div');
    dot.className = 'pin-dot';
    pin.appendChild(dot);

    pin.addEventListener('click', () => {
      showToast(`🍼 ${feed.time} ${feed.type} ${feed.amount}ml - 기록자: ${feed.author}`);
    });
    rulerBar.appendChild(pin);
  });

  // Render Diaper Pins
  appState.diapers.forEach(diaper => {
    const mins = timeToMinutes(diaper.time);
    const leftPct = (mins / TOTAL_MINUTES) * 100;

    const pin = document.createElement('div');
    pin.className = 'gantt-diaper-pin';
    pin.style.left = `${leftPct}%`;
    if (diaper.type === 'poo' || diaper.type === 'both') {
      pin.style.backgroundColor = '#d97706';
    }
    pin.title = `기저귀: ${diaper.type} (${diaper.time}, ${diaper.author})`;
    pin.addEventListener('click', () => {
      const typeLabel = diaper.type === 'pee' ? '소변' : (diaper.type === 'poo' ? '대변' : '소변+대변');
      showToast(`🧷 ${diaper.time} 기저귀 (${typeLabel}${diaper.color ? ' / ' + diaper.color : ''}) - 기록자: ${diaper.author}`);
    });
    rulerBar.appendChild(pin);
  });

  // Update Current Time Indicator
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const curMarker = document.getElementById('currentTimeIndicator');
  if (curMarker) {
    curMarker.style.left = `${(currentMins / TOTAL_MINUTES) * 100}%`;
  }
}

// 4. Render Event Chronological Feed with Author Tag
function renderEventList() {
  const listEl = document.getElementById('eventList');
  listEl.innerHTML = '';

  const allEvents = [];

  appState.feeds.forEach(f => {
    allEvents.push({
      category: 'feed',
      badgeClass: 'feed',
      badgeText: '수유',
      title: `${f.type} ${f.amount}ml`,
      time: f.time,
      author: f.author,
      rawMins: timeToMinutes(f.time)
    });
  });

  appState.sleeps.forEach(s => {
    allEvents.push({
      category: 'sleep',
      badgeClass: 'sleep',
      badgeText: '수면',
      title: `${s.label} (${s.startTime} ~ ${s.endTime})`,
      time: s.startTime,
      author: s.author,
      rawMins: timeToMinutes(s.startTime)
    });
  });

  appState.diapers.forEach(d => {
    const label = d.type === 'pee' ? '소변' : (d.type === 'poo' ? `대변(${d.color || '황금'})` : '소변+대변');
    allEvents.push({
      category: 'diaper',
      badgeClass: 'diaper',
      badgeText: '기저귀',
      title: label,
      time: d.time,
      author: d.author,
      rawMins: timeToMinutes(d.time)
    });
  });

  allEvents.sort((a, b) => b.rawMins - a.rawMins);

  allEvents.forEach(evt => {
    const row = document.createElement('div');
    row.className = 'event-row';
    const authorClass = evt.author === '엄마' ? 'mom' : 'dad';
    const authorEmoji = evt.author === '엄마' ? '👩' : '👨';

    row.innerHTML = `
      <div class="event-row-left">
        <span class="event-badge ${evt.badgeClass}">${evt.badgeText}</span>
        <span class="event-main-text">${evt.title}</span>
      </div>
      <div class="event-row-right">
        <span class="event-time">${evt.time}</span>
        <span class="author-pill-tag ${authorClass}">${authorEmoji} ${evt.author}</span>
      </div>
    `;
    listEl.appendChild(row);
  });
}

// 5. Render Shared Handover Memos
function renderMemos() {
  const memoList = document.getElementById('memoList');
  memoList.innerHTML = '';

  const sortedMemos = [...appState.memos].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  document.getElementById('memoCount').textContent = sortedMemos.length;

  sortedMemos.forEach(memo => {
    const card = document.createElement('div');
    card.className = `memo-card ${memo.isPinned ? 'pinned' : ''}`;
    const authorClass = memo.author === '엄마' ? 'mom' : 'dad';
    const authorEmoji = memo.author === '엄마' ? '👩' : '👨';

    card.innerHTML = `
      <div class="memo-meta">
        <span class="author-badge ${authorClass}">${authorEmoji} ${memo.author} ${memo.isPinned ? '⭐️ 고정' : ''}</span>
        <span class="memo-time">${memo.time}</span>
      </div>
      <div class="memo-text">${memo.text}</div>
      <div class="memo-actions">
        <button class="memo-del-btn" data-id="${memo.id}">삭제</button>
      </div>
    `;

    card.querySelector('.memo-del-btn').addEventListener('click', () => {
      appState.memos = appState.memos.filter(m => m.id !== memo.id);
      saveState(appState);
      renderMemos();
      showToast('메모가 삭제되었습니다.');
    });

    memoList.appendChild(card);
  });
}

// 6. Render Photo & Video Moments
function renderMoments() {
  const slider = document.getElementById('momentsSlider');
  slider.innerHTML = '';

  document.getElementById('momentsCount').textContent = appState.moments.length;

  appState.moments.forEach(item => {
    const card = document.createElement('div');
    card.className = 'moment-card';
    const authorClass = item.author === '엄마' ? 'mom' : 'dad';
    const authorEmoji = item.author === '엄마' ? '👩' : '👨';

    const mediaHtml = item.type === 'video'
      ? `<video src="${item.mediaUrl}" controls class="moment-video"></video>`
      : `<img src="${item.mediaUrl}" alt="아기 사진" class="moment-img" loading="lazy">`;

    card.innerHTML = `
      <div class="moment-media-wrap">
        ${mediaHtml}
        <div class="moment-badge-overlay">
          <span class="author-badge ${authorClass}">${authorEmoji} ${item.author}</span>
        </div>
      </div>
      <div class="moment-info">
        <p class="moment-caption">${item.caption || '우리 아기 소중한 순간 💕'}</p>
        <div class="moment-footer">
          <span>${item.time}</span>
          <button class="like-btn" data-id="${item.id}">❤️ <span>${item.likes || 1}</span></button>
        </div>
      </div>
    `;

    card.querySelector('.like-btn').addEventListener('click', () => {
      item.likes = (item.likes || 0) + 1;
      saveState(appState);
      card.querySelector('.like-btn span').textContent = item.likes;
      showToast('❤️ 하트를 남겼습니다!');
    });

    slider.appendChild(card);
  });
}

// 7. Toast System
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
}

// 8. Modals Controller
const feedModal = document.getElementById('feedModal');
const sleepModal = document.getElementById('sleepModal');
const diaperModal = document.getElementById('diaperModal');
const mediaModal = document.getElementById('mediaModal');

function openModal(modal) {
  modal.classList.remove('hidden');
  const timeInput = modal.querySelector('input[type="time"]');
  if (timeInput && !timeInput.value) {
    timeInput.value = getCurrentTimeStr();
  }
  syncModalAuthors(appState.activeUser);
}

function closeModal(modal) {
  modal.classList.add('hidden');
}

document.querySelectorAll('.modal-backdrop').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('close-modal-btn')) {
      closeModal(modal);
    }
  });
});

// Modal Open Buttons
document.getElementById('openFeedModalBtn').addEventListener('click', () => openModal(feedModal));
document.getElementById('openSleepModalBtn').addEventListener('click', () => {
  document.getElementById('sleepStartTime').value = '13:00';
  document.getElementById('sleepEndTime').value = getCurrentTimeStr();
  openModal(sleepModal);
});
document.getElementById('openDiaperModalBtn').addEventListener('click', () => openModal(diaperModal));
document.getElementById('openMediaModalBtn').addEventListener('click', () => openModal(mediaModal));
document.getElementById('openMediaQuickBtn').addEventListener('click', () => openModal(mediaModal));

document.getElementById('openMemoModalBtn').addEventListener('click', () => {
  const box = document.getElementById('memoInputBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) {
    syncModalAuthors(appState.activeUser);
    document.getElementById('memoText').focus();
  }
});

// Quick Sleep Toggle
document.getElementById('quickSleepToggleBtn').addEventListener('click', () => {
  const curTime = getCurrentTimeStr();
  const author = appState.activeUser;
  if (appState.babyState.status === 'sleep') {
    appState.babyState.status = 'awake';
    appState.babyState.statusSince = curTime;
    appState.sleeps.push({
      id: 's_' + Date.now(),
      type: 'nap',
      label: '낮잠',
      startTime: '14:00',
      endTime: curTime,
      author: author
    });
    showToast(`☀️ 아기가 일어났습니다! (${author} 기록)`);
  } else {
    appState.babyState.status = 'sleep';
    appState.babyState.statusSince = curTime;
    showToast(`💤 아기가 잠들었습니다! (${author} 기록)`);
  }
  saveState(appState);
  refreshAll();
});

// User Switcher Buttons
document.getElementById('selectMomBtn').addEventListener('click', () => setActiveUser('엄마'));
document.getElementById('selectDadBtn').addEventListener('click', () => setActiveUser('아빠'));

// Feeding Form Handling
let selectedFeedType = '분유';
document.querySelectorAll('#feedModal .segment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#feedModal .segment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedFeedType = btn.textContent.trim();
  });
});

document.querySelectorAll('.preset-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    document.getElementById('feedAmountInput').value = pill.dataset.amount;
  });
});

document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById('feedAmountInput');
    const val = Number(input.value) + Number(btn.dataset.delta);
    if (val >= 10 && val <= 400) {
      input.value = val;
    }
  });
});

document.getElementById('feedForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const amount = document.getElementById('feedAmountInput').value;
  const time = document.getElementById('feedTimeInput').value || getCurrentTimeStr();
  const author = document.querySelector('input[name="feedRecorder"]:checked').value;

  appState.feeds.push({
    id: 'f_' + Date.now(),
    type: selectedFeedType,
    amount: Number(amount),
    time: time,
    author: author
  });

  saveState(appState);
  closeModal(feedModal);
  refreshAll();
  showToast(`🍼 ${time} ${selectedFeedType} ${amount}ml (${author} 기록) 완료!`);
});

// Sleep Form Handling
let selectedSleepType = 'nap';
document.querySelectorAll('#sleepModal .segment-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#sleepModal .segment-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSleepType = btn.dataset.sleeptype;
  });
});

document.getElementById('sleepForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const startTime = document.getElementById('sleepStartTime').value;
  const endTime = document.getElementById('sleepEndTime').value;
  const author = document.querySelector('input[name="sleepRecorder"]:checked').value;

  appState.sleeps.push({
    id: 's_' + Date.now(),
    type: selectedSleepType,
    label: selectedSleepType === 'night' ? '밤잠' : '낮잠',
    startTime: startTime,
    endTime: endTime,
    author: author
  });

  saveState(appState);
  closeModal(sleepModal);
  refreshAll();
  showToast(`💤 수면 기록 (${startTime} ~ ${endTime}, ${author}) 추가 완료!`);
});

// Diaper Form Handling
let selectedDiaperType = 'pee';
document.querySelectorAll('.diaper-choice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diaper-choice-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDiaperType = btn.dataset.diapertype;
    
    const detailSec = document.getElementById('pooDetailSection');
    if (selectedDiaperType === 'poo' || selectedDiaperType === 'both') {
      detailSec.classList.remove('hidden');
    } else {
      detailSec.classList.add('hidden');
    }
  });
});

document.querySelectorAll('#pooDetailSection .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

document.getElementById('diaperForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const time = document.getElementById('diaperTimeInput').value || getCurrentTimeStr();
  const author = document.querySelector('input[name="diaperRecorder"]:checked').value;

  const activeColorChip = document.querySelector('#pooDetailSection .chip[data-color].active');
  const activeStateChip = document.querySelector('#pooDetailSection .chip[data-state].active');

  appState.diapers.push({
    id: 'd_' + Date.now(),
    type: selectedDiaperType,
    color: activeColorChip ? activeColorChip.dataset.color : '황금',
    state: activeStateChip ? activeStateChip.dataset.state : '보통',
    time: time,
    author: author
  });

  saveState(appState);
  closeModal(diaperModal);
  refreshAll();
  const label = selectedDiaperType === 'pee' ? '소변' : (selectedDiaperType === 'poo' ? '대변' : '소변+대변');
  showToast(`🧷 ${time} 기저귀(${label}, ${author}) 기록 완료!`);
});

// Media / Photo Upload Handling
let uploadedMediaData = null;
let uploadedMediaType = 'image';

const fileInput = document.getElementById('mediaFileInput');
const previewContainer = document.getElementById('mediaPreviewContainer');
const uploadPrompt = document.getElementById('uploadPrompt');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  uploadedMediaType = file.type.startsWith('video/') ? 'video' : 'image';
  const reader = new FileReader();
  reader.onload = (evt) => {
    uploadedMediaData = evt.target.result;
    uploadPrompt.classList.add('hidden');
    previewContainer.classList.remove('hidden');
    if (uploadedMediaType === 'video') {
      previewContainer.innerHTML = `<video src="${uploadedMediaData}" controls style="max-height:160px;"></video>`;
    } else {
      previewContainer.innerHTML = `<img src="${uploadedMediaData}" style="max-height:160px; object-fit:cover;">`;
    }
  };
  reader.readAsDataURL(file);
});

// Sample Buttons for Quick Demo
document.getElementById('sampleBabySmileBtn').addEventListener('click', () => {
  uploadedMediaData = 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&auto=format&fit=crop&q=80';
  uploadedMediaType = 'image';
  uploadPrompt.classList.add('hidden');
  previewContainer.classList.remove('hidden');
  previewContainer.innerHTML = `<img src="${uploadedMediaData}" style="max-height:160px; object-fit:cover;">`;
  document.getElementById('mediaCaptionInput').value = '방긋 웃으며 옹알이하는 중 ㅎㅎ';
});

document.getElementById('sampleSleepingBtn').addEventListener('click', () => {
  uploadedMediaData = 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&auto=format&fit=crop&q=80';
  uploadedMediaType = 'image';
  uploadPrompt.classList.add('hidden');
  previewContainer.classList.remove('hidden');
  previewContainer.innerHTML = `<img src="${uploadedMediaData}" style="max-height:160px; object-fit:cover;">`;
  document.getElementById('mediaCaptionInput').value = '천사처럼 꿀잠 자는 모습 💤';
});

document.getElementById('mediaForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!uploadedMediaData) {
    showToast('사진이나 영상을 선택해 주세요!');
    return;
  }
  const caption = document.getElementById('mediaCaptionInput').value.trim();
  const author = document.querySelector('input[name="mediaRecorder"]:checked').value;

  appState.moments.unshift({
    id: 'mom_' + Date.now(),
    author: author,
    type: uploadedMediaType,
    mediaUrl: uploadedMediaData,
    caption: caption || '우리 아기 소중한 순간 💕',
    time: getCurrentTimeStr(),
    likes: 1
  });

  saveState(appState);
  closeModal(mediaModal);
  renderMoments();
  showToast(`📷 ${author}의 사진/영상이 공유되었습니다!`);

  // Reset modal
  uploadedMediaData = null;
  previewContainer.innerHTML = '';
  previewContainer.classList.add('hidden');
  uploadPrompt.classList.remove('hidden');
  document.getElementById('mediaCaptionInput').value = '';
});

// Memo Handling
document.getElementById('addMemoToggleBtn').addEventListener('click', () => {
  const box = document.getElementById('memoInputBox');
  box.classList.toggle('hidden');
  if (!box.classList.contains('hidden')) {
    syncModalAuthors(appState.activeUser);
    document.getElementById('memoText').focus();
  }
});

document.getElementById('submitMemoBtn').addEventListener('click', () => {
  const text = document.getElementById('memoText').value.trim();
  if (!text) return;
  const author = document.querySelector('input[name="memoAuthor"]:checked').value;
  const isPinned = document.getElementById('memoIsPinned').checked;

  appState.memos.unshift({
    id: 'm_' + Date.now(),
    author: author,
    text: text,
    time: getCurrentTimeStr(),
    isPinned: isPinned
  });

  document.getElementById('memoText').value = '';
  document.getElementById('memoIsPinned').checked = false;
  document.getElementById('memoInputBox').classList.add('hidden');

  saveState(appState);
  renderMemos();
  showToast(`📌 ${author}의 새 인수인계 메모가 등록되었습니다.`);
});

// Theme Toggle
const themeBtn = document.getElementById('themeToggleBtn');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  themeBtn.querySelector('.theme-icon').textContent = isDark ? '🌙' : '☀️';
  showToast(isDark ? '🌙 야간 다크모드 적용' : '☀️ 주간 라이트모드 적용');
});

// Security Lock Screen (PIN: 1212)
const PASSCODE = '1212';
let enteredPin = '';
const lockScreen = document.getElementById('lockScreen');
const pinDots = document.querySelectorAll('#pinDotsRow .pin-dot');
const lockErrorMsg = document.getElementById('lockErrorMessage');
const lockCard = document.querySelector('.lock-card');

function updatePinDots() {
  pinDots.forEach((dot, idx) => {
    if (idx < enteredPin.length) {
      dot.classList.add('filled');
    } else {
      dot.classList.remove('filled');
    }
  });
}

function handleKeyInput(num) {
  if (enteredPin.length >= 4) return;
  enteredPin += num;
  updatePinDots();
  lockErrorMsg.classList.add('hidden');

  if (enteredPin.length === 4) {
    validatePin();
  }
}

function validatePin() {
  const currentPass = (appState.babyProfile && appState.babyProfile.passcode) || '1212';
  if (enteredPin === currentPass) {
    // Success
    lockScreen.classList.add('unlocked');
    sessionStorage.setItem('kkomkkom_authenticated', 'true');
    showToast('🍼 꼼꼼이 가족 공간에 오신 것을 환영합니다!');
    enteredPin = '';
    updatePinDots();
  } else {
    // Error Shake
    lockErrorMsg.classList.remove('hidden');
    lockCard.classList.add('shake');
    setTimeout(() => {
      lockCard.classList.remove('shake');
      enteredPin = '';
      updatePinDots();
    }, 500);
  }
}

function deleteLastPin() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
  }
}

function clearPin() {
  enteredPin = '';
  updatePinDots();
  lockErrorMsg.classList.add('hidden');
}

// Keypad Event Listeners
document.querySelectorAll('.keypad-btn[data-key]').forEach(btn => {
  btn.addEventListener('click', () => handleKeyInput(btn.dataset.key));
});

document.getElementById('deletePinBtn').addEventListener('click', deleteLastPin);
document.getElementById('clearPinBtn').addEventListener('click', clearPin);

// Keyboard Support
window.addEventListener('keydown', (e) => {
  if (lockScreen.classList.contains('unlocked')) return;
  if (e.key >= '0' && e.key <= '9') {
    handleKeyInput(e.key);
  } else if (e.key === 'Backspace') {
    deleteLastPin();
  } else if (e.key === 'Escape') {
    clearPin();
  }
});

// Re-lock Button in Header
document.getElementById('lockAppBtn').addEventListener('click', () => {
  sessionStorage.removeItem('kkomkkom_authenticated');
  lockScreen.classList.remove('unlocked');
  clearPin();
  showToast('🔒 화면이 잠겼습니다.');
});

// 12. Baby Profile & D-Day / Birth Calculator
function updateBabyProfileUI() {
  const profile = appState.babyProfile;
  if (!profile) return;

  // Title / Name
  const appSub = document.querySelector('.app-sub');
  if (appSub) {
    appSub.textContent = `우리 ${profile.name} 다이어리`;
  }

  // Calculate D-Day or D+
  const badgeEl = document.querySelector('.d-day-badge');
  if (badgeEl && profile.date) {
    const target = new Date(profile.date);
    const today = new Date();
    // Normalize to midnight for accurate day diff
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = target - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (profile.status === 'unborn') {
      if (diffDays > 0) {
        badgeEl.textContent = `출산 D-${diffDays}일`;
        badgeEl.style.backgroundColor = 'rgba(236, 72, 153, 0.18)';
        badgeEl.style.color = '#f43f5e';
      } else if (diffDays === 0) {
        badgeEl.textContent = `출산 예정일 D-Day! 👶`;
      } else {
        badgeEl.textContent = `예정일 +${Math.abs(diffDays)}일 경과`;
      }
    } else {
      // Born
      const ageDays = Math.abs(diffDays) + 1;
      badgeEl.textContent = `생후 ${ageDays}일차`;
      badgeEl.style.backgroundColor = 'rgba(249, 115, 22, 0.15)';
      badgeEl.style.color = 'var(--feed-color)';
    }
  }
}

// 13. Render Health Standards
function renderHealthStandards(ageKey = 'newborn') {
  const grid = document.getElementById('healthMetricsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const data = HEALTH_STANDARDS[ageKey] || HEALTH_STANDARDS.newborn;

  data.metrics.forEach(item => {
    const box = document.createElement('div');
    box.className = 'health-metric-box';
    box.innerHTML = `
      <div class="metric-box-title">
        <span>${item.icon}</span>
        <span>${item.title}</span>
      </div>
      <div class="metric-box-val">${item.val}</div>
      <div class="metric-box-sub">${item.sub}</div>
    `;
    grid.appendChild(box);
  });
}

// 14. Settings Modal Controller
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');

if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    // Populate form with current state
    const profile = appState.babyProfile || { status: 'unborn', name: '꼼꼼이', date: '2026-11-20', gender: 'secret' };
    
    document.getElementById('settingBabyName').value = profile.name;
    document.getElementById('settingBabyDate').value = profile.date;

    if (profile.status === 'unborn') {
      document.getElementById('statusUnbornRadio').checked = true;
      document.getElementById('dateInputLabel').textContent = '출산 예정일';
      document.getElementById('dateCalculationHint').textContent = '출산일까지 남은 일수(D-Day)가 메인 화면에 표시됩니다.';
    } else {
      document.getElementById('statusBornRadio').checked = true;
      document.getElementById('dateInputLabel').textContent = '아기 생년월일';
      document.getElementById('dateCalculationHint').textContent = '태어난 날짜로부터 생후 일수(D+일차)가 자동 계산됩니다.';
    }

    // Gender chips
    document.querySelectorAll('#genderChips .chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.gender === (profile.gender || 'secret'));
    });

    renderHealthStandards('newborn');
    openModal(settingsModal);
  });
}

// Radio Toggle for Birth Status
document.querySelectorAll('input[name="babyBirthStatus"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    const isUnborn = e.target.value === 'unborn';
    document.getElementById('dateInputLabel').textContent = isUnborn ? '출산 예정일' : '아기 생년월일';
    document.getElementById('dateCalculationHint').textContent = isUnborn
      ? '출산일까지 남은 일수(D-Day)가 메인 화면에 표시됩니다.'
      : '태어난 날짜로부터 생후 일수(D+일차)가 자동 계산됩니다.';
  });
});

// Gender Chips Toggle
document.querySelectorAll('#genderChips .chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#genderChips .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// Settings Tabs Navigation
document.querySelectorAll('.settings-tabs .segment-btn').forEach(tabBtn => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.settings-tabs .segment-btn').forEach(b => b.classList.remove('active'));
    tabBtn.classList.add('active');

    const targetTabId = tabBtn.dataset.tab;
    document.querySelectorAll('.settings-tab-pane').forEach(pane => {
      pane.classList.toggle('hidden', pane.id !== targetTabId);
    });
  });
});

// Health Guide Age Pills Navigation
document.querySelectorAll('.guide-age-pills .age-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.guide-age-pills .age-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderHealthStandards(pill.dataset.age);
  });
});

// Baby Info Form Submit
document.getElementById('babyInfoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const status = document.querySelector('input[name="babyBirthStatus"]:checked').value;
  const name = document.getElementById('settingBabyName').value.trim() || '우리 아기';
  const date = document.getElementById('settingBabyDate').value;
  const activeGenderChip = document.querySelector('#genderChips .chip.active');
  const gender = activeGenderChip ? activeGenderChip.dataset.gender : 'secret';

  appState.babyProfile.status = status;
  appState.babyProfile.name = name;
  appState.babyProfile.date = date;
  appState.babyProfile.gender = gender;

  saveState(appState);
  updateBabyProfileUI();
  closeModal(settingsModal);
  showToast(`👶 아기 정보가 저장되었습니다! (${status === 'unborn' ? '출산 예정 모드' : '생후 기록 모드'})`);
});

// Passcode Change Form Submit
document.getElementById('passcodeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const currentPass = (appState.babyProfile && appState.babyProfile.passcode) || '1212';
  const inputCurrent = document.getElementById('currentPasscodeInput').value;
  const inputNew = document.getElementById('newPasscodeInput').value;

  if (inputCurrent !== currentPass) {
    showToast('❌ 현재 비밀코드가 올바르지 않습니다.');
    return;
  }

  if (inputNew.length !== 4 || isNaN(inputNew)) {
    showToast('⚠️ 새 코드는 4자리 숫자여야 합니다.');
    return;
  }

  appState.babyProfile.passcode = inputNew;
  saveState(appState);
  document.getElementById('currentPasscodeInput').value = '';
  document.getElementById('newPasscodeInput').value = '';
  closeModal(settingsModal);
  showToast(`🔐 비밀코드가 [${inputNew}]로 변경되었습니다!`);
});

// Refresh Everything
function refreshAll() {
  updateBabyProfileUI();
  updateDashboard();
  renderGanttTimeline();
  renderEventList();
  renderMemos();
  renderMoments();
}

// Initial Run
window.addEventListener('DOMContentLoaded', () => {
  const curTime = getCurrentTimeStr();
  document.getElementById('feedTimeInput').value = curTime;
  document.getElementById('diaperTimeInput').value = curTime;
  
  // Set default baby profile date to 60 days ahead if unborn
  if (!appState.babyProfile) {
    appState.babyProfile = {
      status: 'unborn',
      name: '꼼꼼이',
      date: '2026-11-20',
      gender: 'secret',
      passcode: '1212'
    };
  }

  setActiveUser(appState.activeUser || '엄마');
  refreshAll();

  // Check Session Authentication
  const isAuth = sessionStorage.getItem('kkomkkom_authenticated');
  if (isAuth === 'true') {
    lockScreen.classList.add('unlocked');
  } else {
    lockScreen.classList.remove('unlocked');
  }
});


