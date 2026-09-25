/* One playback policy for the transcript, sentences, dialogue and vocabulary. */
(() => {
  'use strict';
  let playerCount = 0;
  const icons = {
    play: '<path d="m8 5 11 7-11 7Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    restart: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
    speaker: '<path d="M11 5 6 9H3v6h3l5 4V5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    repeat: '<path d="m16 3 4 4-4 4M4 11V9a2 2 0 0 1 2-2h14M8 21l-4-4 4-4m12 0v2a2 2 0 0 1-2 2H4"/>',
    speed: '<path d="M5 18h14M7 14h10M9 10h6M11 6h2"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
  function buttonLabel(button, label, glyph) {
    button.innerHTML = `${icon(glyph)}<span></span>`;
    button.querySelector('span').textContent = label;
    button.querySelector('span').className = 'listening-sr-only';
  }
  function enhance(audio, existingBar) {
    if (audio.dataset.listeningReady) return;
    audio.dataset.listeningReady = 'true';
    if (!audio.id) audio.id = `listening-audio-${++playerCount}`;
    const bar = existingBar || document.createElement('div');
    bar.classList.add('listening-tools');
    bar.dataset.audioControls = audio.id;
    bar.setAttribute('role','group');
    const context=audio.getAttribute('aria-label')||audio.closest('.sentence')?.querySelector('h3')?.textContent||(audio.id==='full-sync-audio'?'全文音频':'学习音频');
    bar.setAttribute('aria-label',`${context}：播放控制`);
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
    restart.setAttribute('aria-label',`从头播放 · ${context}`);
    restart.title='从头播放';
    const label = document.createElement('label');
    label.className = 'listening-loop';
    label.innerHTML = `<input type="checkbox" data-audio-loop aria-label="循环播放"><span class="listening-loop-face">${icon('repeat')}<span class="listening-sr-only">循环</span></span>`;
    label.title = '反复播放当前音频，直到手动暂停；切换到其他音频会暂停本段。';
    const loop = label.querySelector('input');
    loop.checked = audio.loop;
    loop.setAttribute('aria-controls',audio.id);
    loop.addEventListener('change', () => {
      audio.loop = loop.checked;
      update();
    });
    const note = document.createElement('span');
    note.className = 'listening-note';
    note.setAttribute('role','status');
    note.setAttribute('aria-live','polite');
    const followStatus = existingBar?.querySelector('#follow-status');
    // Two rows keep frequent actions visible and never overlay the lesson text.
    const mainRow=document.createElement('div');mainRow.className='listening-main';
    const timeline=document.createElement('div');timeline.className='listening-timeline';
    const metadata=document.createElement('div');metadata.className='listening-meta';
    const state=document.createElement('span');state.className='listening-state listening-sr-only';
    const seek=document.createElement('input');
    seek.type='range'; seek.min='0'; seek.max='1'; seek.step='0.1'; seek.value='0';
    seek.className='listening-seek'; seek.setAttribute('aria-label',`${context}：播放进度`); seek.setAttribute('aria-controls',audio.id);
    const time=document.createElement('span');time.className='listening-time';
    const options=document.createElement('div');options.className='listening-options';
    options.append(restart,label);
    const speed=document.createElement('label');speed.className='listening-speed';
    speed.innerHTML=`<span class="listening-speed-icon">${icon('speed')}</span><span class="listening-speed-value" aria-hidden="true">1×</span><select aria-label="音频播放速度" title="播放速度"><option value="0.75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option></select>`;
    let selectedRate=audio.playbackRate||1;
    const speedSelect=speed.querySelector('select');speedSelect.addEventListener('change',()=>{selectedRate=Number(speedSelect.value);audio.defaultPlaybackRate=selectedRate;audio.playbackRate=selectedRate;});
    audio.addEventListener('loadedmetadata',()=>{audio.playbackRate=selectedRate;});
    options.append(speed);
    metadata.append(state,time);timeline.append(metadata,seek);mainRow.append(toggle,timeline);
    bar.replaceChildren(mainRow,options,note);
    if(audio.id==='full-sync-audio'){
      const title=document.createElement('span');title.className='listening-dock-title';title.textContent='全文音频';title.setAttribute('aria-hidden','true');
      bar.insertBefore(title,mainRow);
      bar.dataset.fullDock='true';
    }
    if(followStatus){followStatus.classList.add('listening-sr-only');bar.append(followStatus);}
    const clock=value=>`${Math.floor(value/60)}:${String(Math.floor(value%60)).padStart(2,'0')}`;
    function syncProgress(){
      const duration=Number.isFinite(audio.duration)?audio.duration:0;
      seek.disabled=!duration;seek.max=String(duration||1);seek.value=String(audio.currentTime||0);
      time.textContent=`${clock(audio.currentTime||0)} / ${duration?clock(duration):'—'}`;
      seek.setAttribute('aria-valuetext',time.textContent);
      seek.style.setProperty('--played',`${duration?Math.min(100,Math.max(0,audio.currentTime/duration*100)):0}%`);
    }
    seek.addEventListener('input',()=>{if(Number.isFinite(audio.duration)){audio.currentTime=Number(seek.value);audio.dispatchEvent(new Event('timeupdate'));}});
    for(const name of ['timeupdate','loadedmetadata','durationchange','emptied','sourcechange'])audio.addEventListener(name,syncProgress);
    audio.addEventListener('ratechange',()=>{speedSelect.value=String(audio.playbackRate);speed.querySelector('.listening-speed-value').textContent=`${audio.playbackRate}×`;});
    syncProgress();
    if (!existingBar) audio.after(bar);
    function update() {
      const loaded = !!audio.getAttribute('src');
      const playing = !audio.paused && !audio.ended;
      const text = !loaded ? '先选择音频' : playing ? '暂停' : audio.ended ? '再听一遍' : audio.currentTime > 0 ? '继续播放' : audio.id === 'full-sync-audio' ? '播放全文' : '播放';
      toggle.disabled = restart.disabled = !loaded;
      toggle.setAttribute('aria-pressed',String(playing));
      toggle.setAttribute('aria-label',`${text} · ${context}`);
      toggle.title=text;
      buttonLabel(toggle,text,playing ? 'pause' : 'play');
      state.textContent=!loaded?'先选一段音频':playing?'正在播放':audio.ended?'播放完毕':audio.currentTime>0?'已暂停 · 可继续':'点击播放';
      bar.classList.toggle('is-playing',playing);
      loop.checked = audio.loop;
      label.classList.toggle('is-active',audio.loop);
      label.querySelector('.listening-loop-face>span').textContent=audio.loop?'循环中':'循环';
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
    audio.addEventListener('play', () => { note.textContent = ''; });
    audio.addEventListener('pause', () => { note.textContent = ''; });
    audio.addEventListener('waiting',()=>{if(!audio.paused)state.textContent='正在缓冲…';});
    audio.addEventListener('playing',update);
    audio.addEventListener('error', () => { update(); note.textContent = '音频未能加载，请检查学习包中的音频文件。'; });
    update();
  }

  // Native looping handles the repeat boundary without rebuilding or reloading a player.
  document.addEventListener('toggle',event=>{
    if(event.target instanceof HTMLDetailsElement&&!event.target.open)event.target.querySelectorAll('audio').forEach(audio=>{if(!audio.paused)audio.pause();});
  },true);
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
