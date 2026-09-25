/* Presentation only: original sentences, audio positions and grammar history stay intact. */
(() => {
  'use strict';
  const main=document.querySelector('.course-main');
  if(!main)return;
  const sentences=[...main.querySelectorAll(':scope > .sentence')];
  const overview=document.getElementById('overview');
  const business=[...main.querySelectorAll(':scope > .intro')].filter(el=>el!==overview);
  const storageKey='robotics-english:reading:joint-arm-01';
  let selected=1,mode='listen';
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(Number.isInteger(saved?.sentence)&&saved.sentence>=1&&saved.sentence<=sentences.length)selected=saved.sentence;}catch{}
  sentences.forEach(section=>{
    const pronunciation=section.querySelector(':scope > .pronunciation');
    const notes=section.querySelector(':scope > .pronunciation-details');
    if(pronunciation&&notes)notes.querySelector('summary').after(pronunciation);
    const table=section.querySelector('table');
    if(table){const details=document.createElement('details');details.className='course-vocabulary';const title=document.createElement('summary');title.textContent=`本句词汇 · ${table.rows.length-1} 个`;const content=document.createElement('div');content.className='course-vocab-body';table.before(details);details.append(title,content);content.append(table);const player=section.querySelector('.listening-word-panel');if(player)content.append(player);}
  });
  function hide(el,value){el.hidden=value;if(value)el.querySelectorAll('audio').forEach(audio=>{if(!audio.paused)audio.pause();});}
  function render(){
    hide(overview,mode!=='listen');business.forEach(el=>hide(el,mode!=='business'));sentences.forEach(el=>hide(el,mode!=='sentence'));
    main.querySelector('[data-business-nav]').hidden=mode!=='business';
    main.querySelectorAll('[data-course-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.courseMode===mode)));
  }
  function remember(){try{localStorage.setItem(storageKey,JSON.stringify({sentence:selected}));}catch{}}
  function updateHash(hash){try{history.replaceState(null,'',hash);}catch{}}
  main.querySelectorAll('[data-course-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.courseMode;render();updateHash(mode==='sentence'?'#sentence-study':mode==='listen'?'#overview':'#business-versions');}));
  function routeHash(){const hash=location.hash;const match=hash.match(/^#sentence-([1-8])$/);if(match){selected=Number(match[1]);mode='sentence';render();sentences[selected-1]?.scrollIntoView({behavior:'auto',block:'start'});return;}if(hash==='#sentence-study'){mode='sentence';}else if(hash==='#overview'||!hash){mode='listen';}else if(business.some(el=>`#${el.id}`===hash&&el.id)){mode='business';}render();}
  window.addEventListener('hashchange',routeHash);routeHash();
})();
