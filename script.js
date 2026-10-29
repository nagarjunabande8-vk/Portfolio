var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

/* concept icons (thin line) */
var ICON={
  sql:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  ai:'<rect x="6" y="6" width="12" height="12" rx="2.5"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/><path d="M10 12h4M12 10v4"/>',
  ml:'<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="19" cy="17" r="2"/><path d="M7 7l3.2 3.6M7 17l3.2-3.6M14 11l3.2-3M14 13l3.2 3"/>',
  llm:'<path d="M4 5h16v11H10l-5 4v-4H4z"/><path d="M8 9h8M8 12h5"/>',
  rag:'<path d="M6 3h8l4 4v6"/><path d="M6 3v18h6"/><circle cx="16" cy="17" r="3"/><path d="M18.2 19.2L21 22"/>',
  prompt:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10l3 2-3 2M12 15h5"/>',
  dsa:'<circle cx="12" cy="5" r="2"/><circle cx="6" cy="13" r="2"/><circle cx="18" cy="13" r="2"/><circle cx="3.5" cy="20" r="1.5"/><circle cx="8.5" cy="20" r="1.5"/><path d="M11 6.8L7 11.2M13 6.8l4 4.4M5.2 14.8L4 18.6M6.8 14.8L8 18.6"/>',
  dbms:'<ellipse cx="12" cy="5" rx="8" ry="2.5"/><path d="M4 5v5c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5M4 10v5c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-5"/><path d="M8 20h8"/>',
  os:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 8h18M8 21h8M12 17v4"/><circle cx="6" cy="6" r=".4"/>',
  net:'<circle cx="12" cy="12" r="2.4"/><circle cx="4.5" cy="5.5" r="1.8"/><circle cx="19.5" cy="5.5" r="1.8"/><circle cx="4.5" cy="18.5" r="1.8"/><circle cx="19.5" cy="18.5" r="1.8"/><path d="M6 7l4.3 3.6M18 7l-4.3 3.6M6 17l4.3-3.6M18 17l-4.3-3.6"/>',
  oop:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>'
};
function logo(k,size){
  var b=LOGOS[k];
  if(b)return '<svg viewBox="0 0 24 24" width="'+(size||150)+'" height="'+(size||150)+'" role="img" aria-hidden="true"><path fill="#'+b.hex+'" d="'+b.path+'"/></svg>';
  return '<svg viewBox="0 0 24 24" width="'+(size||150)+'" height="'+(size||150)+'" fill="none" stroke="currentColor" stroke-width="0.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICON[k]||'')+'</svg>';
}

function glyph(k,size){
  var b=LOGOS[k];if(!b)return '';
  return '<svg viewBox="0 0 24 24" width="'+(size||18)+'" height="'+(size||18)+'" fill="currentColor" aria-hidden="true"><path d="'+b.path+'"/></svg>';
}
/* hero: add brand icons to the core-tech chips (text stays if JS is off) */
$$('#heroStack li').forEach(function(li){li.insertAdjacentHTML('afterbegin',logo(li.dataset.k,16))});

/* theme-independent helpers */
var nav=$('#nav'),prog=$('#prog');
function onScroll(){
  var y=window.scrollY,h=document.documentElement.scrollHeight-innerHeight;
  nav.classList.toggle('scrolled',y>40);
  prog.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  tlUpdate();
}

/* reveal once */
var rvIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');rvIO.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.rv-mask').forEach(function(el){rvIO.observe(el)});

/* split contact heading into hoppable letters */
$$('[data-split]').forEach(function(sp){
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var f=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(word){
          if(!word)return;
          if(/^\s+$/.test(word)){f.appendChild(document.createTextNode(' '));return}
          var w=document.createElement('span');w.className='wd';  /* keeps a word from breaking mid-letter */
          word.split('').forEach(function(c){
            var s=document.createElement('span');s.className='ch';s.textContent=c;s.setAttribute('aria-hidden','true');
            s.addEventListener('pointerenter',function(){s.classList.remove('hop');void s.offsetWidth;s.classList.add('hop')});
            w.appendChild(s);
          });
          f.appendChild(w);
        });
        node.replaceChild(f,n);
      }else if(n.nodeType===1){walk(n)}
    });
  })(sp);
});

/* nav: indicator, active section, overlay */
var pill=$('#pill'),ind=$('#ind'),links=$$('a',pill),activeS=null;
function moveInd(){
  var a=links.filter(function(l){return l.classList.contains('on')})[0];
  if(!a){ind.style.opacity=0;return}
  ind.style.opacity=1;ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)';
}
var secIO=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting){activeS=e.target.id;links.forEach(function(l){l.classList.toggle('on',l.dataset.s===activeS)});moveInd()}
})},{rootMargin:'-45% 0px -50% 0px'});
['about','skills','work','experience','contact'].forEach(function(id){secIO.observe(document.getElementById(id))});
$('#hero')&&new IntersectionObserver(function(es){if(es[0].isIntersecting){links.forEach(function(l){l.classList.remove('on')});moveInd()}},{rootMargin:'-45% 0px -50% 0px'}).observe($('#hero'));
addEventListener('resize',moveInd);
var ov=$('#ov'),mb=$('#menuBtn');
function setMenu(o){ov.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''}
mb.addEventListener('click',function(){setMenu(true)});
$('#closeBtn').addEventListener('click',function(){setMenu(false)});
$$('a',ov).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false)});

/* ID card: barcode, flip, pendulum */
(function(){
  var b=$('#bars'),seed=7;
  for(var i=0;i<34;i++){seed=(seed*9301+49297)%233280;var i2=document.createElement('i');i2.style.width=(1+Math.floor(seed/233280*3))+'px';b.appendChild(i2)}
  var card=$('#card');
  function toggle(){var f=card.classList.toggle('flipped');card.setAttribute('aria-pressed',f)}
  card.addEventListener('click',function(){if(!matchMedia('(hover:hover)').matches)toggle()});
  card.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}});
  if(RM)return;
  var sw=$('#swing'),sec=$('#about'),ang=0,vel=0,lastX=null,run=false,t0=performance.now();
  function frame(t){
    if(!run)return;
    vel+=-0.022*ang-0.028*vel;ang+=vel;
    var idle=Math.sin((t-t0)/1500)*1.1;
    sw.style.transform='rotate('+(ang+idle).toFixed(3)+'deg)';
    requestAnimationFrame(frame);
  }
  new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!run){run=true;requestAnimationFrame(frame)}else if(!v){run=false}}).observe(sec);
  function move(x){
    if(lastX!==null){var dx=x-lastX;vel+=Math.max(-3,Math.min(3,dx*0.035));vel=Math.max(-2.2,Math.min(2.2,vel))}
    lastX=x;
  }
  sec.addEventListener('pointermove',function(e){move(e.clientX)});
  sec.addEventListener('pointerleave',function(){lastX=null});
})();

/* skills */
var SK=[
 ['python','Py','Python','Languages','EARNIFY and the AI/ML internship'],
 ['javascript','Js','JavaScript','Languages','EARNIFY front end'],
 ['sql','Sq','SQL','Languages','Database schemas and queries in EARNIFY'],
 ['ai','Ai','Artificial Intelligence','AI/ML','AI/ML internship'],
 ['ml','Ml','Machine Learning','AI/ML','AI/ML internship'],
 ['llm','Ll','LLMs','AI/ML','AI/ML internship'],
//  ['rag','Rg','RAG','AI/ML','AI/ML internship'],
//  ['langchain','Lc','LangChain','AI/ML','Listed in my résumé skills'],
 ['prompt','Pe','Prompt Engineering','AI/ML','AI/ML internship'],
 ['flask','Fl','Flask','Frameworks','EARNIFY backend: routing and business logic'],
 ['bootstrap','Bs','Bootstrap','Frameworks','Listed in my résumé skills'],
 ['pandas','Pd','Pandas','Frameworks','Listed in my résumé skills'],
 ['numpy','Np','NumPy','Frameworks','Listed in my résumé skills'],
 ['mysql','My','MySQL','Databases','EARNIFY database; MySQL certificate'],
 ['html','Ht','HTML','Web','EARNIFY front end'],
 ['css','Cs','CSS','Web','EARNIFY front end'],
 ['git','Gt','Git','Tools','Version control'],
 ['github','Gh','GitHub','Tools','Version control and project hosting'],
 ['dsa','Ds','Data Structures and Algorithms','Concepts','Core concept from my degree'],
 ['dbms','Db','DBMS','Concepts','Core concept from my degree'],
 ['os','Os','Operating Systems','Concepts','Core concept from my degree'],
 ['net','Cn','Computer Networks','Concepts','Core concept from my degree'],
 ['oop','Oo','OOP','Concepts','Core concept from my degree']
];
(function(){
  var grid=$('#grid'),chips=$('#chips'),fams=['All'],tiles=[],cur=null;
  SK.forEach(function(s){if(fams.indexOf(s[3])<0)fams.push(s[3])});
  SK.forEach(function(s,i){
    var t=document.createElement('button');t.type='button';t.className='tile';
    t.innerHTML='<span class="n"><i class="fd" data-f="'+s[3]+'"></i>'+(i+1)+'</span><span class="sym">'+s[1]+'</span><span class="nm">'+s[2]+'</span>';
    t.setAttribute('aria-label',s[2]+', '+s[3]);
    ['mouseenter','focus','click'].forEach(function(ev){t.addEventListener(ev,function(){show(i)})});
    grid.appendChild(t);tiles.push(t);
  });
  function show(i){
    if(cur===i)return;cur=i;var s=SK[i];
    tiles.forEach(function(t,j){t.classList.toggle('sel',j===i)});
    var lb=$('#lb');$('#lg').innerHTML=logo(s[0],150);
    var b=LOGOS[s[0]];$('#glow').style.background=b?'#'+b.hex:'transparent';$('#glow').style.display=b?'block':'none';
    lb.classList.remove('pop');void lb.offsetWidth;lb.classList.add('pop');
    $('#iname').textContent=s[2];$('#ifam').textContent=s[3];$('#ifam').setAttribute('data-f',s[3]);$('#iuse').textContent=s[4];
  }
  show(0);
  fams.forEach(function(f,i){
    var c=document.createElement('button');c.type='button';c.className='chip';c.innerHTML=(i?'<i class="fd" data-f="'+f+'"></i>':'')+f;c.setAttribute('aria-pressed',i===0);
    c.addEventListener('click',function(){
      $$('.chip',chips).forEach(function(x){x.setAttribute('aria-pressed',x===c)});
      tiles.forEach(function(t,j){t.classList.toggle('dim',f!=='All'&&SK[j][3]!==f)});
    });chips.appendChild(c);
  });
  new IntersectionObserver(function(es,o){
    if(es[0].isIntersecting){
      var cols=getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      tiles.forEach(function(t,j){t.style.setProperty('--d',((Math.floor(j/cols)+j%cols)*40)+'ms')});
      grid.classList.add('is-in');o.disconnect();
    }
  },{threshold:.15}).observe(grid);
})();

/* work accordion */
var PROJECTS=[{
  n:'01',kick:'Full-stack web app · Freelancing platform',title:'EARNIFY',
  desc:'A full-stack freelancing platform connecting clients and freelancers, supporting job posting, browsing, and application workflows.',
  feats:['Job posting for clients','Job browsing for freelancers','Application workflows','Responsive HTML, CSS and JavaScript front end','Flask backend for routing and business logic','MySQL and MongoDB schemas','User accounts and job postings','Simple navigation for students and first-time freelancers'],
  tech:[['python','Python'],['flask','Flask'],['mysql','MySQL'],['html','HTML'],['css','CSS'],['javascript','JavaScript']],
  link:'https://github.com/nagarjunabande8-vk/EARNIFY'
}];
(function(){
  var acc=$('#acc');
  PROJECTS.forEach(function(p,i){
    var d=document.createElement('article');d.className='panel'+(i===0?' open':'');d.tabIndex=0;
    d.innerHTML='<div class="spine"><span class="mono" style="font-size:12px;color:var(--mute)">'+p.n+'</span><span class="vt">'+p.title+'</span><span class="pl" aria-hidden="true">+</span></div>'+
    '<div class="pbody"><div class="pl-left"><div class="kick">'+p.n+' — '+p.kick+'</div><h3>'+p.title+'</h3><p>'+p.desc+'</p>'+
    '<ul class="feat">'+p.feats.map(function(f){return '<li>'+f+'</li>'}).join('')+'</ul>'+
    '<div class="techs">'+p.tech.map(function(t){return '<span class="tch">'+logo(t[0],16)+t[1]+'</span>'}).join('')+'</div>'+
    '<div class="btn-row">'+(p.link?'<a class="btn primary" href="'+p.link+'" target="_blank" rel="noopener">'+glyph('github',18)+'View on GitHub <span class="ar2" aria-hidden="true">↗</span></a>':'')+(p.demo?'<a class="btn ghost" href="'+p.demo+'" target="_blank" rel="noopener">Live demo <span class="ar2" aria-hidden="true">↗</span></a>':'')+'</div></div>'+
    '<div class="pl-right"><div class="ui" aria-hidden="true"><div class="dots"><i></i><i></i><i></i></div><div class="search">Search jobs</div>'+
    '<div class="job"><div class="av"></div><div class="ln"><i></i><i></i></div><span class="ap">Apply</span></div>'+
    '<div class="job"><div class="av"></div><div class="ln"><i></i><i></i></div><span class="ap">Apply</span></div>'+
    '<div class="job"><div class="av"></div><div class="ln"><i></i><i></i></div><span class="ap">Apply</span></div></div>'+
    '<span class="ui-label">Illustrative UI</span></div></div>';
    ['mouseenter','focus','click'].forEach(function(ev){d.addEventListener(ev,function(){$$('.panel',acc).forEach(function(x){x.classList.toggle('open',x===d)})})});
    acc.appendChild(d);
  });
})();

/* path timeline */
var tl=$('#tl'),spF=$('#spineF'),stops=$$('.stop');
function tlUpdate(){
  var r=tl.getBoundingClientRect(),vh=innerHeight,line=vh*.6;
  var p=Math.max(0,Math.min(1,(line-r.top)/r.height));
  spF.style.transform='scaleY('+p+')';
  stops.forEach(function(s){var sr=s.getBoundingClientRect();s.classList.toggle('lit',sr.top<line)});
}

/* copy email */
$('#copy').addEventListener('click',function(){
  var b=this,t='nagarjunabande8@gmail.com';
  function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy email'},1800)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){b.textContent=t})}else{b.textContent=t}
});

var ticking=false;
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(function(){ticking=false;onScroll()})}},{passive:true});
addEventListener('resize',onScroll);onScroll();
