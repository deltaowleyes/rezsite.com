(function(){
 var EMAIL='leah@rezsite.com';
 var $=function(id){return document.getElementById(id)};
 var slug=function(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/&/g,'and').replace(/[^a-z0-9]+/g,'').slice(0,40)};
 var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
 var norm=function(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')};
 /* claim */
 var i=$('biz'),f=$('claimForm');
 if(i&&f){
  var meas=$('meas'),fit=function(){if(!meas)return;meas.textContent=i.value||i.placeholder;var max=i.parentNode.clientWidth-130;i.style.width=Math.max(60,Math.min(meas.offsetWidth+3,max))+'px'};
  fit();if(document.fonts)document.fonts.ready.then(fit);addEventListener('resize',fit);
  i.addEventListener('input',function(){var n=slug(i.value)||i.dataset.def||'yourbusiness';document.querySelectorAll('[data-live]').forEach(function(e){e.textContent=n});fit()});
  f.addEventListener('submit',function(e){e.preventDefault();var n=slug(i.value)||'yourbusiness';var m=$('claimMsg');if(m)m.innerHTML='Opening your email… If nothing opens, email <b>'+EMAIL+'</b> with the subject “Claim '+n+'.rezsite.com”.';location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Claim '+n+'.rezsite.com')+'&body='+encodeURIComponent('Hi Leah,\n\nI would like a free preview of my website at '+n+'.rezsite.com.\n\nBusiness name: '+i.value+'\nTown / community:\nPhone:\n')});
 }
 /* live directory search over 4,996 listings */
 var dq=$('dq'),dres=$('dres'),D=null,ld=null;
 function load(){if(D)return Promise.resolve(D);if(ld)return ld;ld=new Promise(function(r){var s=document.createElement('script');s.src='assets/home/biz.js';s.onload=function(){D=window.BIZ;D.r.forEach(function(x){x.k=norm(x[0]+' '+x[1])});r(D)};document.head.appendChild(s)});return ld}
 function run(){var t=norm(dq.value.trim());if(t.length<2){dres.innerHTML='';return}
  load().then(function(D){var m=D.r.filter(function(x){return x.k.indexOf(t)>-1}),k=+(dres.dataset.max||4);
   dres.innerHTML=m.slice(0,k).map(function(x){return '<div class="res"><span><b>'+esc(x[0])+'</b><small>'+esc(x[1]?x[1]+', ':'')+x[2]+'</small></span>'+(x[4]?'<span class="pill y">Has a website</span>':'<a class="pill n" href="#claim">No website yet →</a>')+'</div>'}).join('')+'<p class="res-more">'+(m.length?m.length.toLocaleString('en-CA')+' match'+(m.length>1?'es':'')+'. ':'No matches. ')+'<a href="https://rezsite.com/directory.html?type=businesses">Open the full directory →</a></p>'})}
 if(dq){dq.addEventListener('focus',load,{once:true});dq.addEventListener('input',run);var sf=dq.form;if(sf)sf.addEventListener('submit',function(e){e.preventDefault();run()});if(location.hash==='#demo'){dq.value='Kettle Point';run()}}
 /* events */
 var el=$('evList');
 if(el&&window.EVENTS){var E=window.EVENTS,today=new Date().toISOString().slice(0,10),L=E.filter(function(e){return e[0]>=today});if(L.length<6)L=E.slice(-6);
  var seen={},days={},n=+(el.dataset.count||4);L=L.filter(function(e){var k=e[1].split(' — ')[0];if(seen[k]||days[e[0]])return false;seen[k]=days[e[0]]=1;return true}).slice(0,n);
  var M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  el.innerHTML=L.map(function(e){var d=e[0].split('-');return '<a class="ev" href="'+esc(e[5]||'https://rezsite.com/directory.html?type=events')+'" rel="noopener"><span class="d"><small>'+M[+d[1]-1]+'</small><b>'+(+d[2])+'</b></span><span><span class="t">'+esc(e[1])+'</span><span class="w">'+esc(e[2])+', '+esc(e[3])+'</span></span></a>'}).join('')}
 /* menu */
 var b=document.querySelector('.menu-btn'),nv=$('nav');
 if(b&&nv){b.addEventListener('click',function(){var o=nv.classList.toggle('open');b.setAttribute('aria-expanded',o)});nv.addEventListener('click',function(e){if(e.target.tagName==='A'){nv.classList.remove('open');b.setAttribute('aria-expanded',false)}})}
 /* reveal */
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}})},{threshold:.2});document.querySelectorAll('[data-reveal]').forEach(function(x){io.observe(x)})}else document.querySelectorAll('[data-reveal]').forEach(function(x){x.classList.add('on')});
})();
