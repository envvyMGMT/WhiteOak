/* Blackbeam — shared interactions */
(function(){
  // MOBILE menu
  var toggle=document.getElementById('navToggle');
  if(toggle){
    toggle.addEventListener('click',function(){
      var open=document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
    document.querySelectorAll('#mobileMenu a').forEach(function(a){
      a.addEventListener('click',function(){document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');});
    });
  }

  // TRAILER modal
  var modal=document.getElementById('trailerModal');
  if(modal){
    var closeBtn=document.getElementById('modalClose'),frame=document.getElementById('modalFrame');
    var originalFrame=frame.innerHTML;
    function openModal(){modal.classList.add('open');document.body.classList.add('no-scroll');}
    function closeModal(){modal.classList.remove('open');document.body.classList.remove('no-scroll');frame.innerHTML=originalFrame;}
    document.querySelectorAll('[data-trailer]').forEach(function(b){b.addEventListener('click',openModal);});
    closeBtn.addEventListener('click',closeModal);
    modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q'),a=item.querySelector('.faq-a');
    q.addEventListener('click',function(){
      var open=item.classList.toggle('open');
      a.style.maxHeight=open?a.scrollHeight+'px':null;
    });
  });

  // QUOTE form (client-side demo until a Formspree/Netlify action="" is set)
  var form=document.getElementById('quoteForm');
  if(form){
    var success=document.getElementById('formSuccess');
    form.addEventListener('submit',function(e){
      if(!form.getAttribute('action')){
        e.preventDefault();
        form.classList.add('sent');
        success.classList.add('show');
        success.scrollIntoView({behavior:'smooth',block:'center'});
      }
    });
  }

  // REVEAL on scroll
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }
})();
