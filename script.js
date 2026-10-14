const $=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

// hero entrance stagger
$('.hero .wrap>div:first-child>*').forEach((el,i)=>el.style.animationDelay=i*.12+'s');

// typing effect
const words=['Data Analyst','Power BI','SQL & Python','Excel & DAX'],typed=document.getElementById('typed');
if(!reduce){
  let w=0,n=words[0].length,dir=-1;
  (function tick(){
    n+=dir;typed.textContent=words[w].slice(0,n);
    let wait=dir<0?45:90;
    if(dir<0&&n===0){dir=1;w=(w+1)%words.length;wait=300}
    else if(dir>0&&n===words[w].length){dir=-1;wait=1800}
    setTimeout(tick,wait);
  })();
}

// reveal on scroll
$('.group').forEach(g=>$('.chip',g).forEach((c,i)=>c.style.setProperty('--i',i)));
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target;el.classList.add('in');io.unobserve(el);
  setTimeout(()=>el.classList.add('done'),1600);
}),{threshold:.15});
$('[data-reveal]').forEach(el=>{
  const sibs=[...el.parentElement.children].filter(x=>x.hasAttribute('data-reveal'));
  el.style.setProperty('--d',sibs.indexOf(el)*.1+'s');
  io.observe(el);
});

// scroll progress bar
const bar=document.querySelector('.progress'),root=document.documentElement;
addEventListener('scroll',()=>bar.style.setProperty('--p',root.scrollTop/(root.scrollHeight-root.clientHeight||1)),{passive:true});

// 3D tilt on cards (mouse only)
$('.tilt').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'||!el.classList.contains('done'))return;
    const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.setProperty('--ry',x*-8+'deg');el.style.setProperty('--rx',y*8+'deg');
  });
  el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
});

// ===== borrowed effects =====
const loader=document.getElementById('loader');
addEventListener('load',()=>setTimeout(()=>loader.classList.add('off'),reduce?0:1000));
setTimeout(()=>loader.classList.add('off'),3500);

// counters
$('[data-count]').forEach(el=>{
  const end=+el.dataset.count;
  if(reduce){el.textContent=end;return}
  setTimeout(()=>{const t0=performance.now();(function f(t){const p=Math.min((t-t0)/1200,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)},1600);
});

// nav scroll spy
const links=$('.nav ul a'),spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
$('[id]').filter(el=>links.some(a=>a.hash==='#'+el.id)).forEach(el=>spy.observe(el));

// connected-dots background (data network)
const cv=document.getElementById('net'),g=cv.getContext('2d');let W,H,pts;
function size(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;W=cv.width=r.width*d;H=cv.height=r.height*d;g.setTransform(d,0,0,d,0,0);W=r.width;H=r.height;pts=Array.from({length:Math.round(W*H/16000)},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}))}
function draw(){
  g.clearRect(0,0,W,H);
  pts.forEach((p,i)=>{
    if(!reduce){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
    g.fillStyle='rgba(92,200,255,.7)';g.beginPath();g.arc(p.x,p.y,1.8,0,7);g.fill();
    for(let k=i+1;k<pts.length;k++){const q=pts[k],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<120){g.strokeStyle=`rgba(92,160,255,${.25*(1-d/120)})`;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(q.x,q.y);g.stroke()}}
  });
  if(!reduce)requestAnimationFrame(draw);
}
size();draw();addEventListener('resize',()=>{size();if(reduce)draw()});

// ===== language toggle (AR / EN) =====
const langBtn=document.getElementById('lang');
function setLang(l){
  document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';
  $('[data-en]').forEach(el=>{if(!el.dataset.ar)el.dataset.ar=el.textContent;el.textContent=l==='en'?el.dataset.en:el.dataset.ar});
  langBtn.textContent=l==='en'?'عربي':'EN';
  try{localStorage.setItem('lang',l)}catch(e){}
}
langBtn.addEventListener('click',()=>setLang(document.documentElement.lang==='en'?'ar':'en'));
try{if(localStorage.getItem('lang')==='en')setLang('en')}catch(e){}
