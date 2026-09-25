/* Shared grammar coach: lesson content lives in grammar-lessons.js. No network required. */
(() => {
  'use strict';
  const course = window.roboticsGrammar;
  if (!course) return;
  const key = `robotics-english:grammar:${course.moduleId}:v${course.version}`;
  let saved = {}, storageAvailable = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed;
  } catch { storageAvailable = false; }
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const speaker = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
  const chinese = text => `<details class="gc-translation translation-collapse"><summary>查看中文</summary><p>${escape(text)}</p></details>`;
  function state(id) {
    if (!saved[id] || typeof saved[id] !== 'object' || Array.isArray(saved[id])) saved[id] = {};
    if (!saved[id].answers || typeof saved[id].answers !== 'object' || Array.isArray(saved[id].answers)) saved[id].answers = {};
    return saved[id];
  }
  function persist() {
    try { localStorage.setItem(key, JSON.stringify(saved)); storageAvailable = true; }
    catch { storageAvailable = false; }
    renderReview();
  }
  // Daily review has its own page. Course pages keep only their sentence teaching units.
  const review = document.querySelector('[data-grammar-review]');
  const dailySession = document.getElementById('daily-session');
  let activeLesson = null;
  if (review) {
    review.innerHTML = `<div class="gc-review-heading"><div><h2>先试一句，再看讲解</h2><p>优先巩固错题，再练还没学过的表达。</p></div><button type="button" class="gc-primary" data-review-next>开始今日练习 →</button></div><div class="gc-review-summary" role="status" aria-live="polite"></div><details class="daily-topic-picker"><summary>自己选一个主题 · ${course.topics.length} 个</summary><div class="gc-topics"></div></details><p class="gc-storage"></p>`;
    const lessonsHost = document.querySelector('[data-daily-lessons]');
    for (const id of Object.keys(course.lessons)) {
      const section = document.createElement('section');
      section.className = 'sentence';
      section.dataset.sentence = id;
      section.hidden = true;
      section.innerHTML = `<div class="daily-source"><span>产品课程 01 · 第 ${escape(id)} 句</span><a href="product_introduction_learning_guide.html#sentence-${escape(id)}">回到课程听原句 ↗</a></div>`;
      lessonsHost.append(section);
    }
  }

  function answerIsValid(answer, quiz) {
    return answer && Number.isInteger(answer.choice) && answer.choice >= 0 && answer.choice < quiz.choices.length;
  }
  function topicProgress(topic) {
    let answered = 0, correct = 0, spoken = 0, latest = 0;
    topic.lessons.forEach(id => {
      const s = state(id);
      course.lessons[id].quizzes.forEach((quiz, index) => {
        const answer = s.answers[index];
        if (answerIsValid(answer, quiz)) {
          answered++;
          if (answer.choice === quiz.correct) correct++;
          if (Number.isFinite(answer.at)) latest = Math.max(latest, answer.at);
        }
      });
      if (s.self === 'independent') spoken++;
    });
    return {answered, correct, spoken, latest, total: topic.lessons.reduce((n, id) => n + course.lessons[id].quizzes.length, 0)};
  }
  function renderReview() {
    const status=document.getElementById('learning-status');
    if(status){
      status.hidden=storageAvailable;
      status.textContent=storageAvailable?'':'当前浏览器无法保存练习记录；仍可学习，刷新后记录可能丢失。';
    }
    if (!review) {
      return;
    }
    const totals = {answered:0, correct:0, total:0};
    review.querySelector('.gc-topics').innerHTML = course.topics.map((topic, index) => {
      const p = topicProgress(topic);
      Object.keys(totals).forEach(k => totals[k] += p[k]);
      const label = p.answered === 0 ? '尚未练习' : p.correct < p.answered ? '有题目待巩固' : p.answered < p.total ? '继续完成练习' : '选择题已答对 · 再练开口';
      const date = p.latest ? `最近练习 ${new Date(p.latest).toLocaleDateString('zh-CN')}` : '从一句能用的话开始';
      return `<a class="gc-topic" data-topic="${escape(topic.id)}" href="#sentence-${topic.lessons[0]}"${topic.lessons.includes(activeLesson) ? ' aria-current="true"' : ''}><span class="gc-topic-number">${String(index + 1).padStart(2,'0')}</span><div><h3>${escape(topic.title)}</h3><p lang="en">${escape(topic.pattern)}</p></div><small>${p.answered ? `已答 ${p.answered}/${p.total}` : '未练习'}<br>${p.correct < p.answered ? '待巩固' : '→'}</small></a>`;
    }).join('');
    review.querySelector('.gc-review-summary').textContent = `课程累计 · 已练 ${totals.answered}/${totals.total} 题 · 最近答案正确 ${totals.correct} 题`;
    review.querySelector('.gc-storage').textContent = storageAvailable ? '' : '当前浏览器无法保存记录；本次仍可练习，关闭或刷新页面后记录可能丢失。';
    review.querySelector('[data-review-next]').textContent = totals.answered ? '继续练习 →' : '开始今日练习 →';
  }
  function chooseTarget(ids) {
    const questions = ids.flatMap(id => course.lessons[id].quizzes.map((quiz, index) => ({id, index, quiz, answer: state(id).answers[index]})));
    return questions.find(q => answerIsValid(q.answer,q.quiz) && q.answer.choice !== q.quiz.correct) || questions.find(q => !answerIsValid(q.answer,q.quiz)) || [...questions].sort((a,b) => (a.answer?.at || 0) - (b.answer?.at || 0))[0];
  }
  function openPractice(target) {
    const unit = document.querySelector(`[data-coach="${target.id}"]`);
    if (!unit) return;
    if (dailySession) {
      dailySession.hidden = false;
      review.hidden = true;
      activeLesson = target.id;
      document.querySelectorAll('[data-daily-lessons] > .sentence').forEach(section => {
        section.hidden = section.dataset.sentence !== target.id;
        if (section.hidden) section.querySelectorAll('audio').forEach(audio => audio.pause());
      });
      document.getElementById('daily-session-title').textContent = course.lessons[target.id].title;
      renderReview();
    }
    unit.open = true;
    unit.querySelector('[data-practice]').open = true;
    const question = unit.querySelector(`[data-quiz="${target.index}"]`);
    // Previously selected options are deliberately hidden on retry to allow retrieval practice.
    question.querySelectorAll('[data-choice]').forEach(b => { b.classList.remove('is-correct','is-wrong'); b.setAttribute('aria-pressed','false'); });
    question.querySelector('.gc-feedback').textContent = '重新选一个答案，检查自己是否能独立判断。';
    question.querySelector('[data-choice]').focus({preventScroll:true});
    question.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'center'});
  }
  review?.addEventListener('click', event => {
    const topicLink = event.target.closest('[data-topic]');
    if (topicLink) {
      event.preventDefault();
      openPractice(chooseTarget(course.topics.find(t => t.id === topicLink.dataset.topic).lessons));
    } else if (event.target.closest('[data-review-next]')) openPractice(chooseTarget(course.topics.flatMap(t => t.lessons)));
  });
  document.querySelector('[data-daily-next]')?.addEventListener('click', () => {
    const remaining = course.topics.flatMap(topic => topic.lessons).filter(id => id !== activeLesson);
    openPractice(chooseTarget(remaining.length ? remaining : [activeLesson]));
  });
  document.querySelector('[data-daily-back]')?.addEventListener('click', event => {
    event.preventDefault();
    dailySession.querySelectorAll('audio').forEach(audio => audio.pause());
    dailySession.hidden = true;
    review.hidden = false;
    activeLesson = null;
    renderReview();
    review.querySelector('[data-review-next]').focus({preventScroll:true});
    review.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
  });

  for (const [id, lesson] of Object.entries(course.lessons)) {
    const section = document.querySelector(`.sentence[data-sentence="${id}"]`);
    if (!section) continue;
    section.id = `sentence-${id}`;
    const coach = document.createElement('details');
    coach.className = 'gc-coach grammar-details';
    coach.dataset.coach = id;
    const s = state(id);
    coach.innerHTML = `<summary class="gc-goal"><span class="gc-goal-copy"><span class="gc-eyebrow">UNDERSTAND → BUILD → SPEAK</span><span class="gc-goal-title">${escape(lesson.title)}</span><span class="gc-goal-caption">${escape(lesson.goal)}</span></span><span class="gc-fold-label"><span class="gc-fold-open">展开讲解</span><span class="gc-fold-close">收起讲解</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></summary>
      <div class="gc-block"><h5><span>01</span> 把句子读懂</h5><p class="gc-hint">按英文顺序分块读。先找“谁”和“做什么”，再看补充信息。</p><div class="gc-parts">${lesson.parts.map(p => `<div class="gc-part gc-${escape(p[3])}"><span>${escape(p[2])}</span><strong lang="en">${escape(p[0])}</strong><small class="gc-part-zh" hidden>${escape(p[1])}</small></div>`).join('')}</div><button type="button" class="gc-text-button" data-chunk-zh aria-expanded="false">显示语块中文</button><div class="gc-rule"><span>先记住这一条</span><p>${escape(lesson.rule)}</p></div></div>
      <details class="gc-details grammar-details"><summary><span class="gc-step">02</span> 为什么这样写？<small>从简单句一步步搭起来</small></summary><div class="gc-detail-body"><div class="gc-builder"><div class="gc-builder-top"><strong>一步一步搭句</strong><span data-build-count></span></div><div data-build-content aria-live="polite"></div><div class="gc-build-controls"><button type="button" data-build-prev>← 上一步</button><button type="button" data-build-next>加一层信息 →</button></div></div><div class="gc-explanations">${lesson.why.map(([q,a]) => `<div><h5>${escape(q)}</h5><p>${escape(a)}</p></div>`).join('')}</div><details class="gc-glossary"><summary>语法术语忘记了？看白话解释</summary><dl>${course.glossary.map(([term,definition]) => `<dt>${escape(term)}</dt><dd>${escape(definition)}</dd>`).join('')}</dl></details></div></details>
      <details class="gc-details gc-practice" data-practice><summary><span class="gc-step">03</span> 我来组一句<small>选择 → 看原因 → 换成自己的话</small></summary><div class="gc-detail-body">${lesson.quizzes.map((quiz,index) => `<fieldset class="gc-quiz" data-quiz="${index}"><legend><span>练习 ${index + 1}</span> ${escape(quiz.prompt)}</legend><div class="gc-options" role="group" aria-label="练习 ${index + 1} 的选项">${quiz.choices.map((choice,c) => `<button type="button" data-choice="${c}" aria-pressed="false"><span aria-hidden="true">${'ABC'[c]}</span><span lang="en">${escape(choice)}</span></button>`).join('')}</div><p class="gc-feedback" role="status" aria-live="polite">选择后会解释为什么。</p><button type="button" class="gc-text-button" data-retry>遮住答案，再试一次</button></fieldset>`).join('')}<div class="gc-transfer"><span class="gc-eyebrow">MAKE IT YOURS</span><h5>换个产品，你会说吗？</h5><p>${escape(lesson.transfer.prompt)}</p><p class="gc-hint">这是语言练习情境。先开口说，再记下你的句子；不作为真实产品参数。</p><label for="gc-draft-${id}">我的英文草稿（也可以只开口练）</label><textarea id="gc-draft-${id}" rows="3" placeholder="Try saying it in your own words…" lang="en"></textarea><details class="gc-model"><summary>对照参考答案与检查点</summary><p lang="en" class="gc-model-answer">${escape(lesson.transfer.answer)}</p><p class="gc-hint">表达可以不止一种，按意思和结构自查。</p>${lesson.transfer.checks.map((check,index) => `<label class="gc-check"><input type="checkbox" data-check="${index}"><span>${escape(check)}</span></label>`).join('')}</details><fieldset class="gc-self"><legend>遮住参考答案，再说一次。现在的感受是：</legend><label><input type="radio" name="self-${id}" value="practice"> 还需要提示</label><label><input type="radio" name="self-${id}" value="independent"> 能独立说出（自评）</label></fieldset></div></div></details>
      <details class="gc-details" data-dialogue><summary><span class="gc-step">04</span> 放进客户对话<small>听问题 → 先回答 → 再听示范</small></summary><div class="gc-detail-body"><div class="gc-dialogue-question"><span class="gc-eyebrow">CUSTOMER ASKS</span><p lang="en">${escape(lesson.dialogue.question)}</p><button type="button" class="gc-listen" data-listen="question">${speaker}<span>听客户提问</span></button>${chinese(lesson.dialogue.questionZh)}</div><p class="gc-hint">暂停一下，试着用这句的语法回答。想好后，再展开示范。</p><details class="gc-model"><summary>查看并听示范回答</summary><p lang="en" class="gc-model-answer">${escape(lesson.dialogue.answer)}</p><button type="button" class="gc-listen" data-listen="answer">${speaker}<span>听示范回答</span></button>${chinese(lesson.dialogue.answerZh)}</details><p class="gc-audio-status" role="status" aria-live="polite"></p><p class="gc-hint">美式合成语音 · 慢速示范。可在下方播放器暂停或拖动进度。</p><audio class="gc-dialogue-audio" controls preload="none" aria-label="客户对话播放器"></audio></div></details>`;
    const previous = section.querySelector('.grammar-details');
    if (previous) previous.replaceWith(coach); else section.append(coach);
    if(dailySession){
      coach.querySelector('.gc-goal-title').textContent='练习与讲解';
      const explanation=document.createElement('details');explanation.className='daily-understand';
      const title=document.createElement('summary');title.textContent='看原句拆解与核心规则';
      explanation.append(title,coach.querySelector('.gc-block'));
      coach.append(explanation);
      coach.querySelector('.gc-goal').after(coach.querySelector('[data-practice]'));
    }
    let buildIndex = 0;
    function renderBuild() {
      const [en, zh, explanation] = lesson.build[buildIndex];
      coach.querySelector('[data-build-count]').textContent = `${buildIndex + 1} / ${lesson.build.length}`;
      coach.querySelector('[data-build-content]').innerHTML = `<p lang="en" class="gc-build-sentence">${escape(en)}</p><p class="gc-build-note">${escape(explanation)}</p>${chinese(zh)}`;
      coach.querySelector('[data-build-prev]').disabled = buildIndex === 0;
      coach.querySelector('[data-build-next]').disabled = buildIndex === lesson.build.length - 1;
    }
    renderBuild();
    function showAnswer(index, choice, historic = false) {
      const quiz = lesson.quizzes[index], field = coach.querySelector(`[data-quiz="${index}"]`);
      field.querySelectorAll('[data-choice]').forEach(b => {
        const selected = Number(b.dataset.choice) === choice;
        b.setAttribute('aria-pressed',String(selected));
        b.classList.toggle('is-correct',selected && choice === quiz.correct);
        b.classList.toggle('is-wrong',selected && choice !== quiz.correct);
      });
      const feedback = field.querySelector('.gc-feedback');
      feedback.className = `gc-feedback ${choice === quiz.correct ? 'gc-correct' : 'gc-wrong'}`;
      feedback.textContent = `${historic ? '上次选择：' : ''}${choice === quiz.correct ? '✓ ' : '再想一步：'}${quiz.feedback[choice]}`;
    }
    lesson.quizzes.forEach((quiz,index) => {
      if (answerIsValid(s.answers[index],quiz)) showAnswer(index,s.answers[index].choice,true);
    });
    const draft = coach.querySelector('textarea');
    draft.value = typeof s.draft === 'string' ? s.draft : '';
    draft.addEventListener('input', () => { s.draft = draft.value; persist(); });
    coach.querySelectorAll('[data-check]').forEach(input => { input.checked = !!s.checks?.[input.dataset.check]; });
    coach.querySelectorAll('.gc-self input').forEach(input => { input.checked = input.value === s.self; });
    coach.addEventListener('change',event => {
      if (event.target.matches('[data-check]')) {
        if (!s.checks || typeof s.checks !== 'object') s.checks = {};
        s.checks[event.target.dataset.check] = event.target.checked;
        persist();
      }
      if (event.target.matches('.gc-self input')) { s.self = event.target.value; persist(); }
    });
    const audio = coach.querySelector('.gc-dialogue-audio');
    const audioStatus = coach.querySelector('.gc-audio-status');
    function updateAudioButtons() {
      coach.querySelectorAll('[data-listen]').forEach(button => {
        const selected = audio.dataset.kind === button.dataset.listen;
        const playing = selected && !audio.paused && !audio.ended;
        const name = button.dataset.listen === 'question' ? '客户提问' : '示范回答';
        button.setAttribute('aria-pressed', String(playing));
        button.querySelector('span').textContent = `${playing ? '暂停' : selected && audio.ended ? '再听' : selected && audio.currentTime > 0 ? '继续' : '听'}${name}`;
      });
    }
    updateAudioButtons();
    audio.addEventListener('pause', () => { updateAudioButtons(); audioStatus.textContent = audio.ended ? '播放完毕，请跟读一遍。' : '已暂停，再次点击即可从这里继续。'; });
    audio.addEventListener('ended', () => { updateAudioButtons(); audioStatus.textContent = '播放完毕，请跟读一遍。'; });
    audio.addEventListener('seeked', updateAudioButtons);
    audio.addEventListener('play', () => {
      updateAudioButtons();
      audioStatus.textContent = '正在播放，注意问句和回答的语调。';
    });
    audio.addEventListener('error', () => { updateAudioButtons(); audioStatus.textContent = '音频未能加载，请确认学习包中的 grammar_practice 音频文件夹完整。'; });
    coach.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.matches('[data-build-prev]')) { buildIndex = Math.max(0, buildIndex - 1); renderBuild(); }
      if (button.matches('[data-build-next]')) { buildIndex = Math.min(lesson.build.length - 1,buildIndex + 1); renderBuild(); }
      if (button.matches('[data-chunk-zh]')) {
        const show = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded',String(show));
        button.textContent = show ? '收起语块中文' : '显示语块中文';
        coach.querySelectorAll('.gc-part-zh').forEach(el => { el.hidden = !show; });
      }
      if (button.matches('[data-choice]')) {
        const index = Number(button.closest('[data-quiz]').dataset.quiz), choice = Number(button.dataset.choice);
        const previousAttempts = s.answers[index]?.attempts;
        s.answers[index] = {choice, at:Date.now(), attempts: Number.isInteger(previousAttempts) ? previousAttempts + 1 : 1};
        showAnswer(index,choice); persist();
      }
      if (button.matches('[data-retry]')) openPractice({id,index:Number(button.closest('[data-quiz]').dataset.quiz)});
      if (button.matches('[data-listen]')) {
        const kind = button.dataset.listen;
        if (audio.dataset.kind === kind && !audio.paused) { audio.pause(); return; }
        if (audio.dataset.kind !== kind) {
          audio.pause();
          audio.dataset.kind = kind;
          audio.src = `english_pronunciation_audio/grammar_practice/${id.padStart(2,'0')}_${kind}.m4a`;
          audio.currentTime = 0;
          audio.dispatchEvent(new Event('sourcechange'));
        } else if (audio.ended) audio.currentTime = 0;
        audio.play().catch(error => {
          if (error.name === 'AbortError') return;
          updateAudioButtons();
          audioStatus.textContent = '暂时无法播放，请使用下方播放器重试，并检查音频文件是否完整。';
        });
      }
    });
  }
  // Shared playback, looping and exclusive audio are handled by audio-controls.js.
  renderReview();
  function openLinkedSentence() {
    const match = location.hash.match(/^#sentence-(\d+)$/);
    if (!match || !Object.hasOwn(course.lessons,match[1])) return;
    if (dailySession) openPractice(chooseTarget([match[1]]));
    else {
      const unit = document.querySelector(`[data-coach="${match[1]}"]`);
      if (unit) {
        unit.open = true;
        unit.closest('.sentence').scrollIntoView({block:'start'});
      }
    }
  }
  openLinkedSentence();
  window.addEventListener('hashchange',openLinkedSentence);
})();
