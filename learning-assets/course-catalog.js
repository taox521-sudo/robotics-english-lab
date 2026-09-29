// Single source for the product-course list shown on the learning home page.
window.ROBOTICS_COURSES = [
  { id:'01', title:'机器人关节与机械臂', meta:'研发经历 · 自研部件 · 高扭矩 · 轻量负载 · MTBF', short:'8 句精读 · 核心部件 · 产品优势', href:'product_introduction_learning_guide.html#sentence-study' },
  { id:'02', title:'全球远程作业网络', meta:'远程操控 · 真实作业 · 高价值数据 · 自主能力闭环', short:'9 句精读 · 远程操控 · 数据闭环', href:'product_introduction_learning_guide.html#remote-operations-module' }
];
(() => {
  const courses=window.ROBOTICS_COURSES||[];
  const host=document.querySelector('[data-course-catalog]');
  if(!host)return;
  host.innerHTML=courses.map(course=>`<a class="home-course-row" href="${course.href}"><span class="home-course-number">${course.id}</span><div><h3>${course.title}</h3><p>${course.meta}</p></div><span class="home-card-arrow" aria-hidden="true">→</span></a>`).join('');
  document.querySelectorAll('[data-home-course-count]').forEach(el=>el.textContent=`${courses.length} 个产品模块`);
  const first=courses[0];
  if(first){
    document.querySelectorAll('[data-course-primary]').forEach(card=>{
      card.href=first.href;
      const title=card.querySelector('[data-home-course-title]');if(title)title.textContent=first.title;
      const meta=card.querySelector('[data-home-course-meta]');if(meta)meta.textContent=first.short;
    });
  }
})();
