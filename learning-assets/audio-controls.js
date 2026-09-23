/* One playback policy for the transcript, sentences, dialogue and vocabulary. */
(() => {
  'use strict';
  let playerCount = 0;
  const icons = {
    play: '<path d="m8 5 11 7-11 7Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    restart: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
    speaker: '<path d="M11 5 6 9H3v6h3l5 4V5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  function buttonLabel(button, label, glyph) {
    button.innerHTML = `${icon(glyph)}<span></span>`;
    button.querySelector('span').textContent = label;
  }
  function enhance(audio, existingBar) {
    if (audio.dataset.listeningReady) return;
    audio.dataset.listeningReady = 'true';
    if (!audio.id) audio.id = `listening-audio-${++playerCount}`;
    const bar = existingBar || document.createElement('div');
    bar.classList.add('listening-tools');
    bar.dataset.audioControls = audio.id;
    bar.setAttribute('role','group');
    bar.setAttribute('aria-label',`${audio.getAttribute('aria-label') || '音频'}：播放与循环设置`);
    const toggle = existingBar ? bar.querySelector('#follow-start') : document.createElement('button');
    const restart = existingBar ? bar.querySelector('#follow-stop') : document.createElement('button');
    toggle.type = restart.type = 'button';
    toggle.classList.add('listening-toggle');
    restart.classList.add('listening-restart');
    toggle.dataset.audioToggle = '';
    restart.dataset.audioRestart = '';
    toggle.setAttribute('aria-controls',audio.id);
    restart.setAttribute('aria-controls',audio.id);
    buttonLabel(restart,'从头播放','restart');
    if (!existingBar) bar.append(toggle,restart);
    const label = document.createElement('label');
    label.className = 'listening-loop';
    label.innerHTML = '<input type="checkbox" data-audio-loop><span>循环播放</span>';
    label.title = '反复播放当前音频，直到手动暂停；切换到其他音频会暂停本段。';
    const loop = label.querySelector('input');
    loop.checked = audio.loop;
    loop.setAttribute('aria-controls',audio.id);
    loop.addEventListener('change', () => {
      audio.loop = loop.checked;
      note.textContent = audio.loop ? '循环已开启 · 可随时暂停，原位继续' : '循环已关闭';
    });
    const note = document.createElement('span');
    note.className = 'listening-note';
    note.setAttribute('role','status');
    note.setAttribute('aria-live','polite');
    const followStatus = existingBar?.querySelector('#follow-status');
    if (followStatus) { bar.insertBefore(label,followStatus); bar.insertBefore(note,followStatus); }
    else bar.append(label,note);
    if (!existingBar) audio.after(bar);
    function update() {
      const loaded = !!audio.getAttribute('src');
      const playing = !audio.paused && !audio.ended;
      const text = !loaded ? '先选择音频' : playing ? '暂停' : audio.ended ? '再听一遍' : audio.currentTime > 0 ? '继续播放' : audio.id === 'full-sync-audio' ? '播放全文' : '播放';
      toggle.disabled = restart.disabled = !loaded;
      toggle.setAttribute('aria-pressed',String(playing));
      buttonLabel(toggle,text,playing ? 'pause' : 'play');
      loop.checked = audio.loop;
    }
    let request = 0;
    function play(fromStart) {
      const currentRequest = ++request;
      note.textContent = '';
      if (fromStart || audio.ended) audio.currentTime = 0;
      // Seeking to zero while already playing may not emit a new play event.
      if (fromStart) audio.dispatchEvent(new Event('timeupdate'));
      audio.play().catch(error => {
        if (error.name === 'AbortError' || currentRequest !== request) return;
        update();
        note.textContent = '暂时无法播放，请检查音频文件或点击播放器重试。';
      });
    }
    toggle.addEventListener('click', () => {
      if (!audio.paused && !audio.ended) { request++; audio.pause(); }
      else play(false);
    });
    restart.addEventListener('click', () => play(true));
    for (const name of ['play','pause','ended','seeked','loadedmetadata','sourcechange','emptied']) audio.addEventListener(name,update);
    audio.addEventListener('play', () => { note.textContent = audio.loop ? '循环播放中 · 可随时暂停' : ''; });
    audio.addEventListener('pause', () => { if (!audio.ended) note.textContent = '已暂停 · 点击继续播放可从当前位置接着听'; });
    audio.addEventListener('error', () => { update(); note.textContent = '音频未能加载，请检查学习包中的音频文件。'; });
    update();
  }

  // Native looping handles the repeat boundary without rebuilding or reloading a player.
  document.addEventListener('play',event => {
    const current = event.target;
    if (!(current instanceof HTMLMediaElement)) return;
    document.querySelectorAll('audio').forEach(audio => {
      if (audio !== current && !audio.paused) audio.pause();
    });
    if (current.dataset.wordPlayer) window.currentWordAudio = current;
    if (current.id !== 'full-sync-audio') document.querySelectorAll('.full-sync-playing').forEach(el => el.classList.remove('full-sync-playing'));
  },true);
  document.querySelectorAll('audio').forEach(audio => {
    enhance(audio,audio.id === 'full-sync-audio' ? document.querySelector('.follow-toolbar') : null);
  });

  // A persistent player beneath each vocabulary table keeps the selected word's position.
  document.querySelectorAll('.sentence').forEach(section => {
    const buttons = [...section.querySelectorAll('.word-audio[data-audio-src]')];
    if (!buttons.length) return;
    const panel = document.createElement('div');
    panel.className = 'listening-word-panel';
    panel.hidden = true;
    panel.innerHTML = '<p class="listening-word-title">单词磨耳朵 · <strong lang="en"></strong></p><p class="listening-word-hint">点同一个小喇叭可暂停或继续，开启循环可反复听这个单词。</p>';
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.preload = 'none';
    audio.dataset.wordPlayer = 'true';
    audio.setAttribute('aria-label',`第 ${section.dataset.sentence} 句单词播放器`);
    panel.append(audio);
    section.querySelector('table').after(panel);
    enhance(audio);
    let selected;
    function updateWords() {
      buttons.forEach(button => {
        const current = button === selected;
        const playing = current && !audio.paused && !audio.ended;
        const action = playing ? '暂停' : current && audio.ended ? '再听' : current && audio.currentTime > 0 ? '继续播放' : '播放';
        button.setAttribute('aria-label',`${action}单词发音：${button.dataset.audioLabel}`);
        button.setAttribute('aria-pressed',String(playing));
        button.title = button.getAttribute('aria-label');
        button.innerHTML = icon(playing ? 'pause' : 'speaker');
      });
    }
    for (const event of ['play','pause','ended','seeked','error']) audio.addEventListener(event,updateWords);
    buttons.forEach(button => {
      button.setAttribute('aria-controls',audio.id);
      button.addEventListener('click', () => {
        panel.hidden = false;
        const sameWord = selected === button;
        if (sameWord && !audio.paused && !audio.ended) { audio.pause(); return; }
        if (!sameWord) {
          audio.pause();
          selected = button;
          audio.src = button.dataset.audioSrc;
          audio.currentTime = 0;
          panel.querySelector('strong').textContent = button.dataset.audioLabel;
          audio.dispatchEvent(new Event('sourcechange'));
        } else if (audio.ended) audio.currentTime = 0;
        window.currentWordAudio = audio;
        audio.play().catch(error => {
          if (error.name === 'AbortError') return;
          updateWords();
          panel.querySelector('.listening-note').textContent = '单词音频暂时无法播放，请确认文件完整后重试。';
        });
      });
    });
    updateWords();
  });
})();
