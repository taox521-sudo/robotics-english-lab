(() => {
  'use strict';
  const words = Array.isArray(window.ROBOTICS_VOCABULARY) ? window.ROBOTICS_VOCABULARY : [];
  const byId = new Map(words.map(word => [word.id, word]));
  const storageKey = 'robotics-english:vocabulary:mastered:v1';
  const get = id => document.getElementById(id);
  const list = get('vocab-list');
  const search = get('vocab-search');
  const library = get('library-view');
  const flashView = get('flashcard-view');
  const flashContent = get('flashcard-content');
  const startButton = get('start-flashcards');
  // This attached element survives every list and flashcard render.
  const audio = get('vocab-audio');
  const player = get('vocab-player');
  const expanded = new Set();
  const translations = new Set();
  let filter = 'all';
  let status = 'all';
  let activeId = '';
  let activeScope = '';
  let playAttempt = 0;
  let session = null;
  let round = 0;
  const mastered = readMastered();

  function showStorageNote(message) {
    get('storage-note').textContent = message;
    get('storage-note').hidden = false;
  }
  function readMastered() {
    let raw;
    try { raw = localStorage.getItem(storageKey); }
    catch {
      showStorageNote('浏览器未允许读取本地自评记录。本次仍可练习，关闭页面后记录可能丢失。');
      return new Set();
    }
    if (!raw) return new Set();
    try {
      const value = JSON.parse(raw);
      if (!Array.isArray(value)) throw new TypeError('Expected a list of word ids');
      const valid = value.filter(id => typeof id === 'string' && byId.has(id));
      if (valid.length !== value.length) showStorageNote('部分旧自评记录无法识别，已保留可用记录。');
      return new Set(valid);
    } catch {
      showStorageNote('本地自评记录格式异常，暂时按未掌握显示。重新自评后可保存新的记录。');
      return new Set();
    }
  }
  function saveMastered() {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...mastered]));
      get('storage-note').hidden = true;
    } catch {
      showStorageNote('自评暂时无法保存到浏览器，仅保留在本次页面中；关闭页面后可能丢失。');
    }
  }
  function escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  }
  function isPhrase(word) { return /短语|缩写/.test(word.posZh) || /\s/.test(word.term) || word.pos === 'abbr.'; }
  function matchesPos(word) { return filter === 'all' || word.pos === filter || (filter === 'n.' && word.posZh.includes('名词')); }
  function visibleWords() {
    const query = search.value.trim().toLowerCase();
    return words.filter(word => {
      const text = [word.term, word.posZh, word.meaning, word.example, word.exampleZh, word.source].join(' ').toLowerCase();
      return matchesPos(word) && (!get('phrase-only').checked || isPhrase(word)) && (!query || text.includes(query)) &&
        (status === 'all' || (status === 'mastered' ? mastered.has(word.id) : !mastered.has(word.id)));
    });
  }
  function icon(playing) {
    return playing ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path d="M17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
  }
  function playButton(word) {
    return `<button type="button" class="vocab-play" data-play="${escape(word.id)}" aria-label="播放 ${escape(word.term)} 的发音" aria-pressed="false">${icon(false)}</button>`;
  }
  function wordRow(word) {
    const id = escape(word.id);
    const done = mastered.has(word.id);
    const open = expanded.has(word.id);
    const translated = translations.has(word.id);
    return `<article class="vocab-row vocab-card${done ? ' is-mastered' : ''}" data-word-id="${id}" data-pos="${escape(word.pos)}" data-phrase="${isPhrase(word)}">
      <div class="vocab-row-summary">
        <div class="vocab-row-copy"><h2 class="vocab-term" lang="en">${escape(word.term)}</h2><p class="vocab-ipa" lang="en">${escape(word.ipa)}</p><p class="vocab-meaning"><span class="vocab-pos">${escape(word.pos)} ${escape(word.posZh)}</span>${escape(word.meaning)}${done ? '<span class="vocab-self-mark">✓ 已掌握（自评）</span>' : ''}</p></div>
        <div class="vocab-row-actions">${playButton(word)}<button type="button" class="vocab-text-button vocab-expand" data-expand="${id}" aria-expanded="${open}" aria-controls="detail-${id}" aria-label="${open ? '收起' : '展开'} ${escape(word.term)} 的例句">例句 <span aria-hidden="true">⌄</span></button></div>
      </div>
      <div id="detail-${id}" class="vocab-detail"${open ? '' : ' hidden'}>
        <p class="vocab-example" lang="en">${escape(word.example)}</p>
        <button type="button" class="vocab-text-button vocab-translation-button" data-translation="${id}" aria-expanded="${translated}" aria-controls="translation-${id}">${translated ? '收起' : '显示'}例句中文</button>
        <p id="translation-${id}" class="vocab-example-zh"${translated ? '' : ' hidden'}>${escape(word.exampleZh)}</p>
        <div class="vocab-detail-bottom"><p class="vocab-source">来源：${escape(word.source)}</p><button type="button" class="vocab-secondary vocab-master" data-master="${id}" aria-pressed="${done}">${done ? '已掌握（自评）· 改为待复习' : '标记已掌握（自评）'}</button></div>
      </div>
    </article>`;
  }
  function updateStats() {
    get('summary-total').textContent = String(words.length);
    get('summary-mastered').textContent = String(mastered.size);
    const count = visibleWords().length;
    get('summary-visible').textContent = String(count);
    startButton.disabled = count === 0;
    startButton.textContent = `开始背词 · ${Math.min(5, count)} 个`;
  }
  function captureFocus() {
    const focused = document.activeElement;
    if (!list.contains(focused)) return null;
    for (const action of ['play', 'expand', 'master', 'translation']) {
      if (focused.dataset[action]) return {action, id:focused.dataset[action], index:[...list.children].indexOf(focused.closest('.vocab-row'))};
    }
    return null;
  }
  function restoreFocus(previous) {
    if (!previous) return;
    const same = [...list.querySelectorAll(`[data-${previous.action}]`)].find(button => button.dataset[previous.action] === previous.id);
    if (same) { same.focus({preventScroll:true}); return; }
    const nearestRow = list.children[Math.min(previous.index, list.children.length - 1)];
    (nearestRow ? nearestRow.querySelector('[data-play]') : search).focus();
  }
  function renderLibrary() {
    const previous = captureFocus();
    const visible = visibleWords();
    if (activeScope === 'library' && !visible.some(word => word.id === activeId)) suspendAudio();
    list.innerHTML = visible.map(wordRow).join('');
    get('vocab-empty').hidden = visible.length > 0;
    updateStats();
    updateAudioUI();
    restoreFocus(previous);
  }
  function currentScope() { return session ? 'session' : 'library'; }
  function activeWordVisible() {
    if (!activeId || activeScope !== currentScope()) return false;
    return session ? session.queue[session.index] === activeId : visibleWords().some(word => word.id === activeId);
  }
  function updateAudioUI() {
    const visible = activeWordVisible();
    const playing = visible && !audio.paused && !audio.ended;
    document.querySelectorAll('[data-play]').forEach(button => {
      const current = button.dataset.play === activeId && (session ? flashContent.contains(button) : list.contains(button));
      const word = byId.get(button.dataset.play);
      const pressed = current && playing;
      const verb = pressed ? '暂停' : current && audio.currentTime > 0 && !audio.ended ? '继续播放' : '播放';
      button.setAttribute('aria-pressed', String(pressed));
      button.setAttribute('aria-label', `${verb} ${word.term} 的发音`);
      button.innerHTML = icon(pressed);
    });
    list.querySelectorAll('[data-word-id]').forEach(row => row.classList.toggle('is-playing', !session && playing && row.dataset.wordId === activeId));
    player.hidden = !visible;
    document.body.classList.toggle('has-vocab-audio', visible);
    document.documentElement.classList.toggle('has-vocab-audio', visible);
    if (visible) get('player-word').textContent = byId.get(activeId).term;
  }
  function pauseAudio() {
    playAttempt += 1;
    audio.pause();
    updateAudioUI();
  }
  function suspendAudio() {
    activeScope = '';
    pauseAudio();
  }
  function playWord(id, restart = false) {
    const word = byId.get(id);
    if (!word) return;
    const same = activeId === id;
    if (same && !restart && !audio.paused && !audio.ended) { pauseAudio(); return; }
    if (!same) {
      audio.pause();
      audio.src = word.audio;
      activeId = id;
    }
    activeScope = currentScope();
    if (!activeWordVisible()) { suspendAudio(); return; }
    if (!same || restart || audio.ended) audio.currentTime = 0;
    get('audio-note').hidden = true;
    const attempt = ++playAttempt;
    const result = audio.play();
    if (result && typeof result.catch === 'function') result.catch(error => {
      if (error.name !== 'AbortError' && attempt === playAttempt && activeWordVisible()) {
        get('audio-note').textContent = '音频暂时无法播放，请检查学习包中的音频文件后重试。';
        get('audio-note').hidden = false;
        updateAudioUI();
      }
    });
    updateAudioUI();
  }
  function setMastered(id, done) {
    if (done) mastered.add(id); else mastered.delete(id);
    saveMastered();
    updateStats();
  }
  function startSession(ids) {
    suspendAudio();
    const queue = ids || visibleWords().filter(word => !mastered.has(word.id)).concat(visibleWords().filter(word => mastered.has(word.id))).slice(0, 5).map(word => word.id);
    if (!queue.length) return;
    session = {queue:[...queue], index:0, revealed:false, translated:false, known:[], again:[], round:++round};
    library.hidden = true;
    flashView.hidden = false;
    startButton.hidden = true;
    renderSession();
  }
  function renderSession() {
    if (!session) return;
    const {queue, index, revealed, translated} = session;
    const word = byId.get(queue[index]);
    if (!word) {
      get('flash-progress').textContent = `本组 ${queue.length} 个词已完成`;
      flashContent.innerHTML = `<div class="flashcard flashcard-finish"><h2 id="flash-finish-title" tabindex="-1">这一组练完了</h2><p>记住了 ${session.known.length} 个 · 还不熟 ${session.again.length} 个（本次自评）</p><p>把不熟的词再回忆一遍，也可以返回词库查看例句。</p><div class="flashcard-finish-actions"><button type="button" class="vocab-primary" data-session-action="retry">${session.again.length ? `再练还不熟的 ${session.again.length} 个` : '再练这一组'}</button><button type="button" class="vocab-secondary" data-session-action="exit">返回词库</button></div></div>`;
      updateAudioUI();
      get('flash-finish-title').focus();
      return;
    }
    get('flash-progress').textContent = `本组 ${index + 1} / ${queue.length}`;
    flashContent.innerHTML = `<article class="flashcard" data-flash-word="${escape(word.id)}">
      <p class="flashcard-prompt">${revealed ? '读一遍例句，再按自己的回忆情况自评。' : '先想一想中文含义，也可以听发音帮助回忆。'}</p>
      <div class="flashcard-term-row"><h2 id="flash-term" class="flashcard-term" lang="en" tabindex="-1">${escape(word.term)}</h2>${playButton(word)}</div>
      <p class="vocab-ipa" lang="en">${escape(word.ipa)}</p>
      ${revealed ? `<div id="flash-answer" class="flashcard-answer" tabindex="-1"><p class="vocab-meaning"><span class="vocab-pos">${escape(word.pos)} ${escape(word.posZh)}</span>${escape(word.meaning)}</p><p class="vocab-example" lang="en">${escape(word.example)}</p><button type="button" class="vocab-text-button vocab-translation-button" data-session-action="translation" aria-expanded="${translated}" aria-controls="flash-translation">${translated ? '收起' : '显示'}例句中文</button><p id="flash-translation" class="vocab-example-zh"${translated ? '' : ' hidden'}>${escape(word.exampleZh)}</p><p class="vocab-source">来源：${escape(word.source)}</p></div><div class="flashcard-grade"><button type="button" class="vocab-secondary" data-grade="again" data-round="${session.round}" data-index="${index}">还不熟</button><button type="button" class="vocab-primary" data-grade="known" data-round="${session.round}" data-index="${index}">记住了（自评）</button></div><p class="flashcard-help">自评会更新词库记录；每次选择后进入下一个词。</p>` : '<button type="button" id="reveal-answer" class="vocab-primary flashcard-reveal" data-session-action="reveal">想好了，揭晓含义</button>'}
    </article>`;
    updateAudioUI();
    (revealed ? get('flash-answer') : get('flash-term')).focus();
  }
  function gradeWord(button) {
    if (!session || !session.revealed || Number(button.dataset.round) !== session.round || Number(button.dataset.index) !== session.index) return;
    const id = session.queue[session.index];
    if (!id) return;
    const known = button.dataset.grade === 'known';
    // Advance the queue before any rerender; an old button cannot grade twice.
    session.index += 1;
    session.revealed = false;
    session.translated = false;
    session[known ? 'known' : 'again'].push(id);
    suspendAudio();
    setMastered(id, known);
    renderSession();
  }
  function exitSession() {
    suspendAudio();
    session = null;
    flashView.hidden = true;
    flashContent.innerHTML = '';
    library.hidden = false;
    startButton.hidden = false;
    renderLibrary();
    (startButton.disabled ? search : startButton).focus();
  }
  list.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !list.contains(button) || session) return;
    if (button.dataset.play) playWord(button.dataset.play);
    else if (button.dataset.expand) {
      const id = button.dataset.expand;
      if (expanded.has(id)) expanded.delete(id); else expanded.add(id);
      renderLibrary();
    } else if (button.dataset.translation) {
      const id = button.dataset.translation;
      if (translations.has(id)) translations.delete(id); else translations.add(id);
      renderLibrary();
    } else if (button.dataset.master) {
      const id = button.dataset.master;
      setMastered(id, !mastered.has(id));
      renderLibrary();
    }
  });
  flashContent.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || !flashContent.contains(button) || !session) return;
    if (button.dataset.play) playWord(button.dataset.play);
    else if (button.dataset.grade) gradeWord(button);
    else if (button.dataset.sessionAction === 'reveal') { session.revealed = true; renderSession(); }
    else if (button.dataset.sessionAction === 'translation') {
      session.translated = !session.translated;
      get('flash-translation').hidden = !session.translated;
      button.setAttribute('aria-expanded', String(session.translated));
      button.textContent = `${session.translated ? '收起' : '显示'}例句中文`;
    } else if (button.dataset.sessionAction === 'exit') exitSession();
    else if (button.dataset.sessionAction === 'retry') startSession(session.again.length ? session.again : session.queue);
  });
  search.addEventListener('input', renderLibrary);
  get('phrase-only').addEventListener('change', renderLibrary);
  get('toggle-filters').addEventListener('click', () => {
    const hidden = !get('extra-filters').hidden;
    get('extra-filters').hidden = hidden;
    get('toggle-filters').setAttribute('aria-expanded', String(!hidden));
  });
  document.querySelectorAll('[data-status]').forEach(button => button.addEventListener('click', () => {
    status = button.dataset.status;
    document.querySelectorAll('[data-status]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderLibrary();
  }));
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderLibrary();
  }));
  get('reset-filters').addEventListener('click', () => {
    search.value = '';
    filter = 'all';
    status = 'all';
    get('phrase-only').checked = false;
    document.querySelectorAll('[data-filter], [data-status]').forEach(button => button.setAttribute('aria-pressed', String((button.dataset.filter || button.dataset.status) === 'all')));
    renderLibrary();
    search.focus();
  });
  startButton.addEventListener('click', () => startSession());
  get('exit-session').addEventListener('click', exitSession);
  get('audio-loop').addEventListener('change', () => { audio.loop = get('audio-loop').checked; });
  get('restart-audio').addEventListener('click', () => { if (activeWordVisible()) playWord(activeId, true); });
  get('close-player').addEventListener('click', () => {
    suspendAudio();
    const area = session ? flashContent : list;
    const button = [...area.querySelectorAll('[data-play]')].find(item => item.dataset.play === activeId);
    if (button) button.focus();
  });
  audio.addEventListener('play', () => {
    if (!activeWordVisible()) audio.pause();
    updateAudioUI();
  });
  ['pause', 'ended', 'timeupdate', 'seeked'].forEach(event => audio.addEventListener(event, updateAudioUI));
  audio.addEventListener('error', () => {
    if (!activeWordVisible()) return;
    get('audio-note').textContent = '音频暂时无法播放，请检查学习包中的音频文件后重试。';
    get('audio-note').hidden = false;
    updateAudioUI();
  });
  document.addEventListener('play', event => { if (event.target !== audio && event.target instanceof HTMLMediaElement) pauseAudio(); }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAudio(); });
  window.addEventListener('pagehide', suspendAudio);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (link && !link.getAttribute('href').startsWith('#')) suspendAudio();
  });
  renderLibrary();
})();
