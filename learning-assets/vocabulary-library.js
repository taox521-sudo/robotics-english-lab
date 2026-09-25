(() => {
  'use strict';
  const words = Array.isArray(window.ROBOTICS_VOCABULARY) ? window.ROBOTICS_VOCABULARY : [];
  const storageKey = 'robotics-english:vocabulary:mastered:v1';
  const list = document.getElementById('vocab-list');
  const empty = document.getElementById('vocab-empty');
  const search = document.getElementById('vocab-search');
  const onlyUnmastered = document.getElementById('only-unmastered');
  const audio = new Audio();
  audio.preload = 'none';
  audio.id = 'vocab-audio';
  audio.setAttribute('aria-hidden','true');
  audio.style.display = 'none';
  document.body.append(audio);
  let activeButton = null;
  let activeId = '';
  let mastered = readMastered();

  function readMastered() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(value) ? value.filter(id => words.some(word => word.id === id)) : []);
    } catch { return new Set(); }
  }
  function saveMastered() {
    try { localStorage.setItem(storageKey, JSON.stringify([...mastered])); } catch { /* private browsing can disable storage */ }
  }
  function escape(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function posGroup(word) {
    if (['n.','v.','adj.','adv.'].includes(word.pos)) return word.pos;
    return 'phrase';
  }
  function icon(name) {
    return name === 'pause' ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>';
  }
  function card(word) {
    const done = mastered.has(word.id);
    return `<article class="vocab-card${done ? ' is-mastered' : ''}" data-word-id="${escape(word.id)}" data-pos="${escape(posGroup(word))}">
      <div class="vocab-card-head"><div><h3 class="vocab-term" lang="en">${escape(word.term)}</h3><div class="vocab-meta"><span class="vocab-pos">${escape(word.pos)} ${escape(word.posZh)}</span><span class="vocab-source">${escape(word.source)}</span></div></div></div>
      <p class="vocab-ipa" lang="en">${escape(word.ipa)}</p>
      <p class="vocab-meaning">${escape(word.meaning)}</p>
      <div class="vocab-example"><span lang="en">${escape(word.example)}</span><em>${escape(word.exampleZh)}</em></div>
      <div class="vocab-card-actions"><button type="button" class="vocab-play" data-play="${escape(word.id)}" aria-pressed="false">${icon('play')}<span>播放发音</span></button><button type="button" class="vocab-master${done ? ' is-active' : ''}" data-master="${escape(word.id)}" aria-pressed="${done}">${done ? '✓ 已掌握' : '标记掌握'}</button><label class="vocab-loop"><input type="checkbox" data-loop="${escape(word.id)}" aria-label="循环播放 ${escape(word.term)}"><span>循环</span></label><span class="vocab-audio-note" data-audio-note="${escape(word.id)}" role="status" aria-live="polite"></span></div>
    </article>`;
  }
  function matches(word, filter, query, showOnly) {
    const haystack = [word.term,word.posZh,word.meaning,word.example,word.exampleZh,word.source].join(' ').toLowerCase();
    return (filter === 'all' || posGroup(word) === filter) && (!query || haystack.includes(query)) && (!showOnly || !mastered.has(word.id));
  }
  let filter = 'all';
  function render() {
    const query = (search.value || '').trim().toLowerCase();
    const visible = words.filter(word => matches(word,filter,query,onlyUnmastered.checked));
    list.innerHTML = visible.map(card).join('');
    empty.hidden = visible.length > 0;
    document.getElementById('summary-total').textContent = words.length;
    document.getElementById('summary-mastered').textContent = mastered.size;
    document.getElementById('summary-remaining').textContent = Math.max(0,words.length-mastered.size);
    document.getElementById('summary-visible').textContent = visible.length;
    document.getElementById('hero-total').textContent = words.length;
    list.querySelectorAll('[data-play]').forEach(button => button.addEventListener('click', () => playWord(button.dataset.play,button)));
    list.querySelectorAll('[data-master]').forEach(button => button.addEventListener('click', () => toggleMastered(button.dataset.master)));
  }
  function updateButtons() {
    list.querySelectorAll('[data-play]').forEach(button => {
      const playing = button === activeButton && !audio.paused && !audio.ended;
      button.setAttribute('aria-pressed',String(playing));
      button.innerHTML = `${icon(playing ? 'pause' : 'play')}<span>${playing ? '暂停播放' : button === activeButton && audio.currentTime > 0 ? '继续播放' : '播放发音'}</span>`;
    });
    list.querySelectorAll('.vocab-card').forEach(card => card.classList.toggle('is-playing',card.dataset.wordId === activeId && !audio.paused && !audio.ended));
  }
  function playWord(id,button) {
    const word = words.find(item => item.id === id);
    if (!word) return;
    const same = activeId === id;
    if (same && !audio.paused && !audio.ended) { audio.pause(); return; }
    if (!same) { audio.pause(); audio.src = word.audio; audio.currentTime = 0; activeId = id; activeButton = button; }
    const note = [...list.querySelectorAll('[data-audio-note]')].find(item => item.dataset.audioNote === id);
    if (note) note.textContent = '';
    audio.play().catch(error => { if (error.name !== 'AbortError' && note) note.textContent = '音频暂时无法播放，请检查学习包中的音频文件。'; });
    updateButtons();
  }
  function toggleMastered(id) {
    if (mastered.has(id)) mastered.delete(id); else mastered.add(id);
    saveMastered(); render();
  }
  search.addEventListener('input',render);
  onlyUnmastered.addEventListener('change',render);
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => {
    filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.classList.toggle('is-active',item === button));
    render();
  }));
  ['play','pause','ended','timeupdate'].forEach(event => audio.addEventListener(event,updateButtons));
  audio.addEventListener('error',() => { const note = activeId && [...list.querySelectorAll('[data-audio-note]')].find(item => item.dataset.audioNote === activeId); if (note) note.textContent = '音频暂时无法播放，请检查学习包中的音频文件。'; updateButtons(); });
  document.addEventListener('play',event => { if (event.target !== audio && event.target instanceof HTMLMediaElement) audio.pause(); },true);
  render();
})();
