/* Shared navigation. Learning progress is never inferred from merely opening a page. */
(() => {
  'use strict';
  const icons={home:'<path d="m3 10 9-7 9 7v10H3Z M9 20v-7h6v7"/>',course:'<path d="M12 5v16M3 3c4 0 6 0 9 2 3-2 5-2 9-2v16c-4 0-6 0-9 2-3-2-5-2-9-2Z"/>',daily:'<path d="m4 6 2 2 3-4M12 6h8M4 14l2 2 3-4M12 14h8M12 20h8"/>',vocabulary:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 16 4-9 4 9M10 13h4"/>'};
  const links=[['home','首页','robotics_english_library.html'],['course','产品课程','product_introduction_learning_guide.html'],['daily','今日练习','daily_practice.html'],['vocabulary','单词库','vocabulary_library.html']];
  const current=document.body.dataset.page;
  const nav=links.map(([id,label,url])=>`<a href="${url}"${id===current?' aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${icons[id]}</svg><span>${label}</span></a>`).join('');
  const header=document.querySelector('[data-site-header]');
  if(header) header.innerHTML=`<a class="site-skip" href="#main-content">跳到学习内容</a><header class="site-header"><div class="site-header-inner"><a class="site-brand" href="robotics_english_library.html"><span class="site-brand-mark" aria-hidden="true">R</span><span class="site-brand-copy">Robotics English <small>行业英语学习</small></span></a><nav class="site-nav" aria-label="网站导航">${nav}</nav></div></header>`;
  const bottom=document.querySelector('[data-site-nav]');
  if(bottom) bottom.innerHTML=`<nav class="site-mobile-nav" aria-label="手机导航">${nav}</nav>`;
  document.querySelectorAll('[data-icon]').forEach(el=>{if(icons[el.dataset.icon])el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[el.dataset.icon]}</svg>`;});
  if(current!=='home') return;
  try {
    const progress=JSON.parse(localStorage.getItem('robotics-english:reading:joint-arm-01')||'null');
    if(progress&&Number.isInteger(progress.sentence)&&progress.sentence>=1&&progress.sentence<=8){
      const resume=document.querySelector('[data-resume]');
      resume.href=`product_introduction_learning_guide.html#sentence-${progress.sentence}`;
      resume.querySelector('small').textContent=`上次停留：第 ${progress.sentence} 句 · 机器人关节与机械臂`;
    }
    const raw=JSON.parse(localStorage.getItem('robotics-english:vocabulary:mastered:v1')||'[]');
    const known=new Set(Array.isArray(raw)?raw:[]);
    const words=window.ROBOTICS_VOCABULARY||[];
    const mastered=words.filter(w=>known.has(w.id)).length;
    const count=document.querySelector('[data-home-vocab]');
    if(count)count.textContent=`${words.length} 个词汇 · ${words.length-mastered} 个待复习`;
  }catch{/* The home page remains usable without saved progress. */}
})();
