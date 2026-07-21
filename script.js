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
    var embed=frame.getAttribute('data-embed');
    function openModal(){
      modal.classList.add('open');document.body.classList.add('no-scroll');
      // Inject the player with sound + controls on open (kept out of the DOM until needed)
      if(embed){frame.innerHTML='<iframe src="'+embed+'" title="Blackbeam trailer" allow="autoplay; encrypted-media; fullscreen" allowfullscreen frameborder="0"></iframe>';}
    }
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

  // QUOTE form — AJAX submit to Formspree/FormSubmit (no page reload).
  var form=document.getElementById('quoteForm');
  if(form){
    var success=document.getElementById('formSuccess');
    function showSuccess(){
      form.classList.add('sent');
      success.classList.add('show');
      success.scrollIntoView({behavior:'smooth',block:'center'});
    }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      // honeypot — if a bot filled the hidden field, silently drop it
      var hp=form.querySelector('[name="_gotcha"]');
      if(hp&&hp.value){return;}
      var action=form.getAttribute('action')||'';
      // Not configured yet → just show the demo success (does NOT email you)
      if(!action||action.indexOf('YOUR_FORM_ID')!==-1){showSuccess();return;}
      var btn=form.querySelector('.form-submit'),label=btn?btn.textContent:'';
      if(btn){btn.disabled=true;btn.textContent='Sending…';}
      fetch(action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
        .then(function(r){
          if(r.ok){form.reset();showSuccess();}
          else{throw new Error('bad response');}
        })
        .catch(function(){
          if(btn){btn.disabled=false;btn.textContent=label;}
          alert('Sorry — something went wrong sending that. Please call or text (417) 555-0100 and we’ll take care of you.');
        });
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
