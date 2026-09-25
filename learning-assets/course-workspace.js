/* Presentation only: original sentences, audio positions and grammar history stay intact. */
(() => {
  'use strict';
  const main=document.querySelector('.course-main');
  if(!main)return;
  const sentences=[...main.querySelectorAll(':scope > .sentence')];
  const overview=document.getElementById('overview');
  const business=[...main.querySelectorAll(':scope > .intro')].filter(el=>el!==overview);
  const select=document.getElementById('course-sentence-select');
  const prev=main.querySelector('[data-course-prev]'),next=main.querySelector('[data-course-next]');
  const storageKey='robotics-english:reading:joint-arm-01';
  let selected=1,mode='sentence';
  try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(Number.isInteger(saved?.sentence)&&saved.sentence>=1&&saved.sentence<=sentences.length)selected=saved.sentence;}catch{}
  sentences.forEach(section=>{
    const option=document.createElement('option');option.value=section.dataset.sentence;option.textContent=section.querySelector('h3').textContent;select.append(option);
    const pronunciation=section.querySelector(':scope > .pronunciation');
    const notes=section.querySelector(':scope > .pronunciation-details');
    if(pronunciation&&notes)notes.querySelector('summary').after(pronunciation);
    const table=section.querySelector('table');
    if(table){const details=document.createElement('details');details.className='course-vocabulary';const title=document.createElement('summary');title.textContent=`本句词汇 · ${table.rows.length-1} 个`;const content=document.createElement('div');content.className='course-vocab-body';table.before(details);details.append(title,content);content.append(table);const player=section.querySelector('.listening-word-panel');if(player)content.append(player);}
  });
  function hide(el,value){el.hidden=value;if(value)el.querySelectorAll('audio').forEach(audio=>{if(!audio.paused)audio.pause();});}
  function render(){
    hide(overview,mode!=='listen');business.forEach(el=>hide(el,mode!=='business'));sentences.forEach(el=>hide(el,mode!=='sentence'||Number(el.dataset.sentence)!==selected));
    main.querySelector('[data-course-unit-nav]').hidden=mode!=='sentence';main.querySelector('[data-business-nav]').hidden=mode!=='business';
    main.querySelectorAll('[data-course-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.courseMode===mode)));
    select.value=String(selected);prev.disabled=selected===1;next.disabled=selected===sentences.length;
  }
  function remember(){try{localStorage.setItem(storageKey,JSON.stringify({sentence:selected}));}catch{}}
  function updateHash(hash){try{history.replaceState(null,'',hash);}catch{}}
  function showSentence(id,focus){selected=id;mode='sentence';render();remember();updateHash(`#sentence-${id}`);if(focus){const title=sentences[id-1].querySelector('h3');title.tabIndex=-1;title.focus({preventScroll:true});}}
  main.querySelectorAll('[data-course-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.courseMode;render();updateHash(mode==='sentence'?`#sentence-${selected}`:mode==='listen'?'#overview':'#business-versions');}));
  select.addEventListener('change',()=>showSentence(Number(select.value),false));
  prev.addEventListener('click',()=>{if(selected>1)showSentence(selected-1,true);});next.addEventListener('click',()=>{if(selected<sentences.length)showSentence(selected+1,true);});
  function routeHash(){const hash=location.hash;const match=hash.match(/^#sentence-([1-8])$/);if(match){selected=Number(match[1]);mode='sentence';}else if(hash==='#overview'){mode='listen';}else if(business.some(el=>`#${el.id}`===hash&&el.id)){mode='business';}render();}
  window.addEventListener('hashchange',routeHash);routeHash();
})();
